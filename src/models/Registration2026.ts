import mongoose, { Schema, Model } from 'mongoose'

export interface IRegistration2026 {
    name: string
    email: string
    mobile: string
    rollNumber: string
    department: string
    year: string
    interests: string[]
    experience?: string
    expectations?: string
    referral?: string
    emailSent: boolean
    emailSentAt?: Date
    createdAt: Date
    updatedAt: Date
}

const Registration2026Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true },
    rollNumber: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    interests: { type: [String], required: true },
    experience: { type: String },
    expectations: { type: String },
    referral: { type: String },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

Registration2026Schema.pre('save', function () {
    this.updatedAt = new Date()
})

Registration2026Schema.index({ createdAt: -1 })
Registration2026Schema.index({ department: 1, year: 1 })
Registration2026Schema.index({ emailSent: 1 })

// Prevent model recompilation in dev (HMR)
const Registration2026: Model<IRegistration2026> =
    mongoose.models.Registration2026 ||
    mongoose.model<IRegistration2026>('Registration2026', Registration2026Schema, 'registrations-2026')

export default Registration2026
