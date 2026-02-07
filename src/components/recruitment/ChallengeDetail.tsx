'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ProblemStatement } from '@/types/recruitment';

interface ChallengeDetailProps {
    problem: ProblemStatement;
    onBack: () => void;
}

const instructions = [
    {
        step: '01',
        title: 'Claim the Issue',
        command: 'Comment: "Assigning to myself"',
        description: 'Visit the GitHub issue and claim it by commenting.',
    },
    {
        step: '02',
        title: 'Fork & Clone',
        command: 'git clone https://github.com/YOUR_USERNAME/repo.git',
        description: 'Fork the repository and clone it to your local machine.',
    },
    {
        step: '03',
        title: 'Implement Solution',
        command: 'git checkout -b feature/your-solution',
        description: 'Create a new branch and implement your solution.',
    },
    {
        step: '04',
        title: 'Submit PR',
        command: 'git push origin feature/your-solution',
        description: 'Push your changes and open a Pull Request.',
    },
];

export default function ChallengeDetail({ problem, onBack }: ChallengeDetailProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-12 px-6 md:px-12 lg:px-20"
        >
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-orb transition-colors mb-8 group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono text-sm uppercase tracking-wider">Return to Board</span>
            </button>

            {/* Terminal View Container */}
            <div className="bg-neutral-900/90 border border-gray-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-4 font-mono text-gray-500 text-sm">challenge://mission-brief</span>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-xs uppercase tracking-widest mb-2 title-main">
                            Classified Challenge
                        </p>
                        <h1 className="text-white font-bold text-2xl md:text-3xl tracking-tight mb-4 title-main">
                            {problem.title}
                        </h1>
                        <p className="text-gray-400 text-base leading-relaxed">
                            {problem.description}
                        </p>
                    </div>

                    {/* Primary Action */}
                    <a
                        href={problem.githubIssueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white/5 border border-gray-700 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-white/10 hover:border-blue-500 hover:text-blue-400 transition-all group"
                    >
                        <span>Access Classified Issue</span>
                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* Divider */}
                    <div className="my-10 border-t border-gray-800" />

                    {/* Instructions Checklist */}
                    <div>
                        <h2 className="font-semibold text-gray-500 text-xs uppercase tracking-widest mb-6">
                            Mission Protocol
                        </h2>
                        <div className="space-y-6">
                            {instructions.map((item, index) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium mb-1 title-main">
                                            {item.step}. {item.title}
                                        </p>
                                        <code className="block font-mono text-purple-400 text-sm bg-black/30 border border-gray-800 px-3 py-2 rounded mb-2">
                                            {item.command}
                                        </code>
                                        <p className="text-slate-500 text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
