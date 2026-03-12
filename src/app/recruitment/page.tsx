'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Candidate, ProblemStatement } from '@/types/recruitment';
import { RECRUITMENT_CATEGORIES } from '@/dispositions/recruitment';

// Lazy load heavy components for better initial page load
const Hero = dynamic(() => import('@/components/recruitment/Hero'), { ssr: true });
const Roadmap = dynamic(() => import('@/components/recruitment/Roadmap'), { ssr: true });
const PositionBoard = dynamic(() => import('@/components/recruitment/PositionBoard'), { ssr: true });
const UnlockModal = dynamic(() => import('@/components/recruitment/UnlockModal'), { ssr: false });
const ChallengeDetail = dynamic(() => import('@/components/recruitment/ChallengeDetail'), { ssr: true });

export default function RecruitmentPage() {
    // State
    const [userProfile, setUserProfile] = useState<Candidate | null>(null);
    const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);
    const [showUnlockModal, setShowUnlockModal] = useState(false);

    // Ref to store the problem user tried to click before unlocking
    const pendingProblemRef = useRef<ProblemStatement | null>(null);

    // Handler: Problem Click (Interceptor Logic)
    const handleProblemClick = useCallback((problem: ProblemStatement) => {
        if (!userProfile) {
            // User not verified, store pending problem and show modal
            pendingProblemRef.current = problem;
            setShowUnlockModal(true);
        } else {
            // User is verified, navigate to challenge detail
            setSelectedProblem(problem);
        }
    }, [userProfile]);

    // Handler: Unlock (Form Submission)
    const handleUnlock = useCallback((candidateData: Candidate) => {
        // Simulate API call - save candidate data
        setUserProfile(candidateData);

        // Close modal
        setShowUnlockModal(false);

        // Immediately navigate to the pending problem
        if (pendingProblemRef.current) {
            setSelectedProblem(pendingProblemRef.current);
            pendingProblemRef.current = null;
        }
    }, []);

    // Handler: Back from Challenge Detail
    const handleBack = useCallback(() => {
        setSelectedProblem(null);
    }, []);

    // Handler: Close Modal
    const handleCloseModal = useCallback(() => {
        setShowUnlockModal(false);
        pendingProblemRef.current = null;
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden bg-black text-slate-300">
            {/* Hero Section */}
            <Hero />

            {/* Roadmap Section */}
            <Roadmap />

            {/* Conditional Render: Challenge Detail OR Position Board */}
            {selectedProblem ? (
                <ChallengeDetail problem={selectedProblem} onBack={handleBack} />
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
