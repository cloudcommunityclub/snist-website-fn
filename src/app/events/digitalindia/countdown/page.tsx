'use client'

import React, { useState, useEffect } from 'react'
import { Timer, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'

// ==========================================
// TARGET CONFIGURATION (IST Timezone)
// Change this string to update the countdown
// ==========================================
const TARGET_DATE = "2026-07-09T09:00:00+05:30" 
const EVENT_TITLE = "Digital India Hackathon"
const EVENT_LOCATION = "SNIST Campus, Hyderabad"

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
    isOver: boolean
}

export default function DigitalIndiaCountdownPage() {
    const [isMounted, setIsMounted] = useState(false)
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isOver: false
    })

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true)

        const calculateTimeLeft = () => {
            const difference = +new Date(TARGET_DATE) - +new Date()
            
            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true }
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                isOver: false
            }
        }

        // Set initial
        setTimeLeft(calculateTimeLeft())

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center font-mono text-zinc-500 text-xs">
                LOADING EXPERIENCE...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-[#f8f8f2] flex flex-col items-center justify-between relative overflow-hidden font-sans selection:bg-[#9dff00]/30 selection:text-[#9dff00]">
            {/* Background decorative patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(157,255,0,0.07),rgba(255,255,255,0))]" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#9dff00]/20 to-transparent" />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 py-12 z-10 text-center">
                {/* Event Heading */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-16 max-w-3xl leading-none bg-gradient-to-r from-white via-zinc-200 to-[#9dff00] bg-clip-text text-transparent">
                    {EVENT_TITLE}
                </h1>

                {timeLeft.isOver ? (
                    /* Event Live / Timer Over State */
                    <div className="bg-zinc-900/40 border border-[#9dff00]/35 rounded-3xl p-8 sm:p-12 max-w-xl w-full backdrop-blur-md shadow-[0_0_50px_-12px_rgba(157,255,0,0.2)]">
                        <div className="w-16 h-16 rounded-2xl bg-[#9dff00]/10 border border-[#9dff00]/30 flex items-center justify-center mx-auto mb-6">
                            <Timer size={32} className="text-[#9dff00] animate-bounce" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Hackathon is Live!</h2>
                        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
                            The countdown has concluded. Innovation lab doors are open, and the Stage 2 build phase is officially underway. Good luck!
                        </p>
                        <Link
                            href="/events/digitalindia"
                            className="bg-[#9dff00] text-black font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#8ade00] transition-colors shadow-lg shadow-[#9dff00]/25 inline-block"
                        >
                            View Live Details
                        </Link>
                    </div>
                ) : (
                    /* Countdown Grid */
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl mb-16">
                        {/* Days */}
                        <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative group hover:border-[#9dff00]/30 hover:shadow-[0_0_30px_-5px_rgba(157,255,0,0.12)] transition-all duration-300 flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] shadow-2xl">
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#9dff00]/40 to-transparent rounded-t-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight leading-none mb-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.05)] bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                                {String(timeLeft.days).padStart(2, '0')}
                            </div>
                            <div className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest font-semibold">Days</div>
                        </div>

                        {/* Hours */}
                        <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative group hover:border-[#9dff00]/30 hover:shadow-[0_0_30px_-5px_rgba(157,255,0,0.12)] transition-all duration-300 flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] shadow-2xl">
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#9dff00]/40 to-transparent rounded-t-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight leading-none mb-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.05)] bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                                {String(timeLeft.hours).padStart(2, '0')}
                            </div>
                            <div className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest font-semibold">Hours</div>
                        </div>

                        {/* Minutes */}
                        <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative group hover:border-[#9dff00]/30 hover:shadow-[0_0_30px_-5px_rgba(157,255,0,0.12)] transition-all duration-300 flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] shadow-2xl">
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#9dff00]/40 to-transparent rounded-t-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight leading-none mb-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.05)] bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </div>
                            <div className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest font-semibold">Minutes</div>
                        </div>

                        {/* Seconds */}
                        <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative group hover:border-[#9dff00]/30 hover:shadow-[0_0_30px_-5px_rgba(157,255,0,0.2)] transition-all duration-300 flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] shadow-2xl">
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#9dff00]/50 to-transparent rounded-t-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
                            <div className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight leading-none mb-3 drop-shadow-[0_0_25px_rgba(157,255,0,0.25)] bg-gradient-to-b from-[#c0ff55] via-[#9dff00] to-[#72bd00] bg-clip-text text-transparent animate-pulse">
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </div>
                            <div className="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold">Seconds</div>
                        </div>
                    </div>
                )}

                {/* Event details card */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-400 text-xs sm:text-sm font-mono border-t border-zinc-900 pt-8 w-full max-w-xl">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#9dff00]" />
                        <span>{EVENT_LOCATION}</span>
                    </div>
                    <div className="hidden sm:block text-zinc-700">•</div>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#9dff00]" />
                        <span>July 9-11, 2026</span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-8 text-center text-zinc-600 text-xs font-mono z-10 border-t border-zinc-900/40">
                © 2026 Cloud Community Club (C³) & Student Developers Community (SDC) – SNIST.
            </footer>
        </div>
    )
}
