import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Registration2026 from '@/models/Registration2026'
import Recruitment from '@/models/Recruitment'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'

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
            totalDigitalIndia,
            digitalIndia24h,
            digitalIndiaVerified,
            digitalIndiaAccepted,
        ] = await Promise.all([
            Registration2026.countDocuments(),
            Registration2026.countDocuments({ createdAt: { $gte: last24h } }),
            Registration2026.countDocuments({ emailSent: true }),
            Recruitment.countDocuments(),
            Recruitment.countDocuments({ createdAt: { $gte: last24h } }),
            Recruitment.countDocuments({ problemUnlocked: { $exists: true, $ne: null } }),
            Recruitment.countDocuments({ submittedSolution: true }),
            DigitalIndiaSubmission.countDocuments(),
            DigitalIndiaSubmission.countDocuments({ createdAt: { $gte: last24h } }),
            DigitalIndiaSubmission.countDocuments({ paymentVerified: true }),
            DigitalIndiaAccepted.countDocuments(),
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
            digitalIndia: {
                total: totalDigitalIndia,
                last24h: digitalIndia24h,
                verified: digitalIndiaVerified,
                pending: totalDigitalIndia - digitalIndiaVerified,
                accepted: digitalIndiaAccepted,
            },
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json({ message: 'Failed to fetch stats' }, { status: 500 })
    }
}

