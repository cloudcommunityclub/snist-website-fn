import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import { escCsv } from '@/lib/csv'

export async function GET() {
    try {
        await dbConnect()

        const submissions = await DigitalIndiaSubmission.find()
            .sort({ createdAt: -1 })
            .select('-__v')
            .lean()

        const headers = [
            'Name', 'Email', 'Phone', 'College',
            'Idea Description', 'UTR ID', 'Payment Screenshot URL', 'Verified',
            'Verified At', 'Verified By', 'Registered At',
        ]

        const rows = submissions.map(s => [
            s.name, s.email, s.phone, s.college,
            s.idea, s.utrId, s.paymentScreenshotUrl,
            s.paymentVerified ? 'Yes' : 'No',
            s.verifiedAt ? new Date(s.verifiedAt).toISOString() : '',
            s.verifiedBy ?? '',
            s.createdAt ? new Date(s.createdAt).toISOString() : '',
        ].map(escCsv).join(','))

        const csv = [headers.join(','), ...rows].join('\n')

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="c3-digital-india-${Date.now()}.csv"`,
            },
        })
    } catch (error) {
        console.error('Digital India export error:', error)
        return new Response(JSON.stringify({ message: 'Failed to export Digital India data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
