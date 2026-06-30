import mongoose, { Schema, Model } from 'mongoose'

export interface IDigitalIndiaReferral {
    referrerTeamId: mongoose.Types.ObjectId | string
    referredTeamId: mongoose.Types.ObjectId | string
    referrerEmail: string
    referredEmail: string
    createdAt: Date
}

const DigitalIndiaReferralSchema = new Schema({
    referrerTeamId: { type: Schema.Types.ObjectId, required: true },
    referredTeamId: { type: Schema.Types.ObjectId, required: true },
    referrerEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    referredEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    createdAt: { type: Date, default: Date.now },
})

// Indexes for fast lookup
DigitalIndiaReferralSchema.index({ referrerTeamId: 1 })
DigitalIndiaReferralSchema.index({ referrerEmail: 1 })
DigitalIndiaReferralSchema.index({ referredEmail: 1 }, { unique: true })

const DigitalIndiaReferral: Model<IDigitalIndiaReferral> =
    mongoose.models.DigitalIndiaReferral ||
    mongoose.model<IDigitalIndiaReferral>(
        'DigitalIndiaReferral',
        DigitalIndiaReferralSchema,
        'digital_india_referrals'
    )

export default DigitalIndiaReferral
