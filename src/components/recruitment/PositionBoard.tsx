'use client';

import { useState } from 'react';
import { PositionCategory, ProblemStatement } from '@/types/recruitment';

interface PositionBoardProps {
    categories: PositionCategory[];
    onSelectProblem: (problem: ProblemStatement) => void;
}

export default function PositionBoard({ categories, onSelectProblem }: PositionBoardProps) {
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

    const handleCategoryClick = (categoryId: string) => {
        setActiveCategoryId(activeCategoryId === categoryId ? null : categoryId);
    };

    return (
        <div>
            {categories.map((category) => (
                <div key={category.id}>
                    <button onClick={() => handleCategoryClick(category.id)}>
                        {category.title}
                    </button>
                    <p>{category.description}</p>

                    {activeCategoryId === category.id && (
                        <ul>
                            {category.problems.map((problem) => (
                                <li key={problem.id}>
                                    <button onClick={() => onSelectProblem(problem)}>
                                        {problem.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}
