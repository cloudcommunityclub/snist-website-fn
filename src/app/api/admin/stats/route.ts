import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Registration2026 from '@/models/Registration2026'
import Recruitment from '@/models/Recruitment'

export async function GET() {
    try {
        await dbConnect()

        const now = new Date()
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

        const [
            totalMembers,
            members24h,
            emailSent,
            totalRecruitment,
            recruitment24h,
            unlocked,
            submitted,
        ] = await Promise.all([
            Registration2026.countDocuments(),
            Registration2026.countDocuments({ createdAt: { $gte: last24h } }),
            Registration2026.countDocuments({ emailSent: true }),
            Recruitment.countDocuments(),
            Recruitment.countDocuments({ createdAt: { $gte: last24h } }),
            Recruitment.countDocuments({ problemUnlocked: { $exists: true, $ne: null } }),
            Recruitment.countDocuments({ submittedSolution: true }),
        ])

        return NextResponse.json({
            members: {
                total: totalMembers,
                last24h: members24h,
                emailSent,
                emailPending: totalMembers - emailSent,
            },
            recruitment: {
                total: totalRecruitment,
                last24h: recruitment24h,
                unlocked,
                submitted,
            },
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json({ message: 'Failed to fetch stats' }, { status: 500 })
    }
}
