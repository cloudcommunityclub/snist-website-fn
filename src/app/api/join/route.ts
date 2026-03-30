import { NextResponse } from 'next/server'
import { z } from 'zod'
import dbConnect from '@/lib/db'
import Registration2026 from '@/models/Registration2026'
import { escHtml, sendEmail } from '@/lib/gmail'

const joinClubSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    rollNumber: z
        .string()
        .min(10, 'Roll number must be at least 10 characters')
        .regex(/^[A-Z0-9]+$/i, 'Roll number must be alphanumeric'),
    email: z.string().email(),
    phone: z.string().regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    department: z.string(),
    year: z.string(),
    motivation: z.string().min(20).max(500),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedData = joinClubSchema.parse(body)

        await dbConnect()

        const memberData = {
            name: validatedData.fullName,
            email: validatedData.email,
            mobile: validatedData.phone,
            rollNumber: validatedData.rollNumber,
            department: validatedData.department,
            year: validatedData.year,
            interests: ['Cloud Computing'],
            experience: validatedData.motivation,
            expectations: 'Join C3',
            referral: 'Website',
        }

        // Upsert: Update existing or create new (allows retries)
        await Registration2026.findOneAndUpdate(
            { email: { $eq: memberData.email } },
            { $set: memberData, $setOnInsert: { emailSent: false, createdAt: new Date() } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        // Send welcome email
        try {
            const name = memberData.name
            const rollNumber = memberData.rollNumber
            const department = memberData.department

            const htmlBody = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to C3</title>
  <style type="text/css">
    body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; background-color: #f4f4f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .capitalize { text-transform: capitalize; }
    .uppercase { text-transform: uppercase; }
    @media only screen and (max-width: 600px) {
      .width-full { width: 100% !important; max-width: 100% !important; }
      .mobile-pad { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" class="width-full" style="width: 600px; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden;">
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; background-color: #ffffff;">
               <div style="font-size: 48px; margin-bottom: 10px;">☁️</div>
               <h1 style="margin: 0; font-size: 24px; color: #111827; font-weight: 800; letter-spacing: -0.5px;">Cloud Community Club</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 40px 30px 40px;">
              <p style="margin: 0; font-size: 16px; color: #6b7280; line-height: 1.6;">
                Welcome aboard, <strong style="color: #111827; text-transform: capitalize;">${escHtml(name)}</strong>!
              </p>
              <p style="margin: 10px 0 0 0; font-size: 16px; color: #6b7280; line-height: 1.6;">
                Your application has been accepted. You are now an official member of C³.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 40px 40px 40px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: #4F46E5; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);">
                <tr>
                  <td style="padding: 30px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="left" style="color: rgba(255,255,255,0.7); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                          Membership Pass
                        </td>
                        <td align="right" style="color: #ffffff; font-size: 14px; font-weight: bold;">
                          2026
                        </td>
                      </tr>
                    </table>
                    <div style="margin-top: 20px; margin-bottom: 5px; font-size: 22px; color: #ffffff; font-weight: bold; text-transform: capitalize;">
                      ${escHtml(name)}
                    </div>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 15px;">
                      <tr>
                        <td width="50%" valign="top">
                          <div style="color: rgba(255,255,255,0.7); font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                            Student ID
                          </div>
                          <div style="color: #ffffff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                            ${escHtml(rollNumber)}
                          </div>
                        </td>
                        <td width="1" style="background-color: rgba(255,255,255,0.2);"></td>
                        <td width="20"></td>
                        <td valign="top">
                          <div style="color: rgba(255,255,255,0.7); font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                            Department
                          </div>
                          <div style="color: #ffffff; font-size: 14px; font-weight: 600;">
                            ${escHtml(department)}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px 40px; background-color: #ffffff;">
              <div style="border-top: 1px solid #e5e7eb; margin-bottom: 30px;"></div>
              <h3 style="margin: 0 0 20px 0; font-size: 14px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 1px;">
                Your Next Steps
              </h3>
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="24" valign="top" style="padding-bottom: 15px;">
                    <span style="color: #10B981; font-weight: bold; font-size: 18px;">✓</span>
                  </td>
                  <td style="padding-bottom: 15px; color: #374151; font-size: 15px; line-height: 1.4;">
                    <strong>Subscribed to Newsletter</strong><br>
                    <span style="color: #6b7280; font-size: 13px;">You'll get updates on workshops & tech talks.</span>
                  </td>
                </tr>
                <tr>
                  <td width="24" valign="top">
                    <span style="color: #4F46E5; font-weight: bold; font-size: 18px;">➜</span>
                  </td>
                  <td style="color: #374151; font-size: 15px; line-height: 1.4;">
                    <strong>Wait for Hackathons</strong><br>
                    <span style="color: #6b7280; font-size: 13px;">We will notify you when registration opens.</span>
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
</html>`

            await sendEmail(
                memberData.email,
                '🎉 Welcome to Cloud Community Club (C³) Membership!',
                htmlBody
            )

            console.log('✅ Email sent successfully via Gmail API')

            await Registration2026.updateOne(
                { email: { $eq: memberData.email } },
                { $set: { emailSent: true, emailSentAt: new Date() } }
            )
        } catch (emailError) {
            console.error('❌ Email Failed:', (emailError as Error).message)
            // Don't fail the registration if email fails
        }

        return NextResponse.json({
            success: true,
            message: 'Registration successful',
            data: {
                name: memberData.name,
                email: memberData.email,
                department: memberData.department,
                year: memberData.year,
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, errors: (error as any).errors },
                { status: 400 }
            )
        }

        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
