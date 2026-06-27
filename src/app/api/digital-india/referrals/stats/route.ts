import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'
import DigitalIndiaReferral from '@/models/DigitalIndiaReferral'

export async function GET(request: Request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email address is required.' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.trim().toLowerCase()

        // 1. Find the team (either in submissions or accepted)
        const team = await DigitalIndiaAccepted.findOne({ email: normalizedEmail }).lean() ||
                     await DigitalIndiaSubmission.findOne({ email: normalizedEmail }).lean()

        if (!team) {
            return NextResponse.json(
                { success: false, message: 'No registered team found with this email.' },
                { status: 404 }
            )
        }

        // 2. Fetch successful referrals (where this team was the referrer)
        const referrals = await DigitalIndiaReferral.find({ referrerEmail: team.email }).lean()
        const referredEmails = referrals.map(r => r.referredEmail)

        // Find names of referred teams from both collections
        const [referredSubs, referredAccs] = await Promise.all([
            DigitalIndiaSubmission.find({ email: { $in: referredEmails } }).select('teamName createdAt').lean(),
            DigitalIndiaAccepted.find({ email: { $in: referredEmails } }).select('teamName createdAt').lean(),
        ])

        const referredTeams = [...referredSubs, ...referredAccs].map(t => ({
            teamName: t.teamName,
            registeredAt: t.createdAt
        }))

        // 3. Calculate rank dynamically from all teams in database
        const [submissions, accepted] = await Promise.all([
            DigitalIndiaSubmission.find().select('email referralPoints lastPointEarnedAt createdAt').lean(),
            DigitalIndiaAccepted.find().select('email referralPoints lastPointEarnedAt createdAt').lean(),
        ])

        const allTeams = [...submissions, ...accepted]

        // Sort: points DESC, then lastPointEarnedAt ASC
        allTeams.sort((a, b) => {
            const pointsA = a.referralPoints ?? 0
            const pointsB = b.referralPoints ?? 0
            if (pointsB !== pointsA) {
                return pointsB - pointsA
            }

            const timeA = new Date(a.lastPointEarnedAt || a.createdAt).getTime()
            const timeB = new Date(b.lastPointEarnedAt || b.createdAt).getTime()
            return timeA - timeB
        })

        const rankIndex = allTeams.findIndex(t => t.email === team.email)
        const currentRank = rankIndex !== -1 ? rankIndex + 1 : 1

        return NextResponse.json({
            success: true,
            data: {
                teamName: team.teamName,
                leaderName: team.name,
                email: team.email,
                referralCode: team.referralCode,
                referralPoints: team.referralPoints ?? 0,
                currentRank,
                successfulReferrals: referredTeams,
            }
        })
    } catch (error) {
        console.error('Referral stats fetch error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch referral stats.' },
            { status: 500 }
        )
    }
}
