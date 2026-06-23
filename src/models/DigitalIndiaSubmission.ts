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
