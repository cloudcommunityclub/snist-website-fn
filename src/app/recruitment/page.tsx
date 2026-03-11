'use client';

import { useState, useRef } from 'react';
import { Candidate, ProblemStatement } from '@/types/recruitment';
import { RECRUITMENT_CATEGORIES } from '@/dispositions/recruitment';
import { RECRUITMENT_OPEN } from '@/dispositions/general';

// Component Imports
import Hero from '@/components/recruitment/Hero';
import Roadmap from '@/components/recruitment/Roadmap';
import PositionBoard from '@/components/recruitment/PositionBoard';
import UnlockModal from '@/components/recruitment/UnlockModal';
import ChallengeDetail from '@/components/recruitment/ChallengeDetail';

export default function RecruitmentPage() {
    // State
    const [userProfile, setUserProfile] = useState<Candidate | null>(null);
    const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);
    const [showUnlockModal, setShowUnlockModal] = useState(false);

    // Ref to store the problem user tried to click before unlocking
    const pendingProblemRef = useRef<ProblemStatement | null>(null);

    // Handler: Problem Click (Interceptor Logic)
    const handleProblemClick = (problem: ProblemStatement) => {
        if (!userProfile) {
            // User not verified, store pending problem and show modal
            pendingProblemRef.current = problem;
            setShowUnlockModal(true);
        } else {
            // User is verified, navigate to challenge detail
            setSelectedProblem(problem);
        }
    };

    // Handler: Unlock (Form Submission)
    const handleUnlock = (candidateData: Candidate) => {
        setUserProfile(candidateData);
        setShowUnlockModal(false);

        // Immediately navigate to the pending problem
        if (pendingProblemRef.current) {
            setSelectedProblem(pendingProblemRef.current);
            pendingProblemRef.current = null;
        }
    };

    // Handler: Back from Challenge Detail
    const handleBack = () => setSelectedProblem(null);

    // Handler: Close Modal
    const handleCloseModal = () => {
        setShowUnlockModal(false);
        pendingProblemRef.current = null;
    };

    // Recruitment closed state — change RECRUITMENT_OPEN in dispositions/general.tsx to toggle
    if (!RECRUITMENT_OPEN) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-6">
                <div className="text-center space-y-5 max-w-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-xs font-mono text-red-400 tracking-widest uppercase">Recruitment Closed</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white title-main">Recruitment is currently closed</h1>
                    <p className="text-gray-400 font-light text-base leading-relaxed">
                        We&apos;ll announce the next recruitment window on our socials. Follow us to stay in the loop.
                    </p>
                    <a
                        href="https://www.instagram.com/c3.snist/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                        Follow @c3.snist
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-black text-slate-300">
            {/* Hero Section */}
            <Hero />

            {/* Roadmap Section */}
            <Roadmap />

            {/* Conditional Render: Challenge Detail OR Position Board */}
            {selectedProblem ? (
                <ChallengeDetail
                    problem={selectedProblem}
                    candidateEmail={userProfile?.email ?? ''}
                    onBack={handleBack}
                />
            ) : (
                <PositionBoard
                    categories={RECRUITMENT_CATEGORIES}
                    onSelectProblem={handleProblemClick}
                />
            )}

            {/* Unlock Modal (Interceptor) */}
            <UnlockModal
                isOpen={showUnlockModal}
                onUnlock={handleUnlock}
                onClose={handleCloseModal}
            />
        </div>
    );
}
