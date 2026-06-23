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
