import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'
import DigitalIndiaReferral from '@/models/DigitalIndiaReferral'
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { escHtml, sendEmail } from '@/lib/mail'

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function generateUniqueReferralCode(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  let attempts = 0
  while (attempts < 20) {
    code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const existsSub = await DigitalIndiaSubmission.findOne({ referralCode: code })
    const existsAcc = await DigitalIndiaAccepted.findOne({ referralCode: code })
    if (!existsSub && !existsAcc) {
      return code
    }
    attempts++
  }
  throw new Error('Could not generate a unique referral code after multiple attempts.')
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const name = formData.get('name') as string
    const college = formData.get('college') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const idea = formData.get('idea') as string
    const utrId = formData.get('utrId') as string
    const screenshot = formData.get('screenshot') as File | null

    // New Team Details
    const teamName = formData.get('teamName') as string
    const domain = formData.get('domain') as string
    const teamSize = formData.get('teamSize') as string
    const teamMembersJson = formData.get('teamMembers') as string
    const referredByRaw = formData.get('referredBy') as string | null

    if (!name || !college || !email || !phone || !idea || !utrId || !screenshot || !teamName || !domain || !teamSize) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address.' },
        { status: 400 }
      )
    }

    // Validate phone format
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { success: false, message: 'Invalid Indian phone number.' },
        { status: 400 }
      )
    }

    // Validate idea length
    if (idea.trim().length < 50) {
      return NextResponse.json(
        { success: false, message: 'Idea description must be at least 50 characters.' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Check duplicates (email and UTR) across both collections
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedUtr = utrId.trim()
    const normalizedTeamName = teamName.trim()

    const existingEmailSub = await DigitalIndiaSubmission.findOne({ email: normalizedEmail })
    const existingEmailAcc = await DigitalIndiaAccepted.findOne({ email: normalizedEmail })
    if (existingEmailSub || existingEmailAcc) {
      return NextResponse.json(
        { success: false, message: 'A submission with this email already exists.' },
        { status: 400 }
      )
    }

    const existingUtrSub = await DigitalIndiaSubmission.findOne({ utrId: normalizedUtr })
    const existingUtrAcc = await DigitalIndiaAccepted.findOne({ utrId: normalizedUtr })
    if (existingUtrSub || existingUtrAcc) {
      return NextResponse.json(
        { success: false, message: 'A submission with this UTR ID already exists.' },
        { status: 400 }
      )
    }

    // Check team name duplicate across both collections (case insensitive)
    const existingTeamNameSub = await DigitalIndiaSubmission.findOne({ teamName: new RegExp(`^${escapeRegex(normalizedTeamName)}$`, 'i') })
    const existingTeamNameAcc = await DigitalIndiaAccepted.findOne({ teamName: new RegExp(`^${escapeRegex(normalizedTeamName)}$`, 'i') })
    if (existingTeamNameSub || existingTeamNameAcc) {
      return NextResponse.json(
        { success: false, message: 'A team with this name already exists.' },
        { status: 400 }
      )
    }

    // Validate referral code if provided
    let referredByCode = referredByRaw ? referredByRaw.trim().toUpperCase() : null
    let referrerDoc: any = null

    if (referredByCode) {
      referrerDoc = await DigitalIndiaAccepted.findOne({ referralCode: referredByCode }) ||
                    await DigitalIndiaSubmission.findOne({ referralCode: referredByCode })

      if (!referrerDoc) {
        return NextResponse.json(
          { success: false, message: 'Invalid referral code.' },
          { status: 400 }
        )
      }

      // Check self referral
      if (referrerDoc.email === normalizedEmail || referrerDoc.phone === phone.trim()) {
        return NextResponse.json(
          { success: false, message: 'Self-referrals are not allowed.' },
          { status: 400 }
        )
      }
    }

    // Upload screenshot to Cloudflare R2
    const bytes = await screenshot.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExtension = screenshot.name.split('.').pop() || 'png'
    const randomString = Math.random().toString(36).substring(2, 8)
    const key = `digital-india/screenshot-${Date.now()}-${randomString}.${fileExtension}`

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: screenshot.type || 'image/png',
      })
    )

    const publicUrlBase = R2_PUBLIC_URL?.endsWith('/')
      ? R2_PUBLIC_URL.slice(0, -1)
      : R2_PUBLIC_URL
    const paymentScreenshotUrl = `${publicUrlBase}/${key}`

    // Generate unique referral code for the new team
    const referralCode = await generateUniqueReferralCode()

    // Parse team members
    let teamMembers = []
    try {
      teamMembers = JSON.parse(teamMembersJson || '[]')
    } catch (e) {
      console.error('Error parsing team members:', e)
    }

    // Create database record
    const newSubmission = new DigitalIndiaSubmission({
      name: name.trim(),
      college: college.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      idea: idea.trim(),
      utrId: normalizedUtr,
      paymentScreenshotUrl,
      paymentVerified: false,
      teamName: normalizedTeamName,
      domain: domain.trim(),
      teamSize: Number(teamSize),
      teamMembers,
      referralCode,
      referredByCode: referredByCode || undefined,
      referralPoints: 0,
      lastPointEarnedAt: new Date(),
    })

    await newSubmission.save()

    console.log(`✅ Digital India Submission recorded for ${normalizedEmail}`)

    // If referral exists, award point immediately and log referral record
    if (referrerDoc) {
      try {
        const referralExists = await DigitalIndiaReferral.findOne({ referredEmail: normalizedEmail })
        if (!referralExists) {
          const referralRecord = new DigitalIndiaReferral({
            referrerTeamId: referrerDoc._id,
            referredTeamId: newSubmission._id,
            referrerEmail: referrerDoc.email,
            referredEmail: normalizedEmail,
          })
          await referralRecord.save()

          await referrerDoc.updateOne({
            $inc: { referralPoints: 1 },
            $set: { lastPointEarnedAt: new Date() }
          })
          console.log(`🎉 Referral point successfully awarded to ${referrerDoc.email}`)
        }
      } catch (refErr) {
        console.error('❌ Failed to award referral points:', refErr)
      }
    }

    // Send confirmation email
    try {
      const htmlBody = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Submission Confirmed - Digital India Hackathon</title>
  <style type="text/css">
    body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; background-color: #09090b; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .capitalize { text-transform: capitalize; }
    @media only screen and (max-width: 600px) {
      .width-full { width: 100% !important; max-width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; color: #e4e4e7;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #09090b;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" class="width-full" style="width: 600px; max-width: 600px; background-color: #18181b; border-radius: 24px; border: 1px solid #27272a; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; background: linear-gradient(135deg, #18181b 0%, #09090b 100%); border-bottom: 1px solid #27272a;">
               <div style="margin-bottom: 15px;">
                 <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9dff00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;">
                   <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                   <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                   <path d="M9 12H4s.5-1.5 2-3l3 3z"/>
                   <path d="M12 15v5s1.5-.5 3-2l-3-3z"/>
                   <path d="M17 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0z"/>
                 </svg>
               </div>
               <h1 style="margin: 0; font-size: 26px; color: #ffffff; font-weight: 800; letter-spacing: -0.5px;">Digital India Hackathon</h1>
               <p style="margin: 5px 0 0 0; font-size: 14px; color: #9dff00; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">Idea Submission Received</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td align="left" style="padding: 40px 40px 30px 40px;">
              <p style="margin: 0; font-size: 16px; color: #ffffff; line-height: 1.6;">
                Hi <strong style="color: #9dff00;">${escHtml(name.trim())}</strong>,
              </p>
              <p style="margin: 15px 0 0 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                Thank you for submitting your innovation proposal for the <strong>Digital India Hackathon</strong>! We have successfully registered your details and payment screenshot.
              </p>
              <p style="margin: 15px 0 0 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                Our admin panel will verify your payment details and evaluate your idea description. Below is a summary of your submission details:
              </p>
            </td>
          </tr>
          <!-- Detail Card -->
          <tr>
            <td align="center" style="padding: 0 40px 30px 40px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #09090b; border-radius: 16px; border: 1px solid #27272a; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="35%" style="padding-bottom: 12px; color: #71717a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace;">Team Name</td>
                        <td style="padding-bottom: 12px; color: #ffffff; font-size: 14px; font-weight: 600;">${escHtml(normalizedTeamName)}</td>
                      </tr>
                      <tr>
                        <td width="35%" style="padding-bottom: 12px; color: #71717a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace;">Leader Name</td>
                        <td style="padding-bottom: 12px; color: #ffffff; font-size: 14px; font-weight: 600;">${escHtml(name.trim())}</td>
                      </tr>
                      <tr>
                        <td width="35%" style="padding-bottom: 12px; color: #71717a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace;">College</td>
                        <td style="padding-bottom: 12px; color: #e4e4e7; font-size: 14px;">${escHtml(college.trim())}</td>
                      </tr>
                      <tr>
                        <td width="35%" style="padding-bottom: 12px; color: #71717a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace;">Email</td>
                        <td style="padding-bottom: 12px; color: #e4e4e7; font-size: 14px;">${escHtml(normalizedEmail)}</td>
                      </tr>
                      <tr>
                        <td width="35%" style="padding-bottom: 12px; color: #71717a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace;">UTR ID</td>
                        <td style="padding-bottom: 12px; color: #9dff00; font-size: 14px; font-weight: bold; font-family: monospace;">${escHtml(normalizedUtr)}</td>
                      </tr>
                      <tr>
                        <td width="35%" style="padding-bottom: 12px; color: #71717a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace;">Referral Code</td>
                        <td style="padding-bottom: 12px; color: #9dff00; font-size: 14px; font-weight: bold; font-family: monospace;">${escHtml(referralCode)}</td>
                      </tr>
                      <tr>
                        <td width="35%" style="color: #71717a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top; font-family: monospace;">Idea Abstract</td>
                        <td style="color: #a1a1aa; font-size: 13px; line-height: 1.5; font-style: italic;">
                          ${escHtml(idea.trim().length > 150 ? idea.trim().substring(0, 150) + '...' : idea.trim())}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Steps -->
          <tr>
            <td style="padding: 0 40px 40px 40px; background-color: #18181b;">
              <div style="border-top: 1px solid #27272a; margin-bottom: 30px;"></div>
              <h3 style="margin: 0 0 20px 0; font-size: 14px; text-transform: uppercase; color: #71717a; letter-spacing: 1px; font-weight: bold; font-family: monospace;">
                What Happens Next?
              </h3>
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="28" valign="top" style="padding-bottom: 20px;">
                    <div style="background-color: #27272a; color: #9dff00; font-weight: bold; font-size: 12px; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-family: monospace;">1</div>
                  </td>
                  <td style="padding-bottom: 20px; color: #a1a1aa; font-size: 14px; line-height: 1.4;">
                    <strong style="color: #ffffff;">Share & Earn Rewards</strong><br>
                    Share your referral code <strong style="color:#9dff00;">${referralCode}</strong>. Get 10 successful referrals to qualify for FREE hackathon passes!
                  </td>
                </tr>
                <tr>
                  <td width="28" valign="top" style="padding-bottom: 20px;">
                    <div style="background-color: #27272a; color: #9dff00; font-weight: bold; font-size: 12px; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-family: monospace;">2</div>
                  </td>
                  <td style="padding-bottom: 20px; color: #a1a1aa; font-size: 14px; line-height: 1.4;">
                    <strong style="color: #ffffff;">Payment Verification</strong><br>
                    Our team validates your UTR ID against bank statements (takes 24-48 hours).
                  </td>
                </tr>
                <tr>
                  <td width="28" valign="top">
                    <div style="background-color: #27272a; color: #9dff00; font-weight: bold; font-size: 12px; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-family: monospace;">3</div>
                  </td>
                  <td style="color: #a1a1aa; font-size: 14px; line-height: 1.4;">
                    <strong style="color: #ffffff;">Shortlisting Results</strong><br>
                    If shortlisted, you will receive an acceptance email with instructions to register for the main event and join the community.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #09090b; border-top: 1px solid #27272a;">
               <p style="margin: 0; color: #52525b; font-size: 12px; line-height: 1.5;">
                 This email was sent automatically to confirm your registration.<br>
                 © 2026 <strong>Cloud Community Club (C³)</strong> & <strong>SNIST</strong>.<br>
                 Sreenidhi Institute of Science and Technology.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
            `
      await sendEmail(
        normalizedEmail,
        '📬 Submission Received: Digital India Hackathon',
        htmlBody
      )
      console.log(`✅ Submission email sent successfully to ${normalizedEmail}`)
    } catch (emailError) {
      console.error('❌ Submission Email Failed:', (emailError as Error).message)
    }

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully!',
      referralCode,
    })
  } catch (error) {
    console.error('Digital India Submission Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
