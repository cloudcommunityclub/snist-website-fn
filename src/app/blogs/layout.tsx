import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Articles on Cloud, AI/ML, DevOps, Community and Security from the C3 team at SNIST.',
    openGraph: {
        title: 'Blog | Cloud Community Club',
        description: 'Technical articles and community updates from C3.',
        images: [{ url: '/ccc_logo.webp', width: 1200, height: 630, alt: 'C3 Blog' }],
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
