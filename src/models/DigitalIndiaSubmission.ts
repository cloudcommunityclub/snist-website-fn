import mongoose, { Schema, Model } from 'mongoose'

export interface IDigitalIndiaSubmission {
    name: string
    college: string
    email: string
    phone: string
    idea: string
    utrId: string
    paymentScreenshotUrl: string
    paymentVerified: boolean
    verifiedAt?: Date
    verifiedBy?: string
    createdAt: Date
    updatedAt: Date
    // Referral & Team fields
    teamName: string
    domain: string
    teamSize: number
    teamMembers: Array<{ name: string; email: string }>
    referralCode: string
    referredByCode?: string
    referralPoints: number
    lastPointEarnedAt: Date
}

const DigitalIndiaSubmissionSchema = new Schema({
    name: { type: String, required: true },
    college: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    idea: { type: String, required: true },
    utrId: { type: String, required: true, unique: true, trim: true },
    paymentScreenshotUrl: { type: String, required: true },
    paymentVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    verifiedBy: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // Referral & Team fields
    teamName: { type: String, required: true, unique: true, trim: true },
    domain: { type: String, required: true },
    teamSize: { type: Number, required: true },
    teamMembers: [
        {
            name: { type: String, required: true },
            email: { type: String, required: true, lowercase: true, trim: true },
        }
    ],
    referralCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    referredByCode: { type: String, uppercase: true, trim: true, index: true },
    referralPoints: { type: Number, default: 0, index: true },
    lastPointEarnedAt: { type: Date, default: Date.now, index: true },
})

DigitalIndiaSubmissionSchema.pre('save', function () {
    this.updatedAt = new Date()
})

DigitalIndiaSubmissionSchema.index({ createdAt: -1 })
DigitalIndiaSubmissionSchema.index({ paymentVerified: 1 })

const DigitalIndiaSubmission: Model<IDigitalIndiaSubmission> =
    mongoose.models.DigitalIndiaSubmission ||
    mongoose.model<IDigitalIndiaSubmission>(
        'DigitalIndiaSubmission',
        DigitalIndiaSubmissionSchema,
        'digital_india_ideathon_submissions'
    )

export default DigitalIndiaSubmission

