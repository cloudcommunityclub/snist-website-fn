import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'
import DigitalIndiaReferral from '@/models/DigitalIndiaReferral'
import mongoose from 'mongoose'

interface DocWithEmail {
  email: string
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const collection = searchParams.get('collection') || 'submissions'

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Submission ID is required.' },
        { status: 400 }
      )
    }

    await dbConnect()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format.' },
        { status: 400 }
      )
    }

    const objectId = new mongoose.Types.ObjectId(id)
    let doc: DocWithEmail | null = null

    if (collection === 'accepted') {
      doc = await DigitalIndiaAccepted.findById(objectId).lean()
    } else {
      doc = await DigitalIndiaSubmission.findById(objectId).lean()
    }

    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Submission not found.' },
        { status: 404 }
      )
    }

    // Clean up referral records
    try {
      await DigitalIndiaReferral.deleteMany({
        $or: [
          { referrerEmail: doc.email },
          { referredEmail: doc.email },
        ],
      })
      console.log(`✅ Referral records cleaned for email=${doc.email}`)
    } catch (refErr) {
      console.error('❌ Failed to clean referral records:', refErr)
    }

    if (collection === 'accepted') {
      await DigitalIndiaAccepted.findByIdAndDelete(objectId)
    } else {
      await DigitalIndiaSubmission.findByIdAndDelete(objectId)
    }
    console.log(`✅ Deleted ${collection} entry id=${id} email=${doc.email}`)

    return NextResponse.json({
      success: true,
      message: 'Entry deleted successfully. Referral data cleaned up.',
    })
  } catch (error) {
    console.error('Admin digital-india delete error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
