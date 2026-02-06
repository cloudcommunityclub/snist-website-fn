'use client';

import { ProblemStatement } from '@/types/recruitment';

interface ChallengeDetailProps {
    problem: ProblemStatement;
    onBack: () => void;
}

export default function ChallengeDetail({ problem, onBack }: ChallengeDetailProps) {
    return (
        <div>
            {/* Header */}
            <div>
                <h1>{problem.title}</h1>
                <p>{problem.description}</p>
            </div>

            {/* Action */}
            <div>
                <a
                    href={problem.githubIssueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View GitHub Issue
                </a>
            </div>

            {/* Instructions */}
            <div>
                <h2>How to Complete This Challenge</h2>
                <ol>
                    <li>Comment on the issue: &quot;Assigning to myself&quot;</li>
                    <li>Fork &amp; Code</li>
                    <li>Raise PR with solution</li>
                </ol>
            </div>

            {/* Navigation */}
            <div>
                <button onClick={onBack}>Back</button>
            </div>
        </div>
    );
}
