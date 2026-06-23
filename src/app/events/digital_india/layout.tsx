import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Digital India – Innovation Challenge',
    description: 'Register for the Digital India Innovation Challenge by Cloud Community Club at SNIST. Submit your tech-driven ideas to reshape governance, education, healthcare, and public services.',
    openGraph: {
        title: 'Digital India Innovation Challenge | Cloud Community Club',
        description: 'Submit bold, tech-driven ideas for India\'s digital transformation.',
        images: [{ url: '/assets/events/digital-india-banner.png', width: 1200, height: 630, alt: 'Digital India Innovation Challenge' }],
    },
};

export default function DigitalIndiaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
