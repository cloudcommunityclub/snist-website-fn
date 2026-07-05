import dbConnect from '@/lib/db'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'
import { escCsv } from '@/lib/csv'

export async function GET(request: Request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const fromDate = searchParams.get('from')
        const toDate = searchParams.get('to')

        const filter: Record<string, unknown> = {}
        if (fromDate || toDate) {
            const acceptedAt: Record<string, Date> = {}
            if (fromDate) acceptedAt.$gte = new Date(fromDate)
            if (toDate) acceptedAt.$lte = new Date(toDate)
            filter.acceptedAt = acceptedAt
        }

        const submissions = await DigitalIndiaAccepted.find(filter)
            .sort({ acceptedAt: -1 })
            .select('-__v')
            .lean()

        const headers = [
            'Team Name', 'Leader Name', 'Leader Email', 'Leader Phone', 'College',
            'Domain Track', 'Team Size',
            'Member 2 Name', 'Member 2 Email',
            'Member 3 Name', 'Member 3 Email',
            'Member 4 Name', 'Member 4 Email',
            'Idea Description', 'UTR ID', 'Payment Screenshot URL',
            'Accepted At', 'Accepted By', 'Registered At',
            'Referral Code', 'Referred By Code', 'Referral Points',
            'Latitude', 'Longitude', 'Submitter IP', 'Country',
        ]

        const rows = submissions.map(s => [
            s.teamName ?? '', s.name, s.email, s.phone, s.college,
            s.domain ?? '', s.teamSize ?? 1,
            s.teamMembers && s.teamMembers[0] ? s.teamMembers[0].name : '',
            s.teamMembers && s.teamMembers[0] ? s.teamMembers[0].email : '',
            s.teamMembers && s.teamMembers[1] ? s.teamMembers[1].name : '',
            s.teamMembers && s.teamMembers[1] ? s.teamMembers[1].email : '',
            s.teamMembers && s.teamMembers[2] ? s.teamMembers[2].name : '',
            s.teamMembers && s.teamMembers[2] ? s.teamMembers[2].email : '',
            s.idea, s.utrId, s.paymentScreenshotUrl,
            s.acceptedAt ? new Date(s.acceptedAt).toISOString() : '',
            s.acceptedBy ?? '',
            s.createdAt ? new Date(s.createdAt).toISOString() : '',
            s.referralCode ?? '',
            s.referredByCode ?? '',
            s.referralPoints ?? 0,
            s.latitude ?? '', s.longitude ?? '',
            s.submitterIP ?? '', s.country ?? '',
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
