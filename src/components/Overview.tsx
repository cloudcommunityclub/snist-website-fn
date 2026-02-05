'use client'

import React from 'react'
import { Rocket, BookOpen, FlaskConical, Users, LucideIcon } from 'lucide-react'
import { ReactTyped } from 'react-typed'
import Link from 'next/link'
import { SiDiscord, SiLinkedin, SiInstagram, SiGithub } from 'react-icons/si'
import { FaXTwitter } from 'react-icons/fa6'

type Activity = {
    title: string;
    description: string;
    icon: LucideIcon;
    side: "left" | "right";
};

const activities: Activity[] = [
    {
        title: "Explore Cutting Edge Tech",
        description: "Master industry-standard tools and stay ahead in the evolving technology landscape.",
        icon: Rocket,
        side: "left"
    },
    {
        title: "Open Source Contributions",
        description: "Contribute to free and open source projects and make a meaningful impact in the tech community.",
        icon: BookOpen,
        side: "right"
    },
    {
        title: "Research Driven Activities",
        description: "Explore and advance in your field of interest through research papers and innovative projects.",
        icon: FlaskConical,
        side: "left"
    },
    {
        title: "Networking",
        description: "Connect with like-minded people, because your network is your net worth in the tech industry.",
        icon: Users,
        side: "right"
    }
];

function ActivityItem({ title, description, icon: Icon, side }: Activity) {
    const isLeft = side === "left";

    return (
        // Wrapper matches the side, but content inside is always clean
        <div className={`flex w-full ${isLeft ? 'justify-end md:pr-8' : 'justify-start md:pl-8'}`}>

            {/* The Glass Card */}
            <div className="relative group w-full max-w-lg p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">

                {/* Decorative glow behind the icon */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-cyan-500/20 blur-xl rounded-full group-hover:bg-cyan-500/40 transition-all" />

                <div className="flex flex-col items-start text-left gap-4">
                    {/* Header: Icon + Title */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-black/50 border border-white/20 rounded-lg group-hover:border-cyan-400/50 transition-colors">
                            <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-100">
                            {title}
                        </h3>
                    </div>

                    {/* Description */}
                    <p className="text-base text-neutral-400 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Connector Line (Desktop Only) */}
                <div className={`hidden md:block absolute top-1/2 w-8 h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent 
                    ${isLeft ? '-right-8 rotate-0' : '-left-8 rotate-180'} 
                `} />

                {/* Connector Dot on Center Line */}
                <div className={`hidden md:block absolute top-1/2 w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]
                    ${isLeft ? '-right-[38px] translate-x-1/2' : '-left-[38px] -translate-x-1/2'} 
                    transform -translate-y-1/2 z-10
                `} />
            </div>
        </div>
    );
}

// Reusable Social Button Component to clean up the code
const SocialButton = ({ href, icon: Icon, label, hoverColor, hoverBorder }: any) => (
    <Link href={href} target='_blank'>
        <button className={`
            flex items-center justify-center gap-3 
            w-[160px] md:w-[180px] py-3 rounded-lg
            bg-neutral-900/80 border border-neutral-800 
            text-neutral-300 font-bold text-lg
            transition-all duration-300 ease-out
            hover:-translate-y-1 hover:scale-105 hover:text-white hover:shadow-lg
            ${hoverColor} ${hoverBorder}
        `}>
            <Icon className="text-xl md:text-2xl" />
            {label}
        </button>
    </Link>
);

export default function Overview(): React.ReactNode {
    return (
        <div className='py-20 md:py-32 flex flex-col justify-center items-center bg-black overflow-hidden'>
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6">

                {/* Header */}
                <div className="text-center mb-20 relative z-10">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-mono">
                        &lt; What We Do /&gt;
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Crafting the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Future</span>
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                        Join us in our journey to explore, contribute, research, and network in the world of technology.
                    </p>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Vertical Center Line (Gradient) */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-900/50 to-transparent md:-translate-x-1/2" />

                    {/* Activities Loop */}
                    <div className="flex flex-col gap-12 md:gap-24 relative z-10">
                        {activities.map((activity, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-center w-full">
                                {/* Left Column */}
                                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                                    {/* 
                                        Mobile: Always render the item here (stacked).
                                        Desktop: Only render if side is 'left'.
                                     */}
                                    <div className={`w-full ${activity.side === 'left' ? '' : 'md:hidden'}`}>
                                        <ActivityItem {...activity} />
                                    </div>
                                </div>

                                {/* Right Column (Desktop Only) */}
                                <div className="hidden md:flex w-1/2 justify-start">
                                    {/* Desktop: Render if side is 'right' */}
                                    {activity.side === 'right' && (
                                        <div className="w-full">
                                            <ActivityItem {...activity} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer / Connect Section */}
            <div className="mt-32 w-full border-t border-white/10 bg-neutral-950/50 backdrop-blur-sm">
                <div className='py-16 px-4 text-center max-w-7xl mx-auto'>
                    <div className="mb-8">
                        <span className="text-4xl">🤝</span>
                        <h3 className='mt-4 text-2xl font-bold text-white'>Connect with C³</h3>
                        <p className='text-neutral-500'>Join our growing community</p>
                    </div>

                    <div className='flex flex-wrap gap-4 justify-center'>
                        <SocialButton
                            href='https://discord.gg/dBNXWDKhrD'
                            icon={SiDiscord}
                            label="Discord"
                            hoverColor="hover:bg-[#5865F2]"
                            hoverBorder="hover:border-[#5865F2]"
                        />
                        <SocialButton
                            href='https://www.linkedin.com/company/cloud-community-club'
                            icon={SiLinkedin}
                            label="LinkedIn"
                            hoverColor="hover:bg-[#0077b5]"
                            hoverBorder="hover:border-[#0077b5]"
                        />
                        <SocialButton
                            href='https://www.instagram.com/c3.snist/'
                            icon={SiInstagram}
                            label="Instagram"
                            hoverColor="hover:bg-[#E4405F]"
                            hoverBorder="hover:border-[#E4405F]"
                        />
                        <SocialButton
                            href='https://github.com/C3Snist'
                            icon={SiGithub}
                            label="GitHub"
                            hoverColor="hover:bg-neutral-800"
                            hoverBorder="hover:border-white"
                        />
                        <SocialButton
                            href='https://x.com/C3Snist'
                            icon={FaXTwitter}
                            label="X / Twitter"
                            hoverColor="hover:bg-black"
                            hoverBorder="hover:border-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}