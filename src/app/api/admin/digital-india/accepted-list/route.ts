import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'

const MAX_SEARCH_LENGTH = 100

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function GET(request: Request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const page = searchParams.get('page') || '1'
        const limit = searchParams.get('limit') || '20'
        const search = searchParams.get('search') || ''

        if (search.length > MAX_SEARCH_LENGTH) {
            return NextResponse.json({ message: 'Search query too long' }, { status: 400 })
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1)
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
        const skip = (pageNum - 1) * limitNum

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: Record<string, any> = {}
        if (search.trim()) {
            const searchRegex = new RegExp(escapeRegex(search.trim()), 'i')
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { utrId: searchRegex },
                { college: searchRegex },
                { teamName: searchRegex },
                { domain: searchRegex },
                { phone: searchRegex },
                { referralCode: searchRegex },
                { referredByCode: searchRegex },
                { 'teamMembers.name': searchRegex },
                { 'teamMembers.email': searchRegex },
            ]
        }

        const [data, total] = await Promise.all([
            DigitalIndiaAccepted.find(filter)
                .sort({ acceptedAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .select('-__v')
                .lean(),
            DigitalIndiaAccepted.countDocuments(filter),
        ])

        return NextResponse.json({
            data,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum) || 1,
            },
        })
    } catch (error) {
        console.error('Admin digital-india accepted list error:', error)
        return NextResponse.json({ message: 'Failed to fetch accepted participants' }, { status: 500 })
    }
}
