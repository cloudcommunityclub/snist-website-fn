import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'
import { checkRateLimit } from '@/lib/rate-limit'

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}


export async function POST(request: Request) {
  try {
    const rawForwarded = request.headers.get('x-forwarded-for')
    const ip = (rawForwarded ? rawForwarded.split(',')[0] : request.headers.get('x-real-ip'))?.trim() || 'anonymous'
    const rateLimit = checkRateLimit(`submit_${ip}`, 10, 60 * 1000)
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()

    const name = formData.get('name') as string
    const college = formData.get('college') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const idea = formData.get('idea') as string
    const utrId = formData.get('utrId') as string
    const screenshot = formData.get('screenshot') as File | null

    // New Team Details
    const teamName = formData.get('teamName') as string
    const domain = formData.get('domain') as string
    const teamSize = formData.get('teamSize') as string
    const teamMembersJson = formData.get('teamMembers') as string
    const referredByRaw = formData.get('referredBy') as string | null

    if (!name || !college || !email || !phone || !idea || !utrId || !screenshot || !teamName || !domain || !teamSize) {
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

    // Check duplicates (email and UTR) across both collections
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedUtr = utrId.trim()
    const normalizedTeamName = teamName.trim()

    const existingEmailSub = await DigitalIndiaSubmission.findOne({ email: normalizedEmail })
    const existingEmailAcc = await DigitalIndiaAccepted.findOne({ email: normalizedEmail })
    if (existingEmailSub || existingEmailAcc) {
      return NextResponse.json(
        { success: false, message: 'A submission with this email already exists.' },
        { status: 400 }
      )
    }

    const existingUtrSub = await DigitalIndiaSubmission.findOne({ utrId: normalizedUtr })
    const existingUtrAcc = await DigitalIndiaAccepted.findOne({ utrId: normalizedUtr })
    if (existingUtrSub || existingUtrAcc) {
      return NextResponse.json(
        { success: false, message: 'A submission with this UTR ID already exists.' },
        { status: 400 }
      )
    }

    // Check team name duplicate across both collections (case insensitive)
    const existingTeamNameSub = await DigitalIndiaSubmission.findOne({ teamName: new RegExp(`^${escapeRegex(normalizedTeamName)}$`, 'i') })
    const existingTeamNameAcc = await DigitalIndiaAccepted.findOne({ teamName: new RegExp(`^${escapeRegex(normalizedTeamName)}$`, 'i') })
    if (existingTeamNameSub || existingTeamNameAcc) {
      return NextResponse.json(
        { success: false, message: 'A team with this name already exists.' },
        { status: 400 }
      )
    }

    // Validate referral code if provided
    let referredByCode = referredByRaw ? referredByRaw.trim().toUpperCase() : null
    let referrerDoc: any = null

    if (referredByCode) {
      referrerDoc = await DigitalIndiaAccepted.findOne({ referralCode: referredByCode }) ||
                    await DigitalIndiaSubmission.findOne({ referralCode: referredByCode })

      if (!referrerDoc) {
        return NextResponse.json(
          { success: false, message: 'Invalid referral code.' },
          { status: 400 }
        )
      }

      // Check self referral
      if (referrerDoc.email === normalizedEmail || referrerDoc.phone === phone.trim()) {
        return NextResponse.json(
          { success: false, message: 'Self-referrals are not allowed.' },
          { status: 400 }
        )
      }
    }

    // Relay normalized submission directly to backend server storage
    formData.set('email', normalizedEmail)
    formData.set('utrId', normalizedUtr)
    formData.set('teamName', normalizedTeamName)

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const backendRes = await fetch(`${backendUrl}/api/digital-india/ideathon/submit`, {
      method: 'POST',
      body: formData,
    })

    const backendResult = await backendRes.json().catch(() => ({}))

    if (!backendRes.ok || backendResult.message === 'error') {
      return NextResponse.json(
        { success: false, message: backendResult.error || backendResult.message || 'Submission failed on server.' },
        { status: backendRes.status || 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully!',
      referralCode: backendResult?.data?.referralCode || backendResult?.referralCode || '',
    })
  } catch (error) {
    console.error('Digital India Submission Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
