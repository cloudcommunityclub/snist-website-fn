import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'
import DigitalIndiaReferral from '@/models/DigitalIndiaReferral'
import { escHtml, sendEmail } from '@/lib/mail'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'Submission ID is required.' }, { status: 400 })
    }

    await dbConnect()

    // Find the submission
    const submission = await DigitalIndiaSubmission.findById(id)
    if (!submission) {
      return NextResponse.json({ success: false, message: 'Submission not found.' }, { status: 404 })
    }

    // Check if already in Accepted table to prevent duplicates
    const existingAccepted = await DigitalIndiaAccepted.findOne({ email: submission.email })
    if (existingAccepted) {
      return NextResponse.json({ success: false, message: 'Candidate has already been accepted.' }, { status: 400 })
    }

    // Create accepted participant record
    const acceptedParticipant = new DigitalIndiaAccepted({
      name: submission.name,
      college: submission.college,
      email: submission.email,
      phone: submission.phone,
      idea: submission.idea,
      utrId: submission.utrId,
      paymentScreenshotUrl: submission.paymentScreenshotUrl,
      // copy new referral & team fields
      teamName: submission.teamName,
      domain: submission.domain,
      teamSize: submission.teamSize,
      teamMembers: submission.teamMembers,
      referralCode: submission.referralCode,
      referredByCode: submission.referredByCode,
      referralPoints: submission.referralPoints,
      lastPointEarnedAt: submission.lastPointEarnedAt || submission.createdAt,
      acceptedAt: new Date(),
      acceptedBy: 'Admin',
    })

    await acceptedParticipant.save()

    // Delete from submissions table
    await DigitalIndiaSubmission.findByIdAndDelete(id)

    // Update referral records to use the new accepted participant ObjectId
    try {
      // 1. If this team was referred by someone, update their referredTeamId
      await DigitalIndiaReferral.updateOne(
        { referredEmail: submission.email },
        { referredTeamId: acceptedParticipant._id }
      )

      // 2. If this team referred other teams, update their referrerTeamId
      await DigitalIndiaReferral.updateMany(
        { referrerEmail: submission.email },
        { referrerTeamId: acceptedParticipant._id }
      )
    } catch (refUpdateErr) {
      console.error('❌ Failed to update referral ObjectIds on accept:', refUpdateErr)
    }


    // Send shortlisted SMTP mail
    try {
      const whatsappLink = process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/mock-digital-india'
      const hackathonLink = process.env.HACKATHON_REGISTRATION_LINK || 'https://c3-digital-india-hackathon.example.com'

      const htmlBody = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Congratulations! You are Shortlisted</title>
  <style type="text/css">
    body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; background-color: #09090b; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .btn { display: inline-block; padding: 12px 28px; color: #09090b !important; background-color: #9dff00; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 14px; margin-top: 10px; margin-bottom: 10px; text-align: center; }
    .btn-green { background-color: #9dff00; }
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
            <td align="center" style="padding: 45px 40px 25px 40px; background: linear-gradient(135deg, #18181b 0%, #09090b 100%); border-bottom: 1px solid #27272a;">
               <div style="margin-bottom: 15px;">
                 <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9dff00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;">
                   <path d="M5.8 11.3 2 22l10.7-3.8" />
                   <path d="m14 18 1-3.5 3.5-1" />
                   <path d="M12 6h.01" />
                   <path d="M18 10h.01" />
                   <path d="M10 2h.01" />
                   <path d="M4 14h.01" />
                   <path d="M15.5 3.5h.01" />
                   <path d="M22 2c-2 2-2 4-4 4s-2-2-4-2-2 2-4 2" />
                   <path d="M20 6c-1.5 1.5-1.5 3-3 3s-1.5-1.5-3-1.5-1.5 1.5-3 1.5" />
                 </svg>
               </div>
               <h1 style="margin: 0; font-size: 26px; color: #ffffff; font-weight: 800; letter-spacing: -0.5px;">Shortlisted!</h1>
               <p style="margin: 5px 0 0 0; font-size: 14px; color: #9dff00; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">Digital India Hackathon</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td align="left" style="padding: 40px 40px 30px 40px;">
              <p style="margin: 0; font-size: 16px; color: #ffffff; line-height: 1.6;">
                Dear <strong>${escHtml(submission.name)}</strong>,
              </p>
              <p style="margin: 15px 0 0 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                Congratulations! We are thrilled to inform you that your idea pitch has been <strong>shortlisted</strong> for the final round of the Digital India Hackathon.
              </p>
              <p style="margin: 15px 0 0 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                Please complete the following next steps immediately to lock in your participation and secure your team's slot:
              </p>
            </td>
          </tr>
          <!-- Steps List -->
          <tr>
            <td style="padding: 0 40px 40px 40px; background-color: #18181b;">
              <div style="border-top: 1px solid #27272a; margin-bottom: 35px;"></div>
              
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="28" valign="top" style="padding-bottom: 30px;">
                    <div style="background-color: #27272a; color: #9dff00; font-weight: bold; font-size: 13px; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-family: monospace;">1</div>
                  </td>
                  <td style="padding-bottom: 30px; color: #a1a1aa; font-size: 15px; line-height: 1.5;">
                    <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Join the Official WhatsApp Group</strong>
                    <span style="color: #71717a; font-size: 13px; display: block; margin-bottom: 12px;">Get real-time announcements, form/merge teams, and access mentor resources.</span>
                    <a href="${whatsappLink}" class="btn btn-green">Join WhatsApp Group</a>
                  </td>
                </tr>
                <tr>
                  <td width="28" valign="top">
                    <div style="background-color: #27272a; color: #9dff00; font-weight: bold; font-size: 13px; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-family: monospace;">2</div>
                  </td>
                  <td style="color: #a1a1aa; font-size: 15px; line-height: 1.5;">
                    <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Register for the Final Hackathon Build</strong>
                    <span style="color: #71717a; font-size: 13px; display: block; margin-bottom: 12px;">Lock in your team structure, submit your project build plan, and secure entry.</span>
                    <a href="${hackathonLink}" class="btn">Register for Hackathon</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #09090b; border-top: 1px solid #27272a;">
               <p style="margin: 0; color: #52525b; font-size: 12px; line-height: 1.5;">
                 © 2026 <strong>Cloud Community Club (C³)</strong>.<br>
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
        submission.email,
        '🎉 Shortlisted Announcement: Digital India Hackathon',
        htmlBody
      )
      console.log(`✅ Acceptance email sent successfully to ${submission.email}`)
    } catch (emailError) {
      console.error('❌ Acceptance Email Failed:', (emailError as Error).message)
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate accepted and notification email sent.',
      data: acceptedParticipant,
    })
  } catch (error) {
    console.error('Accept candidate error:', error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
