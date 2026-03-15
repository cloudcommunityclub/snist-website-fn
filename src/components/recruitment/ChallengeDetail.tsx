'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ProblemStatement } from '@/types/recruitment';

interface ChallengeDetailProps {
    problem: ProblemStatement;
    candidateEmail: string;
    onBack: () => void;
}

const instructions = [
    {
        step: '01',
        title: 'Claim the Issue',
        command: 'Comment: "Assigning to myself"',
        description: 'Visit the GitHub issue and claim it by commenting. Pick only ONE problem across all categories.',
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
        description: 'Push your changes and open a Pull Request against the main branch.',
    },
];

function SubmitPR({ candidateEmail, problemId }: { candidateEmail: string; problemId: string }) {
    const [prUrl, setPrUrl] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = prUrl.trim();
        if (!trimmed) return;
        setStatus('submitting');
        setErrorMsg('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recruitment/submit`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({ email: candidateEmail, problemId, prUrl: trimmed }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error ?? 'Submission failed');
            }
            setStatus('done');
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    if (status === 'done') {
        return (
            <div className="mt-8 p-5 bg-cyan-400/5 border border-cyan-500/20 rounded-xl text-center">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                <p className="text-cyan-400 font-mono text-sm">PR submission recorded. Good luck!</p>
                <p className="text-gray-600 font-mono text-xs mt-1">We&apos;ll be in touch for the next round.</p>
            </div>
        );
    }

    
}

export default function ChallengeDetail({ problem, candidateEmail, onBack }: ChallengeDetailProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-12 px-4 sm:px-6 md:px-12 lg:px-20"
        >
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-colors duration-300 mb-8 group min-h-[44px]"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono text-xs uppercase tracking-widest">Return to Board</span>
            </button>

            {/* Terminal View Container */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-5 py-3.5 bg-white/[0.03] border-b border-white/[0.06]">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="ml-4 font-mono text-white/20 text-xs truncate">challenge://mission-brief</span>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">Classified Challenge</span>
                        </div>
                        <h1 className="text-white font-bold text-xl sm:text-2xl md:text-3xl tracking-tight mb-4 title-main">
                            {problem.title}
                        </h1>
                        <p className="text-gray-500 text-base leading-relaxed font-light">
                            {problem.description}
                        </p>
                    </div>

                    {/* Process guidance */}
                    <div className="mb-6 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                        <p className="font-mono text-white/30 text-xs uppercase tracking-widest mb-1">How it works</p>
                        <p className="text-gray-500 text-sm font-light leading-relaxed">
                            Pick <strong className="text-gray-400 font-medium">one problem</strong> from any category.
                            Claim the GitHub issue, implement your solution.
                            — we track all submissions in our backend.
                        </p>
                    </div>

                    {/* Primary Action */}
                    <a
                        href={problem.githubIssueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white/5 border border-white/[0.08] text-white font-bold uppercase tracking-widest px-6 sm:px-8 py-4 rounded-xl hover:bg-white/[0.08] hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-300 group hover:shadow-[0_0_20px_-6px_rgba(6,182,212,0.15)] w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <span className="text-sm">Access Classified Issue</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* Divider */}
                    <div className="my-10 border-t border-white/[0.04]" />

                    {/* Instructions Checklist */}
                    

                    {/* PR Submission Form — only shown to verified candidates */}
                    {candidateEmail && (
                        <SubmitPR candidateEmail={candidateEmail} problemId={problem.id} />
                    )}
                </div>
            </div>
        </motion.section>
    );
}
