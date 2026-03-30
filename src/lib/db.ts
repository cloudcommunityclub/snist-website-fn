import mongoose from 'mongoose'

/**
 * MongoDB connection singleton for Next.js serverless environment.
 * Caches the connection promise on the global object to avoid
 * reconnecting on every request during development (HMR).
 */

declare global {
    // eslint-disable-next-line no-var
    var _mongoosePromise: Promise<typeof mongoose> | undefined
}

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined')
}

export default function dbConnect(): Promise<typeof mongoose> {
    if (global._mongoosePromise) {
        return global._mongoosePromise
    }

    global._mongoosePromise = mongoose.connect(MONGO_URI!).then((m) => {
        console.log('✅ Connected to MongoDB')
        return m
    })

    return global._mongoosePromise
}
