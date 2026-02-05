'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Users, Target, Zap, Heart } from 'lucide-react'

export default function RecruitmentPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8 relative inline-block"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-30 animate-pulse" />
                            <span className="relative px-6 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-sm font-medium text-cyan-400">
                                🚀 We are Hiring Core Team Members
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-6xl md:text-8xl font-bold mb-8 tracking-tight"
                        >
                            Join the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500">Revolution.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            Be part of the Cloud Community Club (C³) core team. Lead initiatives, build real-world projects, and shape the future of tech at SNIST.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <Link
                                href="https://forms.gle/YOUR_GOOGLE_FORM_LINK" // Placeholder link
                                target="_blank"
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                            >
                                Apply Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Users className="w-8 h-8 text-blue-400" />,
                                    title: "Leadership",
                                    desc: "Lead teams, organize events, and mentor juniors. Build leadership skills that matter."
                                },
                                {
                                    icon: <Target className="w-8 h-8 text-cyan-400" />,
                                    title: "Impact",
                                    desc: "Create tangible impact through open source projects and community workshops."
                                },
                                {
                                    icon: <Zap className="w-8 h-8 text-purple-400" />,
                                    title: "Growth",
                                    desc: "Access exclusive mentorship, resources, and unexpected opportunities."
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors backdrop-blur-sm"
                                >
                                    <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/5">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Culture Section */}
                <section className="py-32 px-6 border-t border-white/5">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative aspect-square rounded-3xl overflow-hidden"
                            >
                                <Image
                                    src="/assets/events/ai-hack-day-main.webp" // Reusing an event image for now
                                    alt="Team Culture"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 mix-blend-overlay" />
                            </motion.div>
                        </div>
                        <div className="md:w-1/2">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl font-bold mb-6"
                            >
                                More than just <br />
                                <span className="text-gray-500">a technical club.</span>
                            </motion.h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                We are a family of creators, builders, and dreamers. We believe in learning by doing and growing together. Whether you are a coding wizard, a design virtuoso, or a management pro, there's a place for you here.
                            </p>
                            <ul className="space-y-4 mb-12">
                                {[
                                    "Contribution to Real-world Projects",
                                    "Exclusive Networking with Industry Experts",
                                    "Priority Access to Hackathons & Events"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <Heart className="w-3 h-3 text-cyan-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to make your mark?</h2>
                        <p className="text-xl text-gray-400 mb-12">Applications are open for a limited time. Don't miss out.</p>
                        <Link
                            href="https://forms.gle/YOUR_GOOGLE_FORM_LINK" // Placeholder Link
                            target="_blank"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors"
                        >
                            Start Application <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}
