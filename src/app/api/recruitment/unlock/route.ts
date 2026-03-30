import { NextResponse } from 'next/server'
import { z } from 'zod'
import dbConnect from '@/lib/db'
import Recruitment from '@/models/Recruitment'

const recruitmentUnlockSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string()
        .email('Invalid email address')
        .refine(
            (email) => {
                const domain = email.toLowerCase().split('@')[1]
                return domain && (domain.endsWith('sreenidhi.edu.in') || domain.endsWith('shu.edu.in'))
            },
            { message: 'Only emails from sreenidhi.edu.in or shu.edu.in domains are accepted (including department subdomains like @ece.sreenidhi.edu.in)' }
        ),
    mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
    passingOutYear: z.string().min(4, 'Please enter a valid year').max(4, 'Please enter a valid year'),
    problemId: z.string().optional(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedData = recruitmentUnlockSchema.parse(body)

        await dbConnect()

        const email = validatedData.email.trim()

        // Mobile number format validation (Indian 10-digit)
        const mobileRegex = /^[6-9]\d{9}$/
        if (!mobileRegex.test(validatedData.mobile.replace(/\s+/g, '').replace(/^\+91/, ''))) {
            return NextResponse.json(
                { success: false, message: 'Invalid mobile number format. Please provide a valid 10-digit Indian mobile number' },
                { status: 400 }
            )
        }

        const candidateData: Record<string, unknown> = {
            name: validatedData.name,
            email,
            mobile: validatedData.mobile,
            passingOutYear: validatedData.passingOutYear,
            source: 'Recruitment Page',
            updatedAt: new Date(),
        }

        if (validatedData.problemId && typeof validatedData.problemId === 'string') {
            candidateData.problemUnlocked = validatedData.problemId
        }

        await Recruitment.findOneAndUpdate(
            { email: { $eq: email } },
            { $set: candidateData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        console.log(`✅ Recruitment candidate saved: ${validatedData.name} (${email})`)

        return NextResponse.json({
            success: true,
            message: 'Successfully unlocked challenges',
            data: {
                name: validatedData.name,
                email,
                unlocked: true,
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.issues.map(issue => issue.message).join('. '),
                    errors: error.issues,
                },
                { status: 400 }
            )
        }

        console.error('Recruitment unlock error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
