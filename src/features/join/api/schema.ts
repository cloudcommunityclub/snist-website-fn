import { z } from 'zod'

// Department enum values
export const DEPARTMENTS = [
    'CSE',
    'CSE-AIML',
    'CSE-DS',
    'CSE-CS',
    'IT',
    'ECE',
    'EEE',
    'MECH',
    'CIVIL',
    'OTHER',
] as const

// Zod schema for the Join Club form - shared between frontend and API
export const joinClubSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    rollNumber: z
        .string()
        .min(10, 'Roll number must be at least 10 characters')
        .regex(/^[A-Z0-9]+$/i, 'Roll number must be alphanumeric'),
    email: z.string().email(),
    phone: z.string().regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    department: z.enum(DEPARTMENTS),
    year: z.enum(['1', '2', '3', '4']),
    motivation: z.string().min(20).max(500),
})

export type JoinClubFormData = z.infer<typeof joinClubSchema>
