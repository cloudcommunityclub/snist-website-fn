import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Join Us',
    description: 'Become a member of Cloud Community Club at SNIST. Fill in the terminal form and join a community of cloud builders.',
    openGraph: {
        title: 'Join C3 | Cloud Community Club',
        description: 'Join the Cloud Community Club — terminal-style membership form.',
        images: [{ url: '/ccc_logo.webp', width: 1200, height: 630, alt: 'Join C3' }],
    },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
