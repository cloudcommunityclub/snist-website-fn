'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const steps = [
    {
        id: '01',
        title: 'Target Lock',
        desc: 'Identify your role within the ecosystem',
        icon: '/assets/recruitment/target.png',
        color: 'from-blue-500 to-cyan-400'
    },
    {
        id: '02',
        title: 'Deploy Skills',
        desc: 'Showcase your capability through challenges',
        icon: '/assets/recruitment/zap.png',
        color: 'from-cyan-400 to-emerald-400'
    },
    {
        id: '03',
        title: 'Push Origin',
        desc: 'Submit your solution for code review',
        icon: '/assets/recruitment/rocket.png',
        color: 'from-emerald-400 to-purple-500'
    },
    {
        id: '04',
        title: 'System Upgrade',
        desc: 'Join the core team & access classifieds',
        icon: '/assets/recruitment/core.png',
        color: 'from-purple-500 to-pink-500'
    }
];

export default function Roadmap() {
    return (
        <section className="relative w-full py-32 bg-black overflow-hidden" id="roadmap">
            {/* Ambient Background - Subtle & Deep */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-900/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-purple-900/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
                {/* Header */}
                <div className="mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-xs font-mono text-cyan-400/80 tracking-[0.3em] uppercase mb-4 border border-cyan-900/30 inline-block px-4 py-1 rounded-full bg-cyan-950/10">
                            Recruitment Pipeline
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-bold text-white title-main tracking-tight">
                            Path to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Core</span>
                        </h3>
                    </motion.div>
                </div>

                {/* Steps Container */}
                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Connecting Line (Desktop) - Technical Dashed Line */}
                    <div className="hidden md:block absolute top-[3.5rem] left-0 w-full h-px border-t border-dashed border-gray-800 -z-10" />

                    {steps.map((step, index) => {
                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="group relative"
                            >
                                {/* Card Content */}
                                <div className="relative h-full flex flex-col items-center text-center p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 group-hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)] group-hover:-translate-y-1">

                                    {/* Step Number Badge */}
                                    <div className="absolute top-6 right-6 text-[10px] font-mono text-gray-700 group-hover:text-cyan-400 transition-colors">
                                        {step.id}
                                    </div>

                                    {/* Icon Container - Clean & Sharp */}
                                    <div className="relative mb-8 bg-black p-4 rounded-2xl border border-white/10 group-hover:border-cyan-500/30 transition-colors shadow-2xl overflow-hidden group-hover:scale-105 duration-300">
                                        <div className="absolute inset-0 bg-cyan-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Image
                                            src={step.icon}
                                            alt={step.title}
                                            width={64}
                                            height={64}
                                            className="relative z-10 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                                        />
                                    </div>

                                    {/* Text */}
                                    <h4 className="text-lg font-bold text-white mb-3 uppercase tracking-wider title-main">
                                        {step.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 leading-relaxed font-light">
                                        {step.desc}
                                    </p>
                                </div>

                                {/* Custom Connector Dot for Dashed Line */}
                                <div className="hidden md:block absolute top-[3.5rem] left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border border-gray-800 group-hover:border-cyan-400 group-hover:bg-cyan-950 transition-colors z-0" />

                                {/* Mobile Connector */}
                                {index !== steps.length - 1 && (
                                    <div className="md:hidden absolute left-1/2 -translate-x-1/2 -bottom-8 w-px h-8 border-l border-dashed border-gray-800" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
