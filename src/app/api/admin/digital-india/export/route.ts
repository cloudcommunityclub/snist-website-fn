import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import { escCsv } from '@/lib/csv'

export async function GET(request: Request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const verified = searchParams.get('verified')
        const fromDate = searchParams.get('from')
        const toDate = searchParams.get('to')

        const filter: Record<string, unknown> = {}
        if (verified === 'true') filter.paymentVerified = true
        if (verified === 'false') filter.paymentVerified = false
        if (fromDate || toDate) {
            const createdAt: Record<string, Date> = {}
            if (fromDate) createdAt.$gte = new Date(fromDate)
            if (toDate) createdAt.$lte = new Date(toDate)
            filter.createdAt = createdAt
        }

        const submissions = await DigitalIndiaSubmission.find(filter)
            .sort({ createdAt: -1 })
            .select('-__v')
            .lean()

        const headers = [
            'Team Name', 'Leader Name', 'Email', 'Phone', 'College',
            'Domain Track', 'Team Size', 'Team Members',
            'Idea Description', 'UTR ID', 'Payment Screenshot URL',
            'Payment Verified', 'Verified At', 'Verified By',
            'Registered At',
            'Referral Code', 'Referred By', 'Referral Points',
            'Latitude', 'Longitude', 'Submitter IP', 'Country',
        ]

        const rows = submissions.map(s => [
            s.teamName ?? '', s.name, s.email, s.phone, s.college,
            s.domain ?? '', s.teamSize ?? 1,
            s.teamMembers ? s.teamMembers.map((m: any) => `${m.name} (${m.email})`).join('; ') : '',
            s.idea, s.utrId, s.paymentScreenshotUrl,
            s.paymentVerified ? 'Yes' : 'No',
            s.verifiedAt ? new Date(s.verifiedAt).toISOString() : '',
            s.verifiedBy ?? '',
            s.createdAt ? new Date(s.createdAt).toISOString() : '',
            s.referralCode ?? '',
            s.referredByCode ?? '',
            s.referralPoints ?? 0,
            s.latitude ?? '', s.longitude ?? '',
            s.submitterIP ?? '', s.country ?? '',
        ].map(escCsv).join(','))

        const csv = [headers.join(','), ...rows].join('\n')

        const label = verified === 'true' ? 'verified' : verified === 'false' ? 'pending' : 'all'
        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="c3-digital-india-submissions-${label}-${Date.now()}.csv"`,
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
