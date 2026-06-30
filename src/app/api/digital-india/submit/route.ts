import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const BACKEND_API_URL = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
).trim()

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request)
        const rateLimit = checkRateLimit(ip, { max: 20, windowMs: 60_000 })
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Too many requests. Please try again later.',
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(
                            Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
                        ),
                    },
                }
            )
        }

        const formData = await request.formData()

        const name = formData.get('name') as string | null
        const email = formData.get('email') as string | null
        const phone = formData.get('phone') as string | null
        const idea = formData.get('idea') as string | null
        const utrId = formData.get('utrId') as string | null
        const screenshot = formData.get('screenshot') as File | null

        if (!name || !email || !phone || !idea || !utrId || !screenshot) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'All required fields must be provided.',
                },
                { status: 400 }
            )
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address.' },
                { status: 400 }
            )
        }

        if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
            return NextResponse.json(
                { success: false, message: 'Invalid Indian phone number.' },
                { status: 400 }
            )
        }

        if (idea.trim().length < 50) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Idea description must be at least 50 characters.',
                },
                { status: 400 }
            )
        }

        if (!screenshot.type.startsWith('image/')) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Screenshot must be an image file.',
                },
                { status: 400 }
            )
        }

        if (screenshot.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Screenshot must be less than 5 MB.',
                },
                { status: 400 }
            )
        }

        const relayFormData = new FormData()
        const entries = Array.from(formData.entries())
        for (const [key, value] of entries) {
            if (key !== 'screenshot') {
                relayFormData.append(key, value as string)
            }
        }

        const buf = await screenshot.arrayBuffer()
        relayFormData.append(
            'screenshot',
            new File([buf], screenshot.name, { type: screenshot.type })
        )

        const response = await fetch(
            `${BACKEND_API_URL}/api/digital-india/ideathon/submit`,
            {
                method: 'POST',
                body: relayFormData,
            }
        )

        const text = await response.text()

        let result: Record<string, unknown>
        try {
            result = JSON.parse(text)
        } catch {
            result = { error: text }
        }

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: (result.error as string) || 'Submission failed',
                },
                { status: response.status }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Registration submitted successfully!',
            referralCode: (result.data as Record<string, unknown>)
                ?.referralCode as string,
            paymentScreenshotUrl: (result.data as Record<string, unknown>)
                ?.paymentScreenshotUrl as string,
        })
    } catch (error) {
        console.error('Digital India Submission relay error:', error)
        const message =
            error instanceof Error ? error.message : 'Internal Server Error'
        return NextResponse.json({ success: false, message }, { status: 500 })
    }
}
