import React from 'react'
import DigitalIndiaGSAPForm from '@/components/DigitalIndiaGSAPForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Digital India – Hackathon',
    description: 'Register for the Digital India Hackathon by Cloud Community Club at SNIST. Submit your tech-driven ideas to reshape governance, education, healthcare, and public services.',
    openGraph: {
        title: 'Digital India Hackathon | Cloud Community Club',
        description: 'Submit bold, tech-driven ideas for India\'s digital transformation.',
        images: [{ url: '/assets/events/digital-india-banner-v2.png', width: 1200, height: 630, alt: 'Digital India Hackathon' }],
    },
}

export default function DigitalIndiaIdeathonPage() {
    return <DigitalIndiaGSAPForm />
}
