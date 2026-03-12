import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { joinClubSchema } from '@/features/join/api/schema'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate the data
        const validatedData = joinClubSchema.parse(body)

        // Map to Backend Payload
        const backendPayload = {
            name: validatedData.fullName,
            email: validatedData.email,
            mobile: validatedData.phone,
            rollNumber: validatedData.rollNumber,
            department: validatedData.department,
            year: validatedData.year,
            interests: ['Cloud Computing'], // Default interest
            experience: validatedData.motivation, // Mapping motivation to experience
            expectations: 'Join C3',
            referral: 'Website',
        }

        try {
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
            const apiKey = process.env.API_KEY;

            if (!apiKey) {
                console.error('API_KEY not configured');
                throw new Error('API configuration error');
            }

            const backendResponse = await fetch(
                `${backendUrl}/api/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey
                    },
                    body: JSON.stringify(backendPayload),
                }
            )

            const backendData = await backendResponse.json()

            if (!backendResponse.ok) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Registration failed. Please try again later.',
                    },
                    { status: backendResponse.status }
                )
            }

            return NextResponse.json({
                success: true,
                message: 'Registration successful',
                data: backendData,
            })
        } catch (fetchError) {
            console.error('Backend connection error:', fetchError)
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Could not connect to registration server. Please try again later.',
                },
                { status: 503 }
            )
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, errors: error.issues },
                { status: 400 }
            )
        }

        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
