import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Registration2026 from '@/models/Registration2026'


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
        const dept = searchParams.get('dept') || ''
        const year = searchParams.get('year') || ''
        const emailSent = searchParams.get('emailSent') || ''

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
                { rollNumber: searchRegex },
            ]
        }
        if (dept.trim()) filter.department = { $eq: dept.trim() }
        if (year.trim()) filter.year = { $eq: year.trim() }
        if (emailSent === 'true') filter.emailSent = true
        if (emailSent === 'false') filter.emailSent = false

        const [data, total] = await Promise.all([
            Registration2026.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .select('-__v')
                .lean(),
            Registration2026.countDocuments(filter),
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
        console.error('Admin members list error:', error)
        return NextResponse.json({ message: 'Failed to fetch members' }, { status: 500 })
    }
}
