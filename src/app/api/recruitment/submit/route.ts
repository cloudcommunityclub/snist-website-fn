import { NextResponse } from 'next/server';
import { z } from 'zod';

const submitSchema = z.object({
    email: z.string().email('Invalid email'),
    problemId: z.string().min(1).optional(),
    prUrl: z.string().url('Must be a valid URL').max(500),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = submitSchema.parse(body);

        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
        }

        try {
            const backendResponse = await fetch(`${backendUrl}/api/recruitment/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
                body: JSON.stringify(validatedData),
            });

            const backendData = await backendResponse.json();

            if (!backendResponse.ok) {
                return NextResponse.json(
                    { success: false, message: backendData.error || 'Submission failed' },
                    { status: backendResponse.status }
                );
            }

            return NextResponse.json({ success: true, message: 'Submission recorded', data: backendData.data });
        } catch (fetchError) {
            console.error('Backend connection error:', fetchError);
            return NextResponse.json(
                { success: false, message: 'Could not connect to backend server. Please try again later.' },
                { status: 503 }
            );
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: error.issues.map(i => i.message).join('. ') },
                { status: 400 }
            );
        }
        console.error('Submit error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
