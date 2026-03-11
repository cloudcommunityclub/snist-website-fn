import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Events',
    description: 'Past and upcoming events hosted by Cloud Community Club at SNIST — hackathons, workshops, and tech talks.',
    openGraph: {
        title: 'Events | Cloud Community Club',
        description: 'Cloud, AI, and DevOps events by C3.',
        images: [{ url: '/ccc_logo.webp', width: 1200, height: 630, alt: 'C3 Events' }],
    },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
