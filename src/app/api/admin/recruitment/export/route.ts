import dbConnect from '@/lib/db'
import Recruitment from '@/models/Recruitment'
import { escCsv } from '@/lib/csv'

export async function GET() {
    try {
        await dbConnect()

        const candidates = await Recruitment.find()
            .sort({ createdAt: -1 })
            .select('-__v -_id')
            .lean()

        const headers = [
            'Name', 'Email', 'Mobile', 'Passing Year',
            'Problem Unlocked', 'Solution Submitted', 'Source', 'Registered At',
        ]

        const rows = candidates.map(c => [
            c.name, c.email, c.mobile, c.passingOutYear,
            c.problemUnlocked ?? '',
            c.submittedSolution ? 'Yes' : 'No',
            c.source ?? '',
            c.createdAt ? new Date(c.createdAt).toISOString() : '',
        ].map(escCsv).join(','))

        const csv = [headers.join(','), ...rows].join('\n')

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="c3-recruitment-${Date.now()}.csv"`,
            },
        })
    } catch (error) {
        console.error('Recruitment export error:', error)
        return new Response(JSON.stringify({ message: 'Failed to export recruitment data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
