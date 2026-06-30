import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'

export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { id, verified } = body

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Submission ID is required.' },
                { status: 400 }
            )
        }

        await dbConnect()

        const updatedSubmission =
            await DigitalIndiaSubmission.findByIdAndUpdate(
                id,
                {
                    $set: {
                        paymentVerified: !!verified,
                        verifiedAt: verified ? new Date() : undefined,
                        verifiedBy: verified ? 'Admin' : undefined,
                        updatedAt: new Date(),
                    },
                },
                { new: true }
            )

        if (!updatedSubmission) {
            return NextResponse.json(
                { success: false, message: 'Submission not found.' },
                { status: 404 }
            )
        }

        console.log(
            `✅ Digital India submission ${id} verification updated to ${verified}`
        )

        return NextResponse.json({
            success: true,
            message: `Submission successfully ${verified ? 'verified' : 'unverified'}.`,
            data: updatedSubmission,
        })
    } catch (error) {
        console.error('Verify error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
