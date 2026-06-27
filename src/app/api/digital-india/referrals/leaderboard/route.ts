import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function GET(request: Request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''

        // Prepare query filter
        const filter: Record<string, any> = {}
        if (search.trim()) {
            const searchRegex = new RegExp(escapeRegex(search.trim()), 'i')
            filter.teamName = searchRegex
        }

        // Fetch teams from both collections.
        // Selecting only required fields makes the query fast and memory efficient.
        const [submissions, accepted] = await Promise.all([
            DigitalIndiaSubmission.find(filter)
                .select('teamName referralPoints lastPointEarnedAt createdAt')
                .lean(),
            DigitalIndiaAccepted.find(filter)
                .select('teamName referralPoints lastPointEarnedAt createdAt')
                .lean(),
        ])

        // Merge teams
        const allTeams = [...submissions, ...accepted]

        // Sort: referralPoints DESC, then lastPointEarnedAt ASC
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

        // Format leaderboard with rank
        const leaderboard = allTeams.map((team, index) => ({
            rank: index + 1,
            teamName: team.teamName,
            referralPoints: team.referralPoints ?? 0,
        }))

        return NextResponse.json({
            success: true,
            data: leaderboard,
        })
    } catch (error) {
        console.error('Referral leaderboard fetch error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch leaderboard data.' },
            { status: 500 }
        )
    }
}
