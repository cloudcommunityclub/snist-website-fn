import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Recruitment 2026',
    description: 'Join C3 — Cloud Community Club Recruitment 2026. Explore design, development, marketing and operations challenges.',
    openGraph: {
        title: 'Recruitment 2026 | Cloud Community Club',
        description: 'Prove yourself. Join the C3 core team.',
        images: [{ url: '/ccc_logo.webp', width: 1200, height: 630, alt: 'C3 Recruitment 2026' }],
    },
};

export default function RecruitmentLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
