import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import DigitalIndiaReferral from '@/models/DigitalIndiaReferral'
import { escHtml, sendEmail } from '@/lib/mail'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { id, reason } = body

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Submission ID is required.' },
                { status: 400 }
            )
        }

        await dbConnect()

        // Find the submission
        const submission = await DigitalIndiaSubmission.findById(id)
        if (!submission) {
            return NextResponse.json(
                { success: false, message: 'Submission not found.' },
                { status: 404 }
            )
        }

        // Clean up referral records
        try {
            await DigitalIndiaReferral.deleteMany({
                $or: [
                    { referrerEmail: submission.email },
                    { referredEmail: submission.email },
                ],
            })
            console.log(`✅ Referral records cleaned for email=${submission.email} on rejection`)
        } catch (refErr) {
            console.error('❌ Failed to clean referral records on rejection:', refErr)
        }

        // Send rejection email to leader and all team members
        try {
            // 1. Send to Team Leader
            try {
                const leaderHtmlBody = getRejectionEmailHtml(
                    submission.name,
                    submission.teamName,
                    reason
                )
                await sendEmail(
                    submission.email,
                    'Submission Status Update: Digital India Hackathon',
                    leaderHtmlBody
                )
                console.log(
                    `✅ Rejection email sent successfully to Team Leader: ${submission.email}`
                )
            } catch (leaderEmailError) {
                console.error(
                    `❌ Rejection Email Failed for Team Leader (${submission.email}):`,
                    (leaderEmailError as Error).message
                )
            }

            // 2. Send to all other Team Members
            if (submission.teamMembers && submission.teamMembers.length > 0) {
                for (const member of submission.teamMembers) {
                    if (member.email && member.name) {
                        try {
                            const memberHtmlBody = getRejectionEmailHtml(
                                member.name,
                                submission.teamName,
                                reason
                            )
                            await sendEmail(
                                member.email,
                                'Submission Status Update: Digital India Hackathon',
                                memberHtmlBody
                            )
                            console.log(
                                `✅ Rejection email sent successfully to Team Member: ${member.email}`
                            )
                        } catch (memberEmailError) {
                            console.error(
                                `❌ Rejection Email Failed for Team Member (${member.email}):`,
                                (memberEmailError as Error).message
                            )
                        }
                    }
                }
            }
        } catch (emailError) {
            console.error(
                '❌ Rejection Email Process Failed:',
                (emailError as Error).message
            )
        }

        // Delete from submissions table
        await DigitalIndiaSubmission.findByIdAndDelete(id)

        return NextResponse.json({
            success: true,
            message: 'Candidate rejected and notification email sent.',
        })
    } catch (error) {
        console.error('Reject candidate error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

function getRejectionEmailHtml(
    recipientName: string,
    teamName: string,
    reason?: string
): string {
    const reasonText = reason || "We're sorry, your idea did not meet our submission criteria this time. Thank you for participating, and we encourage you to come back with an even stronger idea next time.";
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Digital India Hackathon Submission Update</title>
  <style type="text/css">
    body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; background-color: #09090b; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
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
                 <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ff5555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;">
                   <circle cx="12" cy="12" r="10" />
                   <line x1="15" y1="9" x2="9" y2="15" />
                   <line x1="9" y1="9" x2="15" y2="15" />
                 </svg>
               </div>
               <h1 style="margin: 0; font-size: 26px; color: #ffffff; font-weight: 800; letter-spacing: -0.5px;">Submission Update</h1>
               <p style="margin: 5px 0 0 0; font-size: 14px; color: #ff5555; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">Digital India Hackathon</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td align="left" style="padding: 40px 40px 30px 40px;">
              <p style="margin: 0; font-size: 16px; color: #ffffff; line-height: 1.6;">
                Dear <strong>${escHtml(recipientName)}</strong>,
              </p>
              <p style="margin: 15px 0 0 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                Thank you for your interest in the Digital India Hackathon and for submitting an innovation proposal for team <strong style="color: #ffffff;">${escHtml(teamName)}</strong>.
              </p>
              <p style="margin: 15px 0 0 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                We regret to inform you that your submission has been <strong>rejected</strong> and could not be approved.
              </p>
              <p style="margin: 15px 0 0 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                <strong>Reason for rejection:</strong><br />
                <span style="color: #ff5555;">${escHtml(reasonText)}</span>
              </p>
              <p style="margin: 15px 0 0 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                If you believe this was an error, or if you need to submit correct payment proof/details, you are welcome to register a new submission through our official portal.
              </p>
              <div style="border-top: 1px solid #27272a; margin-top: 30px; padding-top: 20px;">
                <p style="margin: 0; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                  For any support or questions, please contact:
                </p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #ffffff; line-height: 1.6; font-family: monospace;">
                  <strong>Amarnath:</strong> 6302180155<br>
                  <strong>Vaman Akhil:</strong> 8008151542<br>
                  <strong>Vinay:</strong> 8121007035
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #09090b; border-top: 1px solid #27272a;">
               <p style="margin: 0; color: #52525b; font-size: 12px; line-height: 1.5;">
                 This email was sent automatically regarding your registration status for <strong>Digital India Hackathon 2026</strong>.<br><br>
                 © 2026 <strong>Cloud Community Club (C³)</strong> & <strong>Student Developers Community (SDC) – SNIST</strong>.
               </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
}
