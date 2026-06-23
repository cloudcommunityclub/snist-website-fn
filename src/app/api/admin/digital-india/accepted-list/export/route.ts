import dbConnect from '@/lib/db'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'
import { escCsv } from '@/lib/csv'

export async function GET() {
    try {
        await dbConnect()

        const submissions = await DigitalIndiaAccepted.find()
            .sort({ acceptedAt: -1 })
            .select('-__v')
            .lean()

        const headers = [
            'Name', 'Email', 'Phone', 'College',
            'Idea Description', 'UTR ID', 'Payment Screenshot URL',
            'Accepted At', 'Accepted By', 'Registered At',
        ]

        const rows = submissions.map(s => [
            s.name, s.email, s.phone, s.college,
            s.idea, s.utrId, s.paymentScreenshotUrl,
            s.acceptedAt ? new Date(s.acceptedAt).toISOString() : '',
            s.acceptedBy ?? '',
            s.createdAt ? new Date(s.createdAt).toISOString() : '',
        ].map(escCsv).join(','))

        const csv = [headers.join(','), ...rows].join('\n')

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="c3-digital-india-accepted-${Date.now()}.csv"`,
            },
        })
    } catch (error) {
        console.error('Digital India accepted export error:', error)
        return new Response(JSON.stringify({ message: 'Failed to export accepted participants' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
