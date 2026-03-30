import dbConnect from '@/lib/db'
import Registration2026 from '@/models/Registration2026'
import { escCsv } from '@/lib/csv'

export async function GET() {
    try {
        await dbConnect()

        const members = await Registration2026.find()
            .sort({ createdAt: -1 })
            .select('-__v -_id')
            .lean()

        const headers = [
            'Name', 'Email', 'Mobile', 'Roll Number', 'Department', 'Year',
            'Interests', 'Experience', 'Expectations', 'Referral',
            'Email Sent', 'Email Sent At', 'Registered At',
        ]

        const rows = members.map(m => [
            m.name, m.email, m.mobile, m.rollNumber, m.department, m.year,
            m.interests, m.experience ?? '', m.expectations ?? '', m.referral ?? '',
            m.emailSent ? 'Yes' : 'No',
            m.emailSentAt ? new Date(m.emailSentAt).toISOString() : '',
            m.createdAt ? new Date(m.createdAt).toISOString() : '',
        ].map(escCsv).join(','))

        const csv = [headers.join(','), ...rows].join('\n')

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="c3-members-${Date.now()}.csv"`,
            },
        })
    } catch (error) {
        console.error('Members export error:', error)
        return new Response(JSON.stringify({ message: 'Failed to export members' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
