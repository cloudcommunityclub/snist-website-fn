import mongoose, { Schema, Model } from 'mongoose'

export interface IDigitalIndiaAccepted {
    name: string
    college: string
    email: string
    phone: string
    idea: string
    utrId: string
    paymentScreenshotUrl: string
    acceptedAt: Date
    acceptedBy: string
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
    // Geo fields
    latitude?: number
    longitude?: number
    submitterIP?: string
    country?: string
}

const DigitalIndiaAcceptedSchema = new Schema({
    name: { type: String, required: true },
    college: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    idea: { type: String, required: true },
    utrId: { type: String, required: true, unique: true, trim: true },
    paymentScreenshotUrl: { type: String, required: true },
    acceptedAt: { type: Date, default: Date.now },
    acceptedBy: { type: String, default: 'Admin' },
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
    // Geo fields
    latitude: { type: Number },
    longitude: { type: Number },
    submitterIP: { type: String },
    country: { type: String },
})

DigitalIndiaAcceptedSchema.pre('save', function () {
    this.updatedAt = new Date()
})

DigitalIndiaAcceptedSchema.index({ acceptedAt: -1 })

const DigitalIndiaAccepted: Model<IDigitalIndiaAccepted> =
    mongoose.models.DigitalIndiaAccepted ||
    mongoose.model<IDigitalIndiaAccepted>(
        'DigitalIndiaAccepted',
        DigitalIndiaAcceptedSchema,
        'digital_india_ideathon_accepted'
    )

export default DigitalIndiaAccepted

