import mongoose, { Schema, Model } from 'mongoose'

export interface IRecruitment {
    name: string
    email: string
    mobile: string
    passingOutYear: string
    problemUnlocked?: string
    submittedSolution: boolean
    prUrl?: string
    source: string
    createdAt: Date
    updatedAt: Date
}

const RecruitmentSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (email: string): boolean {
                const domain = email.split('@')[1]
                return !!(domain && (domain.endsWith('sreenidhi.edu.in') || domain.endsWith('shu.edu.in')))
            },
            message: 'Email must be from sreenidhi.edu.in or shu.edu.in domain',
        },
    },
    mobile: { type: String, required: true },
    passingOutYear: { type: String, required: true },
    problemUnlocked: { type: String },
    submittedSolution: { type: Boolean, default: false },
    prUrl: { type: String },
    source: { type: String, default: 'Recruitment Page' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

RecruitmentSchema.pre('save', function () {
    this.updatedAt = new Date()
})

RecruitmentSchema.index({ createdAt: -1 })
RecruitmentSchema.index({ passingOutYear: 1 })
RecruitmentSchema.index({ submittedSolution: 1 })

// Prevent model recompilation in dev (HMR)
const Recruitment: Model<IRecruitment> =
    mongoose.models.Recruitment ||
    mongoose.model<IRecruitment>('Recruitment', RecruitmentSchema, 'recruitment')

export default Recruitment
