import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
    if (!transporter) {
        const host = process.env.SMTP_HOST
        const port = parseInt(process.env.SMTP_PORT || '587', 10)
        const user = process.env.SMTP_USER
        const pass = process.env.SMTP_PASS

        if (!host || !user || !pass) {
            throw new Error('SMTP mail credentials are not configured in environment variables.')
        }

        // Use secure: true for port 465, secure: false for 587 (TLS/STARTTLS)
        const secure = port === 465

        transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
            // Set tls config to allow unauthorized certs if needed, or default
            tls: {
                rejectUnauthorized: false
            }
        })
    }
    return transporter
}

/**
 * HTML-escape user-supplied values for email templates.
 */
export function escHtml(s: string): string {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

/**
 * Send an email via the traditional SMTP transporter.
 */
export async function sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
    const client = getTransporter()
    const from = process.env.EMAIL_FROM || `Cloud Community Club (C³) <${process.env.SMTP_USER}>`

    await client.sendMail({
        from,
        to,
        subject,
        html: htmlBody,
    })
}
