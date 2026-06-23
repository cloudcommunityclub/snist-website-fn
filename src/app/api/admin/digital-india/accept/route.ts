import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'
import { escHtml, sendEmail } from '@/lib/gmail'

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
            acceptedAt: new Date(),
            acceptedBy: 'Admin',
        })

        await acceptedParticipant.save()

        // Delete from submissions table
        await DigitalIndiaSubmission.findByIdAndDelete(id)

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
    body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; background-color: #f4f4f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .btn { display: inline-block; padding: 12px 24px; color: #ffffff !important; background-color: #3b82f6; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; margin-top: 10px; margin-bottom: 10px; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="width: 600px; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden;">
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; background-color: #ffffff;">
               <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
               <h1 style="margin: 0; font-size: 24px; color: #111827; font-weight: 800; letter-spacing: -0.5px;">Digital India Innovation Challenge</h1>
            </td>
          </tr>
          <tr>
            <td align="left" style="padding: 0 40px 30px 40px;">
              <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Dear <strong>${escHtml(submission.name)}</strong>,
              </p>
              <p style="margin: 15px 0 0 0; font-size: 16px; color: #6b7280; line-height: 1.6;">
                Congratulations! We are thrilled to inform you that your idea pitch has been <strong>shortlisted</strong> for the next round of the Digital India Innovation Challenge.
              </p>
              <p style="margin: 15px 0 0 0; font-size: 16px; color: #6b7280; line-height: 1.6;">
                Please complete the following next steps immediately to lock in your participation:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px 40px; background-color: #ffffff;">
              <div style="border-top: 1px solid #e5e7eb; margin-bottom: 30px;"></div>
              
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="24" valign="top" style="padding-bottom: 25px;">
                    <span style="color: #3b82f6; font-weight: bold; font-size: 18px;">1.</span>
                  </td>
                  <td style="padding-bottom: 25px; color: #374151; font-size: 15px; line-height: 1.4;">
                    <strong>Join the Official WhatsApp Group</strong><br>
                    <span style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 8px;">For live updates, team forming, and event announcements.</span>
                    <a href="${whatsappLink}" class="btn" style="background-color: #10b981;">Join WhatsApp Group</a>
                  </td>
                </tr>
                <tr>
                  <td width="24" valign="top">
                    <span style="color: #3b82f6; font-weight: bold; font-size: 18px;">2.</span>
                  </td>
                  <td style="color: #374151; font-size: 15px; line-height: 1.4;">
                    <strong>Register for the Hackathon</strong><br>
                    <span style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 8px;">Submit your detailed project build plan and secure your seat.</span>
                    <a href="${hackathonLink}" class="btn">Register for Hackathon</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
               <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                 © 2026 Cloud Community Club (C³).<br>
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
                '🎉 Shortlisted Announcement: Digital India Innovation Challenge',
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
