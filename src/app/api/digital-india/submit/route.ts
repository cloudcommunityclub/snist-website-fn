import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        
        const name = formData.get('name') as string
        const college = formData.get('college') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string
        const idea = formData.get('idea') as string
        const utrId = formData.get('utrId') as string
        const screenshot = formData.get('screenshot') as File | null

        if (!name || !college || !email || !phone || !idea || !utrId || !screenshot) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            )
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address.' },
                { status: 400 }
            )
        }

        // Validate phone format
        if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
            return NextResponse.json(
                { success: false, message: 'Invalid Indian phone number.' },
                { status: 400 }
            )
        }

        // Validate idea length
        if (idea.trim().length < 50) {
            return NextResponse.json(
                { success: false, message: 'Idea description must be at least 50 characters.' },
                { status: 400 }
            )
        }

        await dbConnect()

        // Check duplicates
        const normalizedEmail = email.trim().toLowerCase()
        const normalizedUtr = utrId.trim()

        const existingEmail = await DigitalIndiaSubmission.findOne({ email: normalizedEmail })
        if (existingEmail) {
            return NextResponse.json(
                { success: false, message: 'A submission with this email already exists.' },
                { status: 400 }
            )
        }

        const existingUtr = await DigitalIndiaSubmission.findOne({ utrId: normalizedUtr })
        if (existingUtr) {
            return NextResponse.json(
                { success: false, message: 'A submission with this UTR ID already exists.' },
                { status: 400 }
            )
        }

        // Upload screenshot to Cloudflare R2
        const bytes = await screenshot.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const fileExtension = screenshot.name.split('.').pop() || 'png'
        const randomString = Math.random().toString(36).substring(2, 8)
        const key = `digital-india/screenshot-${Date.now()}-${randomString}.${fileExtension}`

        await r2Client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: screenshot.type || 'image/png',
            })
        )

        const publicUrlBase = R2_PUBLIC_URL?.endsWith('/')
            ? R2_PUBLIC_URL.slice(0, -1)
            : R2_PUBLIC_URL
        const paymentScreenshotUrl = `${publicUrlBase}/${key}`

        // Create database record
        const newSubmission = new DigitalIndiaSubmission({
            name: name.trim(),
            college: college.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            idea: idea.trim(),
            utrId: normalizedUtr,
            paymentScreenshotUrl,
            paymentVerified: false,
        })

        await newSubmission.save()

        console.log(`✅ Digital India Submission recorded for ${normalizedEmail}`)

        return NextResponse.json({
            success: true,
            message: 'Registration submitted successfully!',
        })
    } catch (error) {
        console.error('Digital India Submission Error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
