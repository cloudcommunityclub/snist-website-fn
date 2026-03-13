'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Terminal, AlertTriangle } from 'lucide-react'

function AdminLoginContent() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [attempts, setAttempts] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const from = searchParams.get('from') || '/admin/dashboard'

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (loading || !password) return

        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({ password }),
            })

            if (res.ok) {
                router.replace(from)
            } else {
                const data = await res.json()
                setAttempts(a => a + 1)
                setError(data.message || 'Invalid credentials')
                setPassword('')
                inputRef.current?.focus()
            }
        } catch {
            setError('Connection error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                {/* Terminal window */}
                <div className="border border-[#6272a4]/40 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                    {/* Title bar */}
                    <div className="bg-[#1e1f29] px-5 py-3 flex items-center gap-3 border-b border-[#6272a4]/30">
                        <span className="w-3 h-3 rounded-full bg-[#ff5555]" />
                        <span className="w-3 h-3 rounded-full bg-[#ffb86c]" />
                        <span className="w-3 h-3 rounded-full bg-[#50fa7b]" />
                        <div className="ml-2 flex items-center gap-2 text-[#6272a4] text-xs font-mono">
                            <Terminal size={12} />
                            <span>admin@c3-terminal:~$</span>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="bg-[#0d0e12] p-8">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#bd93f9]/10 border border-[#bd93f9]/30 mb-4">
                                <Lock size={28} className="text-[#bd93f9]" />
                            </div>
                            <h1 className="text-[#f8f8f2] text-xl font-bold font-mono tracking-wider">
                                C3 // ADMIN ACCESS
                            </h1>
                            <p className="text-[#6272a4] text-xs font-mono mt-1">
                                CLASSIFICATION: RESTRICTED
                            </p>
                        </div>

                        {/* Boot sequence lines */}
                        <div className="font-mono text-xs space-y-1 mb-6 text-[#6272a4]">
                            <div><span className="text-[#50fa7b]">✓</span> System initialized</div>
                            <div><span className="text-[#50fa7b]">✓</span> Database connection established</div>
                            <div><span className="text-[#ffb86c]">▶</span> Awaiting authentication...</div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 flex items-center gap-2 bg-[#ff5555]/10 border border-[#ff5555]/30 rounded-lg px-4 py-2"
                            >
                                <AlertTriangle size={14} className="text-[#ff5555] shrink-0" />
                                <span className="text-[#ff5555] text-xs font-mono">
                                    {error}
                                    {attempts > 2 && ` (${attempts} attempts)`}
                                </span>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[#6272a4] text-xs font-mono mb-2">
                                    {'>'} enter_password
                                </label>
                                <div className="flex items-center bg-[#1e1f29] border border-[#6272a4]/40 rounded-lg px-4 py-3 gap-2 focus-within:border-[#bd93f9]/60 transition-colors">
                                    <span className="text-[#6272a4] font-mono text-sm">$</span>
                                    <input
                                        ref={inputRef}
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="flex-1 bg-transparent outline-none text-[#f1fa8c] font-mono text-sm placeholder:text-[#44475a]"
                                        placeholder="••••••••••••"
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !password}
                                className={`w-full py-3 rounded-lg font-mono text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2
                                    ${loading || !password
                                        ? 'bg-[#44475a]/50 text-[#6272a4] cursor-not-allowed'
                                        : 'bg-[#bd93f9]/20 hover:bg-[#bd93f9]/30 text-[#bd93f9] border border-[#bd93f9]/40 hover:border-[#bd93f9]/70'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin inline-block">⟳</span>
                                        <span>AUTHENTICATING...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock size={14} />
                                        <span>ACCESS TERMINAL</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-[#44475a] text-xs font-mono mt-6">
                            Unauthorized access is monitored and logged.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default function AdminLoginPage() {
    return (
        <Suspense>
            <AdminLoginContent />
        </Suspense>
    )
}
