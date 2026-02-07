'use client';

import React, { useState } from 'react';
import FlowingMenu, { MenuItemData } from './FlowingMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { RECRUITMENT_CATEGORIES } from '@/dispositions/recruitment';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { PositionCategory, ProblemStatement } from '@/types/recruitment';

interface PositionBoardProps {
    categories: PositionCategory[];
    onSelectProblem: (problem: ProblemStatement) => void;
}

export default function PositionBoard({ categories = RECRUITMENT_CATEGORIES, onSelectProblem }: PositionBoardProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const handleBack = () => {
        setExpandedCategory(null);
    };

    const recruitmentItems: MenuItemData[] = [
        {
            link: '#',
            text: 'Designing',
            image: '/assets/recruitment/recruitment_designing.png',
            onClick: () => setExpandedCategory('designing')
        },
        {
            link: '#',
            text: 'Development',
            image: '/assets/recruitment/recruitment_development.png',
            onClick: () => setExpandedCategory('development')
        },
        {
            link: '#',
            text: 'Marketing',
            image: '/assets/recruitment/recruitment_marketing.png',
            onClick: () => setExpandedCategory('marketing')
        },
        {
            link: '#',
            text: 'Operations',
            image: '/assets/recruitment/recruitment_operations.png',
            onClick: () => setExpandedCategory('operations')
        }
    ];

    const activeCategoryData = categories.find(c => c.id === expandedCategory);

    return (
        <section className="relative w-full h-[900px] bg-black overflow-hidden flex flex-col" id="positions">
            {/* Header */}
            <div className="w-full text-center z-20 pt-20 pb-10 bg-black shrink-0 relative">
                <AnimatePresence mode="wait">
                    {expandedCategory ? (
                        <motion.div
                            key="back-button"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute left-10 top-20 flex items-center gap-2 cursor-pointer text-white/50 hover:text-white transition-colors"
                            onClick={handleBack}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="uppercase tracking-widest text-sm font-mono">Back to Tracks</span>
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                <h2 className="text-sm font-mono text-white/50 tracking-[0.2em] uppercase mb-2">
                    {expandedCategory ? 'Track Details' : 'Open Positions'}
                </h2>
                <h3 className="text-3xl font-bold text-white uppercase">
                    {expandedCategory ? activeCategoryData?.title : 'Choose Your Track'}
                </h3>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 relative">
                <AnimatePresence mode="wait">
                    {!expandedCategory ? (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-10"
                        >
                            <FlowingMenu
                                items={recruitmentItems}
                                speed={20}
                                textColor="#ffffff"
                                bgColor="#000000"
                                marqueeBgColor="#2dd4bf"
                                marqueeTextColor="#000000"
                                borderColor="#333333"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="absolute inset-0 z-20 overflow-y-auto px-6 pb-20"
                        >
                            <div className="max-w-7xl mx-auto">
                                <p className="text-gray-400 max-w-2xl mx-auto text-center mb-16 text-lg">
                                    {activeCategoryData?.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {activeCategoryData?.problems.map((problem) => (
                                        <div
                                            key={problem.id}
                                            className="group relative p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="font-mono text-xs text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-900/50">
                                                    {problem.id}
                                                </span>
                                                <a
                                                    href={problem.githubIssueUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-zinc-500 hover:text-white transition-colors"
                                                >
                                                    <Github className="w-5 h-5" />
                                                </a>
                                            </div>

                                            <h4 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-cyan-400 transition-colors">
                                                {problem.title}
                                            </h4>

                                            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                                                {problem.description}
                                            </p>

                                            <div
                                                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 group-hover:text-cyan-300 transition-colors cursor-pointer"
                                                onClick={() => onSelectProblem(problem)}
                                            >
                                                View Challenge <ArrowUpRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
