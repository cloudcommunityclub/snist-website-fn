import { NextResponse } from 'next/server'
import { z } from 'zod'
import dbConnect from '@/lib/db'
import Recruitment from '@/models/Recruitment'

const submitSchema = z.object({
    email: z.string().email('Invalid email'),
    problemId: z.string().min(1).optional(),
    prUrl: z.string().url('Must be a valid URL').max(500),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedData = submitSchema.parse(body)

        await dbConnect()

        const email = validatedData.email.trim().toLowerCase()

        const updateData: Record<string, unknown> = {
            submittedSolution: true,
            updatedAt: new Date(),
        }
        if (validatedData.problemId) updateData.problemUnlocked = validatedData.problemId
        if (validatedData.prUrl) updateData.prUrl = validatedData.prUrl

        const candidate = await Recruitment.findOneAndUpdate(
            { email: { $eq: email } },
            { $set: updateData },
            { new: true }
        )

        if (!candidate) {
            return NextResponse.json(
                { success: false, message: 'Candidate not found. Please unlock a challenge first.' },
                { status: 404 }
            )
        }

        console.log(`✅ Submission recorded: ${email}`)
        return NextResponse.json({
            success: true,
            message: 'Submission recorded',
            data: { email, submittedSolution: true },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: error.issues.map(i => i.message).join('. ') },
                { status: 400 }
            )
        }
        console.error('Submit error:', error)
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
    }
}
