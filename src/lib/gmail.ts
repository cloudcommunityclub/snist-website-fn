import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

/**
 * Singleton Gmail OAuth2 client — initialized once per cold-start.
 */
let oauthClient: InstanceType<typeof OAuth2> | null = null

function getOAuthClient() {
    if (!oauthClient) {
        if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REFRESH_TOKEN) {
            throw new Error('OAuth credentials not properly configured')
        }
        oauthClient = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.OAUTH_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
        )
        oauthClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

        oauthClient.on('tokens', (tokens) => {
            if (tokens.refresh_token) {
                oauthClient!.setCredentials({ refresh_token: tokens.refresh_token })
            }
        })
    }
    return oauthClient
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
 * Build a base64url-encoded MIME message for the Gmail API.
 */
export function makeBody(to: string, from: string, subject: string, message: string): string {
    const encodedSubject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`

    const str = [
        'Content-Type: text/html; charset="UTF-8"\n',
        'MIME-Version: 1.0\n',
        'Content-Transfer-Encoding: 7bit\n',
        'to: ', to, '\n',
        'from: ', from, '\n',
        'subject: ', encodedSubject, '\n\n',
        message
    ].join('')

    return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
}

/**
 * Send an email via the Gmail API using OAuth2 credentials.
 */
export async function sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
    const oauth2Client = getOAuthClient()
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    const from = `Cloud Community Club (C³) <${process.env.EMAIL_USER}>`
    const rawMessage = makeBody(to, from, subject, htmlBody)

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: rawMessage },
    })
}
