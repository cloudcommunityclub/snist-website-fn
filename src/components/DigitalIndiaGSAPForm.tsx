'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { gsap } from 'gsap'
import { 
    Check, ArrowRight, Upload, CreditCard, Loader2,
    Trophy, Award, Gift, Sparkles, Code, Brain, Users2, ChevronDown, Copy, Search, Medal, Calendar, MapPin
} from 'lucide-react'
import Image from 'next/image'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}


interface FormErrors {
    leaderName?: string
    email?: string
    phone?: string
    college?: string
    domain?: string
    teamName?: string
    idea?: string
    utrId?: string
    screenshot?: string
    [key: string]: string | undefined
}

const faqs = [
    {
        q: "What is the team size requirement?",
        a: "Teams must consist of 1 to 4 members to participate in the hackathon. Solo or duo participations are permitted."
    },
    {
        q: "Can team members be from different colleges?",
        a: "Yes. Cross-college teams are welcome. You can collaborate with innovators from any institution across India."
    },
    {
        q: "Is there a registration fee?",
        a: "Yes. The registration fee is ₹99 per team submission for the Stage 1 Online Ideathon. For teams shortlisted for the Stage 2 Offline Hackathon, there is a participation fee of ₹300 per participant."
    },
    {
        q: "Is there a referral reward?",
        a: "Yes! If your team registers and gets 10 successful referrals using your unique referral code, your team will get FREE passes (participation fee waived) for the Stage 2 Offline Hackathon."
    },
    {
        q: "Can we modify our idea after submission?",
        a: "No. The submitted idea is considered final and cannot be modified. Make sure to describe your idea thoroughly before submitting."
    },
    {
        q: "Will every participant receive a certificate?",
        a: "Yes. Every participant who submits a valid idea will receive a Participation Certificate."
    },
    {
        q: "Will food and refreshments be provided?",
        a: "Yes. Food and refreshments will be provided throughout the workshop and hackathon."
    },
    {
        q: "What should participants bring?",
        a: "Participants should bring: Laptop, Charger, and a valid College ID or Government-issued ID. Wi-Fi, charging facilities, and power outlets will be available at the venue."
    },
    {
        q: "Is physical attendance mandatory?",
        a: "Yes. Shortlisted teams must physically attend the workshop and hackathon at SNIST campus to maintain eligibility."
    }
]

export default function DigitalIndiaGSAPForm() {
    const REGISTRATIONS_CLOSED = true
    const router = useRouter()
    const searchParams = useSearchParams()
    const refParam = searchParams ? searchParams.get('ref') : null

    const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    // Form fields state
    const [leaderName, setLeaderName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [college, setCollege] = useState('')
    const [teamSize, setTeamSize] = useState<number>(3)
    const [teamMembers, setTeamMembers] = useState<{ name: string; email: string }[]>([
        { name: '', email: '' },
        { name: '', email: '' }
    ])
    const [domain, setDomain] = useState('')
    const [teamName, setTeamName] = useState('')
    const [idea, setIdea] = useState('')
    const [utrId, setUtrId] = useState('')
    const [screenshot, setScreenshot] = useState<File | null>(null)
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)

    // Referral System States
    const [referredBy, setReferredBy] = useState('')
    const [myReferralCode, setMyReferralCode] = useState('')
    const [dashboardEmail, setDashboardEmail] = useState('')
    const [dashboardData, setDashboardData] = useState<any>(null)
    const [dashboardLoading, setDashboardLoading] = useState(false)
    const [dashboardError, setDashboardError] = useState<string | null>(null)

    // Leaderboard States
    const [leaderboardSearch, setLeaderboardSearch] = useState('')
    const [leaderboardData, setLeaderboardData] = useState<any[]>([])
    const [leaderboardLoading, setLeaderboardLoading] = useState(false)

    const fetchDashboardStats = async (emailToFetch: string) => {
        setDashboardLoading(true)
        setDashboardError(null)
        try {
            const res = await fetch(`/api/digital-india/referrals/stats?email=${encodeURIComponent(emailToFetch.trim())}`)
            const result = await res.json()
            if (res.ok && result.success) {
                setDashboardData(result.data)
                setDashboardEmail(emailToFetch)
            } else {
                setDashboardError(result.message || 'Failed to load referral details.')
            }
        } catch (err) {
            console.error('Error fetching referral stats:', err)
            setDashboardError('Failed to fetch dashboard. Please try again.')
        } finally {
            setDashboardLoading(false)
        }
    }

    const handleDashboardLookup = (e: React.FormEvent) => {
        e.preventDefault()
        if (!dashboardEmail.trim()) {
            setDashboardError('Please enter a registered email address.')
            return
        }
        fetchDashboardStats(dashboardEmail)
        localStorage.setItem('c3_digital_india_registered_email', dashboardEmail.trim().toLowerCase())
    }

    const handleLogoutDashboard = () => {
        setDashboardData(null)
        setDashboardEmail('')
        setDashboardError(null)
        localStorage.removeItem('c3_digital_india_registered_email')
    }

    const fetchLeaderboard = async (search = '') => {
        setLeaderboardLoading(true)
        try {
            const res = await fetch(`/api/digital-india/referrals/leaderboard?search=${encodeURIComponent(search)}`)
            const result = await res.json()
            if (res.ok && result.success) {
                setLeaderboardData(result.data || [])
            }
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err)
        } finally {
            setLeaderboardLoading(false)
        }
    }

    // Load URL parameter and localStorage on mount
    useEffect(() => {
        if (refParam) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setReferredBy(refParam.toUpperCase())
        }

        const storedEmail = localStorage.getItem('c3_digital_india_registered_email')
        if (storedEmail) {
            fetchDashboardStats(storedEmail)
        }
    }, [refParam])

    // Fetch leaderboard with debounced search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchLeaderboard(leaderboardSearch)
        }, 300)
        return () => clearTimeout(delayDebounce)
    }, [leaderboardSearch])

    // Custom dropdown states
    const [isTeamSizeOpen, setIsTeamSizeOpen] = useState(false)
    const [isDomainOpen, setIsDomainOpen] = useState(false)

    const [errors, setErrors] = useState<FormErrors>({})
    const [isDesktop, setIsDesktop] = useState(false)
    const isFirstRender = useRef(true)


    // DOM Refs for animations
    const containerRef = useRef<HTMLDivElement>(null)
    const step1Ref = useRef<HTMLDivElement>(null)
    const step2Ref = useRef<HTMLDivElement>(null)
    const step3Ref = useRef<HTMLDivElement>(null)
    const step4Ref = useRef<HTMLDivElement>(null)

    // Dropdown Refs
    const teamSizeDropdownRef = useRef<HTMLDivElement>(null)
    const domainDropdownRef = useRef<HTMLDivElement>(null)

    // Landing page states & refs
    const formSectionRef = useRef<HTMLDivElement>(null)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    // Interactive SVG Refs
    const pageRef = useRef<HTMLDivElement>(null)
    const heroRef = useRef<HTMLDivElement>(null)
    const svgWrapRef = useRef<HTMLDivElement>(null)

    // UPI configurations
    const upiId = process.env.NEXT_PUBLIC_UPI_ID || '8008151542@pthdfc'
    const upiAmount = '99'

    const handleCopyUPI = async () => {
        try {
            await navigator.clipboard.writeText(upiId)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    // Detect screen width
    useEffect(() => {
        const checkIsDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024)
        }
        checkIsDesktop()
        window.addEventListener('resize', checkIsDesktop)
        return () => window.removeEventListener('resize', checkIsDesktop)
    }, [])

    // Click outside dropdowns
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (teamSizeDropdownRef.current && !teamSizeDropdownRef.current.contains(event.target as Node)) {
                setIsTeamSizeOpen(false)
            }
            if (domainDropdownRef.current && !domainDropdownRef.current.contains(event.target as Node)) {
                setIsDomainOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Dropdown open animation
    useEffect(() => {
        if (isTeamSizeOpen) {
            gsap.fromTo('.team-size-dropdown',
                { opacity: 0, y: -10, scaleY: 0.95, transformOrigin: 'top' },
                { opacity: 1, y: 0, scaleY: 1, duration: 0.25, ease: 'power3.out' }
            )
        }
    }, [isTeamSizeOpen])

    useEffect(() => {
        if (isDomainOpen) {
            gsap.fromTo('.domain-dropdown',
                { opacity: 0, y: -10, scaleY: 0.95, transformOrigin: 'top' },
                { opacity: 1, y: 0, scaleY: 1, duration: 0.25, ease: 'power3.out' }
            )
        }
    }, [isDomainOpen])

    // Global mousemove spotlight card coordinator
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const cards = document.querySelectorAll('.spotlight-card')
            cards.forEach((card) => {
                const htmlCard = card as HTMLElement
                const rect = htmlCard.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                htmlCard.style.setProperty('--mouse-x', `${x}px`)
                htmlCard.style.setProperty('--mouse-y', `${y}px`)
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Interactive Hero 3D Parallax Tilt
    useEffect(() => {
        const hero = heroRef.current
        const svgWrap = svgWrapRef.current
        if (!hero || !svgWrap) return

        const handleMouseMove = (e: MouseEvent) => {
            const rect = hero.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width - 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5

            gsap.to(svgWrap, {
                rotateY: x * 25,
                rotateX: y * -25,
                x: x * 10,
                y: y * 10,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000,
                transformOrigin: 'center center'
            })
        }

        const handleMouseLeave = () => {
            gsap.to(svgWrap, {
                rotateY: 0,
                rotateX: 0,
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            })
        }

        hero.addEventListener('mousemove', handleMouseMove)
        hero.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            hero.removeEventListener('mousemove', handleMouseMove)
            hero.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    // Interactive Floating Code-Character Trail
    useEffect(() => {
        const page = pageRef.current
        if (!page) return

        let lastMove = 0
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now()
            if (now - lastMove < 40) return // Limit frequency to 40ms for high performance
            lastMove = now

            const x = e.pageX
            const y = e.pageY

            const chars = ['{', '}', '[', ']', '(', ')', '<', '>', '/', ';', '+', '-', '=', '*', '%', '!', '?', '&', '|', '^', '~', '$']
            const char = chars[Math.floor(Math.random() * chars.length)]

            const span = document.createElement('span')
            span.innerText = char
            span.className = 'absolute pointer-events-none font-mono text-[#9dff00] font-bold select-none text-shadow-neon'
            
            const fontSize = Math.floor(Math.random() * 8) + 12 // 12px to 20px
            const angle = Math.random() * 360
            const distance = Math.random() * 40 + 20
            const travelX = Math.cos(angle * Math.PI / 180) * distance
            const travelY = -Math.abs(Math.sin(angle * Math.PI / 180) * distance) - 20 // Drift upwards

            span.style.left = `${x}px`
            span.style.top = `${y}px`
            span.style.fontSize = `${fontSize}px`
            span.style.opacity = '0.9'
            span.style.transform = 'translate(-50%, -50%) scale(0.6)'
            span.style.transition = 'all 1s cubic-bezier(0.1, 0.8, 0.3, 1)'
            span.style.zIndex = '50'

            page.appendChild(span)

            requestAnimationFrame(() => {
                span.style.transform = `translate(-50%, -50%) translate(${travelX}px, ${travelY}px) scale(1.2) rotate(${Math.random() * 60 - 30}deg)`
                span.style.opacity = '0'
            })

            setTimeout(() => {
                span.remove()
            }, 1000)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    // Landing page animation
    useEffect(() => {
        const updateLinePosition = () => {
            const container = document.querySelector('.timeline-container-anim')
            const firstDot = document.querySelector('.timeline-item-anim:first-child .timeline-dot')
            const lastDot = document.querySelector('.timeline-item-anim:last-child .timeline-dot')
            const baseLine = document.querySelector('.timeline-base-line')
            const progressLine = document.querySelector('.timeline-progress-line')

            if (container && firstDot && lastDot && baseLine && progressLine) {
                const containerRect = container.getBoundingClientRect()
                const firstRect = firstDot.getBoundingClientRect()
                const lastRect = lastDot.getBoundingClientRect()

                const top = firstRect.top - containerRect.top + 8
                const height = lastRect.top - firstRect.top

                gsap.set([baseLine, progressLine], {
                    top: top,
                    height: height
                })
            }
        }

        // Initial position set
        updateLinePosition()

        // Update on resize & scrolltrigger refresh to keep it perfectly responsive
        window.addEventListener('resize', updateLinePosition)
        ScrollTrigger.addEventListener("refreshInit", updateLinePosition)

        const ctx = gsap.context(() => {
            // Hero entrance animations
            gsap.fromTo('.hero-animate-title', 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 }
            )
            gsap.fromTo('.hero-animate-btn',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.6, delay: 0.5, ease: 'back.out(1.4)', stagger: 0.1 }
            )

            const container = document.querySelector('.timeline-container-anim')
            const firstDot = document.querySelector('.timeline-item-anim:first-child .timeline-dot')
            const lastDot = document.querySelector('.timeline-item-anim:last-child .timeline-dot')

            if (container && firstDot && lastDot) {
                // Dynamic Timeline Progress Line
                gsap.fromTo('.timeline-progress-line',
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: container,
                            start: () => {
                                const containerRect = container.getBoundingClientRect()
                                const firstRect = firstDot.getBoundingClientRect()
                                return `top+=${firstRect.top - containerRect.top + 8} 50%`
                            },
                            end: () => {
                                const containerRect = container.getBoundingClientRect()
                                const lastRect = lastDot.getBoundingClientRect()
                                return `top+=${lastRect.top - containerRect.top + 8} 50%`
                            },
                            scrub: 0.5
                        }
                    }
                )
            }

            // Timeline items activation scroll triggers
            const timelineItems = gsap.utils.toArray('.timeline-item-anim') as Element[]
            timelineItems.forEach((item) => {
                const dot = item.querySelector('.timeline-dot')
                const innerDot = item.querySelector('.timeline-inner-dot')
                const content = item.querySelector('.timeline-content')

                // Initial state via GSAP to prevent flash
                gsap.set(content, { opacity: 0.2, y: 20 })
                gsap.set(dot, { borderColor: 'rgba(63, 63, 70, 0.6)', scale: 1 })
                gsap.set(innerDot, { backgroundColor: 'rgba(63, 63, 70, 0.6)' })

                // Content Highlight
                gsap.to(content, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 50%',
                        end: 'bottom 50%',
                        toggleActions: 'play none none reverse'
                    }
                })

                // Outer Dot Highlight
                gsap.to(dot, {
                    borderColor: '#9dff00',
                    scale: 1.25,
                    boxShadow: '0 0 12px rgba(157, 255, 0, 0.4)',
                    duration: 0.3,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 50%',
                        end: 'bottom 50%',
                        toggleActions: 'play none none reverse'
                    }
                })

                // Inner Dot Highlight
                gsap.to(innerDot, {
                    backgroundColor: '#9dff00',
                    duration: 0.3,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 50%',
                        end: 'bottom 50%',
                        toggleActions: 'play none none reverse'
                    }
                })
            })

            // Selection Process scroll triggers
            gsap.fromTo('.selection-card-anim',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: '.selection-grid-anim',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            )

            // Registration & Selection Process scroll triggers
            gsap.fromTo('.process-card-anim',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: '.process-grid-anim',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            )

            // Highlights scroll triggers
            gsap.fromTo('.highlight-card-anim', 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.5, 
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: '.highlight-grid-anim',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            )
        })

        return () => {
            window.removeEventListener('resize', updateLinePosition)
            ScrollTrigger.removeEventListener("refreshInit", updateLinePosition)
            ctx.revert()
        }
    }, [])

    // Animate width changes between cards using GSAP, ensuring height is fixed at 100%
    useEffect(() => {
        if (REGISTRATIONS_CLOSED) return

        if (!isDesktop) {
            // Clear GSAP inline styles on mobile/tablet
            const targets = [step1Ref.current, step2Ref.current, step3Ref.current, step4Ref.current].filter(Boolean)
            if (targets.length > 0) {
                gsap.set(targets, { clearProps: 'all' })
            }
            return
        }

        const duration = isFirstRender.current ? 0 : 0.8
        const innerDuration = isFirstRender.current ? 0 : 0.5
        const innerDelay = isFirstRender.current ? 0 : 0.2

        const animateCard = (ref: React.RefObject<HTMLDivElement | null>, isActive: boolean, isPassed: boolean) => {
            if (!ref.current) return

            if (isActive) {
                // Expanded main card active state
                gsap.to(ref.current, {
                    width: '100%',
                    height: '100%',
                    alignSelf: 'stretch',
                    flex: '1 1 0%',
                    backgroundColor: '#18181b', // Dark zinc-900 card
                    color: '#f4f4f5', // Zinc-100 text
                    borderRadius: '32px',
                    borderColor: 'rgba(63, 63, 70, 0.4)', // Darker border
                    padding: '40px',
                    duration: duration,
                    ease: 'power4.out',
                    overwrite: 'auto'
                })
                // Fade in inner elements
                gsap.fromTo(ref.current.querySelectorAll('.fade-in-content'),
                    { opacity: isFirstRender.current ? 1 : 0, y: isFirstRender.current ? 0 : 15 },
                    { opacity: 1, y: 0, duration: innerDuration, stagger: isFirstRender.current ? 0 : 0.08, delay: innerDelay, ease: 'power3.out' }
                )
            } else {
                // Collapsed tab state (left or right)
                gsap.to(ref.current, {
                    width: '80px',
                    height: '100%',
                    alignSelf: 'stretch',
                    flex: '0 0 auto',
                    backgroundColor: isPassed ? '#27272a' : '#18181b', // Zinc-800 / Zinc-900
                    color: '#a1a1aa', // Zinc-400
                    borderRadius: '24px',
                    borderColor: 'rgba(63, 63, 70, 0.2)',
                    padding: '24px 12px',
                    duration: duration,
                    ease: 'power4.out',
                    overwrite: 'auto'
                })
            }
        }

        animateCard(step1Ref, activeStep === 1, activeStep > 1)
        animateCard(step2Ref, activeStep === 2, activeStep > 2)
        animateCard(step3Ref, activeStep === 3, activeStep > 3)
        animateCard(step4Ref, activeStep === 4, activeStep > 4)

        if (isFirstRender.current) {
            isFirstRender.current = false
        }
    }, [activeStep, isSubmitted, isDesktop, REGISTRATIONS_CLOSED])

    const validateStep1 = (): boolean => {
        const newErrors: FormErrors = {}
        if (!leaderName.trim()) newErrors.leaderName = 'Team Leader Name is required'

        if (!email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Enter a valid email address'
        }

        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required'
        } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Enter a valid 10-digit phone number'
        }

        if (!college.trim()) {
            newErrors.college = 'College/Institution is required'
        }

        if (!teamName.trim()) {
            newErrors.teamName = 'Team Name is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateStep2 = (): boolean => {
        const newErrors: FormErrors = {}

        if (teamSize > 1) {
            teamMembers.forEach((m, idx) => {
                if (!m.name || !m.name.trim()) {
                    newErrors[`teamMemberName_${idx}`] = `Member ${idx + 2} name is required`
                }
                if (!m.email || !m.email.trim()) {
                    newErrors[`teamMemberEmail_${idx}`] = `Member ${idx + 2} email is required`
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email)) {
                    newErrors[`teamMemberEmail_${idx}`] = `Member ${idx + 2} has an invalid email`
                }
            })
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateStep3 = (): boolean => {
        const newErrors: FormErrors = {}
        if (!domain) {
            newErrors.domain = 'Please select a domain track'
        }
        if (!idea.trim()) {
            newErrors.idea = 'Idea description is required'
        } else if (idea.trim().length < 150) {
            newErrors.idea = 'Please describe your idea in at least 150 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateStep4 = (): boolean => {
        const newErrors: FormErrors = {}
        if (!utrId.trim()) {
            newErrors.utrId = 'UTR ID is required'
        } else if (!/^[A-Za-z0-9]{10,35}$/.test(utrId.trim())) {
            newErrors.utrId = 'UTR / Transaction ID must be 10 to 35 alphanumeric characters'
        }

        if (!screenshot) {
            newErrors.screenshot = 'Payment receipt screenshot is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleStep1Continue = () => {
        if (validateStep1()) {
            setActiveStep(2)
        }
    }

    const handleStep2Continue = () => {
        if (validateStep2()) {
            setActiveStep(3)
        }
    }

    const handleStep3Continue = () => {
        if (validateStep3()) {
            setActiveStep(4)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setScreenshot(file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setScreenshotPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setScreenshotPreview(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setApiError(null)

        if (!validateStep4()) return

        // Request geolocation
        let lat: number | null = null
        let lng: number | null = null
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Geolocation is not supported by your browser.'))
                    return
                }
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000,
                })
            })
            lat = pos.coords.latitude
            lng = pos.coords.longitude
        } catch (geoErr: any) {
            const msg = geoErr.code === 1
                ? 'Location access denied. Please enable location permissions in your browser settings to register.'
                : geoErr.code === 2
                    ? 'Location unavailable. Please ensure GPS is enabled and try again.'
                    : geoErr.message || 'Unable to fetch location. Please try again.'
            setApiError(msg)
            return
        }

        setIsSubmitting(true)

        try {
            const submitData = new FormData()
            submitData.append('name', leaderName.trim())
            submitData.append('college', college)
            submitData.append('email', email)
            submitData.append('phone', phone)
            submitData.append('idea', idea)
            submitData.append('domain', domain)
            submitData.append('teamName', teamName)
            submitData.append('teamSize', String(teamSize))
            submitData.append('teamMembers', JSON.stringify(teamMembers))
            submitData.append('utrId', utrId)
            submitData.append('referredBy', referredBy)
            submitData.append('latitude', String(lat))
            submitData.append('longitude', String(lng))
            if (screenshot) {
                submitData.append('screenshot', screenshot)
            }

            const response = await fetch('/api/digital-india/submit', {
                method: 'POST',
                body: submitData,
            })

            const result = await response.json()

            if (response.ok && result.success) {
                // Store email in localStorage
                localStorage.setItem('c3_digital_india_registered_email', email.trim().toLowerCase())
                setMyReferralCode(result.referralCode || '')
                
                // Fetch stats and leaderboard
                await fetchDashboardStats(email)
                fetchLeaderboard()

                setIsSubmitted(true)
                // Celebrate with custom GSAP scale up on success content
                setTimeout(() => {
                    gsap.fromTo('.success-content',
                        { scale: 0.9, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
                    )
                }, 50)
            } else {
                setApiError(result.message || 'Submission failed. Please check details and try again.')
            }
        } catch (err) {
            console.error(err)
            setApiError('A network error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }


    const domains = [
        'Digital Governance & Public Services',
        'Agritech & Rural Development',
        'Fintech & Financial Inclusion',
        'Healthcare & Social Impact',
        'Sustainability & Climate Solutions',
        'Education & Skill Development',
        'Smart Cities & Infrastructure',
        'Open Innovation & Emerging Technologies'
    ]

    // Helper to render collapsed slim vertical text card exactly as drawn in mockup
    const renderCollapsedCard = (stepNumber: string, label: string, isCompleted: boolean) => {
        return (
            <div className="h-full flex flex-col justify-between items-center py-8 w-full font-sans select-none">
                {/* Horizontal Step Number at top */}
                <div className={`text-xs font-bold font-mono transition-colors duration-300 ${isCompleted ? 'text-[#9dff00]' : 'text-zinc-500'
                    }`}>
                    {stepNumber}
                </div>

                {/* Vertical Label characters at bottom (Tail facing West) */}
                <div className={`flex flex-col items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest font-mono mt-auto transition-colors duration-300 ${isCompleted ? 'text-[#9dff00]' : 'text-zinc-400'
                    }`}>
                    {label.split('').map((char, idx) => (
                        <span key={idx} className="leading-none">{char}</span>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div ref={pageRef} className="min-h-screen relative flex flex-col overflow-hidden bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-[#9dff00]/40">
            {/* Inject custom CSS styles for spotlights and custom animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                .spotlight-card {
                    position: relative;
                    overflow: hidden;
                }
                .spotlight-card::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(
                        350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
                        rgba(157, 255, 0, 0.06),
                        transparent 80%
                    );
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                    z-index: 2;
                }
                .spotlight-card:hover::before {
                    opacity: 1;
                }
                .spotlight-card > * {
                    position: relative;
                    z-index: 5;
                }
                .spotlight-card input, .spotlight-card button, .spotlight-card select, .spotlight-card textarea {
                    position: relative;
                    z-index: 10;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(24, 24, 27, 0.5);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(63, 63, 70, 0.8);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9dff00;
                }

                @keyframes spin-cw {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-ccw {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .spin-cw {
                    transform-origin: 250px 250px;
                    animation: spin-cw 35s linear infinite;
                }
                .spin-ccw {
                    transform-origin: 250px 250px;
                    animation: spin-ccw 25s linear infinite;
                }
                .spin-cw-fast {
                    transform-origin: 250px 250px;
                    animation: spin-cw 15s linear infinite;
                }

                @keyframes path-dash {
                    to {
                        stroke-dashoffset: -80;
                    }
                }
                .data-flow-path {
                    stroke-dasharray: 6, 20;
                    animation: path-dash 3s linear infinite;
                }
                
                @keyframes scan-radar {
                    0% { r: 12px; opacity: 0.8; }
                    100% { r: 40px; opacity: 0; }
                }
                .node-scan-pulse {
                    animation: scan-radar 2.5s ease-out infinite;
                }
                .text-shadow-neon {
                    text-shadow: 0 0 8px rgba(157, 255, 0, 0.8), 0 0 2px rgba(157, 255, 0, 0.4);
                }
            ` }} />

            {/* Background grids and spotlights */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#9dff00]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[80vh] right-1/4 w-[600px] h-[600px] bg-zinc-800/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-[#9dff00]/5 rounded-full blur-[120px] pointer-events-none" />

            {/* 1. Hero Section */}
            <section ref={heroRef} className="relative overflow-hidden z-10 w-full max-w-7xl mx-auto min-h-[95vh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 pt-36 pb-16 gap-12">
                <div className="flex-1 text-left max-w-3xl">
                    <h1 className="hero-animate-title text-5xl sm:text-7xl font-extralight text-white tracking-tight leading-[1.05] mb-6">
                        Digital <span className="font-normal text-[#9dff00] block sm:inline">INDIA.</span> <br className="hidden sm:inline" />
                        <span className="font-normal text-white">Hackathon.</span>
                    </h1>
                    <p className="hero-animate-title text-zinc-400 text-base sm:text-lg font-light leading-relaxed mb-8 max-w-2xl">
                        A national innovation challenge where participants develop technology-driven solutions to real-world problems faced by millions of Indians—from local shopkeepers and street vendors to rural communities and public services.
                    </p>
                    
                    <div className="hero-animate-title bg-zinc-900/35 border border-zinc-800/60 rounded-2xl p-4 mb-8 text-xs sm:text-sm font-light text-zinc-300 flex items-start gap-3 max-w-xl">
                        <span className="text-[#9dff00] font-bold text-lg leading-none">★</span>
                        <div>
                            <span className="text-white font-medium">Shortlisting Alert: </span>
                            The Top 100 most impactful problem statements will be shortlisted.
                        </div>
                    </div>

                    <div className="hero-animate-title flex flex-wrap gap-4 items-center">
                        {REGISTRATIONS_CLOSED ? (
                            <button
                                onClick={() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                className="hero-animate-btn border border-[#9dff00]/30 bg-[#9dff00]/5 text-[#9dff00] px-8 py-4 rounded-full font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
                            >
                                Registrations Closed <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                className="hero-animate-btn bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 px-8 py-4 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#9dff00]/10 hover:shadow-[#9dff00]/25 transition-all cursor-pointer"
                            >
                                Register Now <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
                            className="hero-animate-btn border border-zinc-800 hover:border-zinc-500 bg-zinc-900/40 text-white px-8 py-4 rounded-full font-medium text-sm transition-all cursor-pointer"
                        >
                            Explore Timeline
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="hero-animate-title grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-8 border-t border-zinc-800/40">
                        <div>
                            <div className="text-3xl font-light text-[#9dff00] font-mono">₹2.5L</div>
                            <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider mt-1">Prize Pool</div>
                        </div>
                        <div>
                            <div className="text-3xl font-light text-white font-mono">Top 100</div>
                            <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider mt-1">Shortlisted</div>
                        </div>
                        <div>
                            <div className="text-3xl font-light text-white font-mono">1–4</div>
                            <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider mt-1">Team Size</div>
                        </div>
                        <div>
                            <div className="text-3xl font-light text-[#9dff00] font-mono">24H</div>
                            <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider mt-1">Offline Build</div>
                        </div>
                    </div>
                </div>

                {/* Right Interactive Hero Illustration */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <div ref={svgWrapRef} className="relative w-full max-w-[460px] h-[460px] flex items-center justify-center select-none">
                        <div className="absolute w-[280px] h-[280px] bg-[#9dff00]/5 rounded-full blur-[100px] pointer-events-none" />
                        
                        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-[0_0_40px_rgba(157,255,0,0.08)]">
                            <defs>
                                <filter id="glow-neon" x="-30%" y="-30%" width="160%" height="160%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                <radialGradient id="reactor-core-grad" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#9dff00" stopOpacity="0.4" />
                                    <stop offset="40%" stopColor="#9dff00" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                                </radialGradient>
                                <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(157,255,0,0.4)" />
                                    <stop offset="100%" stopColor="rgba(63,63,70,0.1)" />
                                </linearGradient>
                            </defs>

                            {/* Background coordinate grid */}
                            <g opacity="0.15">
                                <line x1="250" y1="10" x2="250" y2="490" stroke="#9dff00" strokeWidth="0.5" strokeDasharray="3 3" />
                                <line x1="10" y1="250" x2="490" y2="250" stroke="#9dff00" strokeWidth="0.5" strokeDasharray="3 3" />
                                <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(63, 63, 70, 0.3)" strokeWidth="0.5" />
                                <circle cx="250" cy="250" r="180" fill="none" stroke="rgba(63, 63, 70, 0.3)" strokeWidth="0.5" />
                                <circle cx="250" cy="250" r="120" fill="none" stroke="rgba(63, 63, 70, 0.3)" strokeWidth="0.5" />
                            </g>

                            {/* 6 Circuit board traces branching from center to nodes */}
                            <g fill="none" stroke="url(#circuit-grad)" strokeWidth="1.5">
                                <path d="M 250,250 L 250,70" />
                                <path d="M 250,250 L 340,250 L 400,160" />
                                <path d="M 250,250 L 340,250 L 400,340" />
                                <path d="M 250,250 L 250,430" />
                                <path d="M 250,250 L 160,250 L 100,340" />
                                <path d="M 250,250 L 160,250 L 100,160" />
                            </g>

                            {/* Glowing Data Packets traveling along the traces */}
                            <g filter="url(#glow-neon)">
                                {/* AI Track */}
                                <circle r="3" fill="#9dff00">
                                    <animateMotion dur="2.2s" repeatCount="indefinite" path="M 250,250 L 250,70" begin="0s" />
                                </circle>
                                <circle r="2" fill="#9dff00" opacity="0.5">
                                    <animateMotion dur="2.2s" repeatCount="indefinite" path="M 250,250 L 250,70" begin="1.1s" />
                                </circle>

                                {/* CLOUD Track */}
                                <circle r="3" fill="#9dff00">
                                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M 250,250 L 340,250 L 400,160" begin="0.3s" />
                                </circle>
                                <circle r="2" fill="#9dff00" opacity="0.5">
                                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M 250,250 L 340,250 L 400,160" begin="1.7s" />
                                </circle>

                                {/* DATABASE Track */}
                                <circle r="3" fill="#9dff00">
                                    <animateMotion dur="2.6s" repeatCount="indefinite" path="M 250,250 L 340,250 L 400,340" begin="0.6s" />
                                </circle>
                                <circle r="2" fill="#9dff00" opacity="0.5">
                                    <animateMotion dur="2.6s" repeatCount="indefinite" path="M 250,250 L 340,250 L 400,340" begin="1.9s" />
                                </circle>

                                {/* AUTOMATION Track */}
                                <circle r="3" fill="#9dff00">
                                    <animateMotion dur="2.4s" repeatCount="indefinite" path="M 250,250 L 250,430" begin="0.2s" />
                                </circle>
                                <circle r="2" fill="#9dff00" opacity="0.5">
                                    <animateMotion dur="2.4s" repeatCount="indefinite" path="M 250,250 L 250,430" begin="1.4s" />
                                </circle>

                                {/* FOSS Track */}
                                <circle r="3" fill="#9dff00">
                                    <animateMotion dur="2.9s" repeatCount="indefinite" path="M 250,250 L 160,250 L 100,340" begin="0.5s" />
                                </circle>
                                <circle r="2" fill="#9dff00" opacity="0.5">
                                    <animateMotion dur="2.9s" repeatCount="indefinite" path="M 250,250 L 160,250 L 100,340" begin="1.92s" />
                                </circle>

                                {/* SECURITY Track */}
                                <circle r="3" fill="#9dff00">
                                    <animateMotion dur="2.7s" repeatCount="indefinite" path="M 250,250 L 160,250 L 100,160" begin="0.1s" />
                                </circle>
                                <circle r="2" fill="#9dff00" opacity="0.5">
                                    <animateMotion dur="2.7s" repeatCount="indefinite" path="M 250,250 L 160,250 L 100,160" begin="1.45s" />
                                </circle>
                            </g>

                            {/* Symmetrical holographic rotating rings */}
                            <g className="spin-cw">
                                <circle cx="250" cy="250" r="210" fill="none" stroke="rgba(157, 255, 0, 0.15)" strokeWidth="1" strokeDasharray="40 80" />
                                <circle cx="250" cy="250" r="150" fill="none" stroke="rgba(157, 255, 0, 0.1)" strokeWidth="1.5" strokeDasharray="120 180" />
                            </g>
                            <g className="spin-ccw">
                                <circle cx="250" cy="250" r="225" fill="none" stroke="rgba(157, 255, 0, 0.08)" strokeWidth="0.75" strokeDasharray="10 30" />
                                <circle cx="250" cy="250" r="170" fill="none" stroke="rgba(157, 255, 0, 0.2)" strokeWidth="1.25" strokeDasharray="8 8" />
                                <circle cx="250" cy="250" r="130" fill="none" stroke="rgba(157, 255, 0, 0.12)" strokeWidth="1" strokeDasharray="30 15 5 15" />
                            </g>
                            <g className="spin-cw-fast">
                                <circle cx="250" cy="250" r="90" fill="none" stroke="#9dff00" strokeWidth="1.5" strokeDasharray="50 150" filter="url(#glow-neon)" />
                            </g>

                            {/* Orbiting HUD tech bars or markers */}
                            <circle cx="250" cy="250" r="235" fill="none" stroke="rgba(63, 63, 70, 0.2)" strokeWidth="1" />
                            <path d="M 250,15 A 235,235 0 0,1 485,250" fill="none" stroke="#9dff00" strokeWidth="1.5" strokeDasharray="50 400" className="spin-cw" opacity="0.4" />
                            <path d="M 250,485 A 235,235 0 0,1 15,250" fill="none" stroke="#9dff00" strokeWidth="1.5" strokeDasharray="30 350" className="spin-ccw" opacity="0.4" />

                            {/* Symmetrical Hexagonal Nodes */}
                            {/* Node 1: AI */}
                            <g>
                                <circle cx="250" cy="70" r="18" fill="none" stroke="rgba(157, 255, 0, 0.2)" strokeWidth="1" />
                                <circle cx="250" cy="70" r="12" fill="#09090b" stroke="#9dff00" strokeWidth="1.5" filter="url(#glow-neon)" />
                                <circle cx="250" cy="70" r="4" fill="#9dff00" />
                            </g>

                            {/* Node 2: CLOUD */}
                            <g>
                                <circle cx="400" cy="160" r="18" fill="none" stroke="rgba(157, 255, 0, 0.2)" strokeWidth="1" />
                                <circle cx="400" cy="160" r="12" fill="#09090b" stroke="#9dff00" strokeWidth="1.5" filter="url(#glow-neon)" />
                                <circle cx="400" cy="160" r="4" fill="#9dff00" />
                            </g>

                            {/* Node 3: DATABASE */}
                            <g>
                                <circle cx="400" cy="340" r="18" fill="none" stroke="rgba(157, 255, 0, 0.2)" strokeWidth="1" />
                                <circle cx="400" cy="340" r="12" fill="#09090b" stroke="#9dff00" strokeWidth="1.5" filter="url(#glow-neon)" />
                                <circle cx="400" cy="340" r="4" fill="#9dff00" />
                            </g>

                            {/* Node 4: AUTOMATION */}
                            <g>
                                <circle cx="250" cy="430" r="18" fill="none" stroke="rgba(157, 255, 0, 0.2)" strokeWidth="1" />
                                <circle cx="250" cy="430" r="12" fill="#09090b" stroke="#9dff00" strokeWidth="1.5" filter="url(#glow-neon)" />
                                <circle cx="250" cy="430" r="4" fill="#9dff00" />
                            </g>

                            {/* Node 5: FOSS */}
                            <g>
                                <circle cx="100" cy="340" r="18" fill="none" stroke="rgba(157, 255, 0, 0.2)" strokeWidth="1" />
                                <circle cx="100" cy="340" r="12" fill="#09090b" stroke="#9dff00" strokeWidth="1.5" filter="url(#glow-neon)" />
                                <circle cx="100" cy="340" r="4" fill="#9dff00" />
                            </g>

                            {/* Node 6: SECURITY */}
                            <g>
                                <circle cx="100" cy="160" r="18" fill="none" stroke="rgba(157, 255, 0, 0.2)" strokeWidth="1" />
                                <circle cx="100" cy="160" r="12" fill="#09090b" stroke="#9dff00" strokeWidth="1.5" filter="url(#glow-neon)" />
                                <circle cx="100" cy="160" r="4" fill="#9dff00" />
                            </g>

                            {/* Core Nucleus Reactor */}
                            <g>
                                <circle cx="250" cy="250" r="70" fill="url(#reactor-core-grad)" />
                                <circle cx="250" cy="250" r="50" fill="none" stroke="rgba(157, 255, 0, 0.2)" strokeWidth="1" />
                                <circle cx="250" cy="250" r="38" fill="#09090b" stroke="#9dff00" strokeWidth="2" filter="url(#glow-neon)" />
                                <g className="spin-ccw">
                                    <circle cx="250" cy="250" r="30" fill="none" stroke="rgba(157, 255, 0, 0.3)" strokeWidth="1.5" strokeDasharray="15 15" />
                                    <path d="M 235,250 L 265,250 M 250,235 L 250,265" stroke="#9dff00" strokeWidth="1" />
                                </g>
                                <circle cx="250" cy="250" r="6" fill="#9dff00" filter="url(#glow-neon)" />
                            </g>
                        </svg>
                    </div>
                </div>
            </section>

            {/* 1.5 About Section */}
            <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-zinc-800/40">
                <div className="text-center mb-16">
                    <span className="text-xs font-mono text-[#9dff00] uppercase tracking-widest block mb-3">ABOUT THE HACKATHON</span>
                    <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
                        More than a <span className="text-[#9dff00] font-normal">Competition</span>, an <span className="text-white font-normal">Ecosystem.</span>
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed font-sans">
                        Digital India 2026 is designed to identify and support promising builds that solve localized problems at scale, fostering a continuous growth network.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {/* Bento Box Card 1: Large Main Mission */}
                    <div className="lg:col-span-2 bg-[#18181b]/60 border border-zinc-800/80 rounded-[32px] p-8 md:p-10 flex flex-col spotlight-card relative overflow-hidden group hover:border-[#9dff00]/25 transition-all duration-300">
                        
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <span className="text-[10px] font-mono text-[#9dff00] uppercase tracking-widest block mb-6">ORGANIZED BY C3 & SDC AT SNIST</span>
                                <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight leading-snug mb-6">
                                    Turn innovative ideas into <br />
                                    <span className="font-semibold text-[#9dff00]">impactful, real-world solutions</span>
                                </h3>
                                <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed font-sans mb-6">
                                    Join a 24-hour national offline hackathon organized by the <span className="text-white font-semibold">Cloud Community Club (C3)</span> and <span className="text-white font-semibold">Student Developers Community (SDC)</span> at <span className="text-white font-semibold">Sreenidhi Institute of Science & Technology (SNIST), Hyderabad</span>.
                                </p>
                                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed font-sans">
                                    We aim to build an ecosystem where promising tech proposals do not end with the hackathon. Deserving ideas receive resources, mentoring, and support to grow into deployable tools.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-zinc-800/50 flex flex-wrap gap-x-6 gap-y-3 items-center text-[11px] font-mono text-zinc-500">
                                <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#9dff00]" /> 10-11 JULY 2026</span>
                                <span className="hidden sm:inline text-zinc-700">•</span>
                                <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#9dff00]" /> SNIST, HYDERABAD</span>
                                <span className="hidden sm:inline text-zinc-700">•</span>
                                <span className="flex items-center gap-2"><Trophy className="w-3.5 h-3.5 text-[#9dff00]" /> ₹2,50,000 PRIZE POOL</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Box Card 2: Beyond the Top 3 */}
                    <div className="bg-[#18181b]/35 border border-zinc-800/80 rounded-[32px] p-8 flex flex-col spotlight-card hover:border-[#9dff00]/25 hover:bg-zinc-900/10 transition-all duration-300 group">
                        <div>
                            <div className="w-10 h-10 rounded-2xl bg-[#9dff00]/10 border border-[#9dff00]/20 flex items-center justify-center mb-8 transition-colors group-hover:bg-[#9dff00]/20">
                                <Award className="w-5 h-5 text-[#9dff00]" />
                            </div>
                            <h4 className="text-lg font-medium text-white mb-3">Beyond the Top 3</h4>
                            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed font-sans">
                                Recognition is not limited to the top three winners. Multiple teams receive awards and opportunities based on the quality, innovation, technical execution, and impact of their solutions.
                            </p>
                            <div className="mt-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Performance-based awards</div>
                        </div>
                    </div>

                    {/* Bento Box Card 3: Idea to Product */}
                    <div className="bg-[#18181b]/35 border border-zinc-800/80 rounded-[32px] p-8 flex flex-col spotlight-card hover:border-[#9dff00]/25 hover:bg-zinc-900/10 transition-all duration-300 group">
                        <div>
                            <div className="w-10 h-10 rounded-2xl bg-[#9dff00]/10 border border-[#9dff00]/20 flex items-center justify-center mb-8 transition-colors group-hover:bg-[#9dff00]/20">
                                <Code className="w-5 h-5 text-[#9dff00]" />
                            </div>
                            <h4 className="text-lg font-medium text-white mb-3">Idea to Product</h4>
                            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed font-sans">
                                Our objective is to ensure that promising ideas do not end with the hackathon. Selected projects will continue to receive support to evolve into real-world products and deployable solutions.
                            </p>
                            <div className="mt-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active post-event incubation</div>
                        </div>
                    </div>

                    {/* Bento Box Card 4: Post-Hackathon Mentorship */}
                    <div className="bg-[#18181b]/35 border border-zinc-800/80 rounded-[32px] p-8 flex flex-col spotlight-card hover:border-[#9dff00]/25 hover:bg-zinc-900/10 transition-all duration-300 group">
                        <div>
                            <div className="w-10 h-10 rounded-2xl bg-[#9dff00]/10 border border-[#9dff00]/20 flex items-center justify-center mb-8 transition-colors group-hover:bg-[#9dff00]/20">
                                <Brain className="w-5 h-5 text-[#9dff00]" />
                            </div>
                            <h4 className="text-lg font-medium text-white mb-3">Post-Hackathon Mentorship</h4>
                            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed font-sans">
                                High-potential teams will be connected with industry experts, mentors, and the Cloud Community Club (C3) ecosystem for continued guidance and product development.
                            </p>
                            <div className="mt-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">C3 Community support</div>
                        </div>
                    </div>

                    {/* Bento Box Card 5: Opportunities for Every Team */}
                    <div className="bg-[#18181b]/35 border border-zinc-800/80 rounded-[32px] p-8 flex flex-col spotlight-card hover:border-[#9dff00]/25 hover:bg-zinc-900/10 transition-all duration-300 group">
                        <div>
                            <div className="w-10 h-10 rounded-2xl bg-[#9dff00]/10 border border-[#9dff00]/20 flex items-center justify-center mb-8 transition-colors group-hover:bg-[#9dff00]/20">
                                <Trophy className="w-5 h-5 text-[#9dff00]" />
                            </div>
                            <h4 className="text-lg font-medium text-white mb-3">Opportunities for All</h4>
                            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed font-sans">
                                Apart from the ₹2,50,000 prize pool, participants will have opportunities for internships, mentorship, networking, certificates, special recognitions, and ecosystem support.
                            </p>
                            <div className="mt-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Prize Pool & Internships</div>
                        </div>
                    </div>

                    {/* Bento Box Card 6: Long-Term Impact (Full width bottom layout) */}
                    <div className="lg:col-span-3 bg-[#18181b]/60 border border-zinc-800/80 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 spotlight-card hover:border-[#9dff00]/25 transition-all duration-300 group relative overflow-hidden">
                        
                        <div className="flex-1 max-w-2xl">
                            <div className="w-10 h-10 rounded-2xl bg-[#9dff00]/10 border border-[#9dff00]/20 flex items-center justify-center mb-6 transition-colors group-hover:bg-[#9dff00]/20">
                                <Sparkles className="w-5 h-5 text-[#9dff00]" />
                            </div>
                            <h4 className="text-xl font-medium text-white mb-3">Long-Term Impact</h4>
                            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed font-sans">
                                We aim to create an ecosystem where innovative solutions continue to grow even after the event, contributing directly to India's digital transformation.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                            <div className="px-5 py-3 rounded-2xl bg-zinc-950/50 border border-zinc-900 text-center font-mono">
                                <div className="text-xs text-zinc-500">PRIZE POOL</div>
                                <div className="text-lg font-bold text-white">₹2,50,000</div>
                            </div>
                            <div className="px-5 py-3 rounded-2xl bg-zinc-950/50 border border-zinc-900 text-center font-mono">
                                <div className="text-xs text-zinc-500">BUILD TRACKS</div>
                                <div className="text-lg font-bold text-[#9dff00]">6 Domains</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Selection Process Section */}
            <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 border-t border-zinc-800/40">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
                        Selection <span className="text-[#9dff00] font-normal">Workflow</span>
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
                        A rigorous screening process designed to filter the most impactful ideas and bring the top minds to SNIST.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 selection-grid-anim">
                    {/* Step 1 */}
                    <div className="selection-card-anim spotlight-card border border-zinc-800 bg-zinc-900/10 hover:border-[#9dff00]/25 rounded-3xl p-6 transition-all duration-300">
                        <div className="text-2xl font-bold font-mono text-[#9dff00] mb-4">01.</div>
                        <h4 className="text-lg font-medium text-white mb-2">Submit Proposal</h4>
                        <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                            Form a team of 1–4 members, select a domain track, and submit your abstract detailing the solution before 5 July.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="selection-card-anim spotlight-card border border-zinc-800 bg-zinc-900/10 hover:border-[#9dff00]/25 rounded-3xl p-6 transition-all duration-300">
                        <div className="text-2xl font-bold font-mono text-white mb-4">02.</div>
                        <h4 className="text-lg font-medium text-white mb-2">Top 100 Shortlist</h4>
                        <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                            Our evaluation panel will shortlist the Top 100 most impactful, original problem statements based on localization and feasibility.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="selection-card-anim spotlight-card border border-zinc-800 bg-zinc-900/10 hover:border-[#9dff00]/25 rounded-3xl p-6 transition-all duration-300">
                        <div className="text-2xl font-bold font-mono text-white mb-4">03.</div>
                        <h4 className="text-lg font-medium text-white mb-2">Attend Workshop</h4>
                        <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                            Invited teams will attend a physical hands-on development workshop at SNIST campus on 9 July to refine products.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="selection-card-anim spotlight-card border border-[#9dff00]/20 bg-zinc-900/20 hover:border-[#9dff00]/45 rounded-3xl p-6 transition-all duration-300 shadow-[0_0_20px_rgba(157,255,0,0.02)]">
                        <div className="text-2xl font-bold font-mono text-[#9dff00] mb-4">04.</div>
                        <h4 className="text-lg font-medium text-white mb-2">Build & Compete</h4>
                        <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                            Develop your idea into a working software application during the 24-hour build sprint on 10–11 July and present to judges.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2.5 Registration & Selection Process Section */}
            <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 border-t border-zinc-800/40">
                <div className="text-center mb-16">
                    <span className="text-xs font-mono text-[#9dff00] uppercase tracking-widest block mb-3">STAGES & FEES</span>
                    <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
                        Registration & <span className="text-[#9dff00] font-normal">Selection Process</span>
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
                        The Digital India Hackathon 2026 consists of two stages designed to discover and scale impactful tech solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch process-grid-anim">
                    {/* Stage 1 Card */}
                    <div className="process-card-anim spotlight-card border border-zinc-800 bg-[#18181b]/35 hover:border-[#9dff00]/25 rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-mono text-[#9dff00] uppercase tracking-wider">STAGE 1</span>
                                <div className="px-3 py-1 rounded-full bg-[#9dff00]/10 border border-[#9dff00]/20 text-[#9dff00] text-[10px] font-mono font-bold">ONLINE</div>
                            </div>
                            <h3 className="text-2xl font-light text-white mb-4">Online Ideathon</h3>
                            <ul className="space-y-4 text-zinc-400 text-sm font-light">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#9dff00] mt-1.5">•</span>
                                    <span>Registration Fee: <strong className="text-white">₹99 per team submission</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#9dff00] mt-1.5">•</span>
                                    <span>Teams submit their idea through the online portal before the submission deadline.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#9dff00] mt-1.5">•</span>
                                    <span>All submissions will be evaluated by the judging panel.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-8 pt-6 border-t border-zinc-800/40 text-[11px] font-mono text-zinc-500">
                            Evaluated on feasibility and localization
                        </div>
                    </div>

                    {/* Stage 2 Card */}
                    <div className="process-card-anim spotlight-card border border-zinc-800 bg-[#18181b]/35 hover:border-[#9dff00]/25 rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-mono text-[#9dff00] uppercase tracking-wider">STAGE 2</span>
                                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">OFFLINE</div>
                            </div>
                            <h3 className="text-2xl font-light text-white mb-4">Offline Hackathon</h3>
                            <ul className="space-y-4 text-zinc-400 text-sm font-light">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-400 mt-1.5">•</span>
                                    <span>Participation Fee: <strong className="text-white">₹300 per participant</strong> (only for shortlisted teams).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-400 mt-1.5">•</span>
                                    <span>Duration: <strong className="text-white">2 Days</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-400 mt-1.5">•</span>
                                    <span>Venue: <strong className="text-white">Sreenidhi Institute of Science and Technology (SNIST), Hyderabad</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-400 mt-1.5">•</span>
                                    <span>Shortlisted participants must complete the payment to confirm participation.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-8 pt-6 border-t border-zinc-800/40 text-[11px] font-mono text-zinc-500">
                            Includes meals, venue access & mentorship
                        </div>
                    </div>

                    {/* Shortlisting & Fee Summary Card */}
                    <div className="process-card-anim spotlight-card border border-[#9dff00]/20 bg-gradient-to-b from-[#18181b] to-[#09090b] hover:border-[#9dff00]/40 rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 group shadow-[0_0_30px_rgba(157,255,0,0.02)]">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-mono text-[#9dff00] uppercase tracking-wider">SUMMARY</span>
                                <Award className="w-5 h-5 text-[#9dff00]" />
                            </div>
                            <h3 className="text-2xl font-light text-white mb-4">Shortlisting & Fees</h3>
                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-900">
                                    <div className="text-xs text-[#9dff00] font-mono uppercase tracking-wider mb-1">Shortlisting Criterion</div>
                                    <p className="text-zinc-300 text-xs font-light leading-relaxed">
                                        <strong>Top 100 teams</strong> will be shortlisted to participate in the offline hackathon at <strong>Sreenidhi Institute of Science and Technology (SNIST)</strong>. Shortlisted teams will be notified via email.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Fee Breakdown</div>
                                    <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-2">
                                        <span className="text-zinc-400">Online Ideathon (per team)</span>
                                        <span className="text-white font-mono font-bold">₹99</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs pt-1">
                                        <span className="text-zinc-400">Offline Hackathon (per participant)</span>
                                        <span className="text-white font-mono font-bold">₹300</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full-width Referral Benefit Horizontal Card */}
                <div className="process-card-anim spotlight-card border border-[#9dff00]/25 bg-gradient-to-r from-[#18181b] to-[#09090b] hover:border-[#9dff00]/45 rounded-[32px] p-8 md:p-10 shadow-[0_0_30px_rgba(157,255,0,0.03)] relative overflow-hidden mt-8 text-left">
                   
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex-1 max-w-3xl text-left">
                            <div className="flex items-center justify-start gap-2 mb-4">
                                <Gift className="w-5 h-5 text-[#9dff00]" />
                                <span className="text-xs font-mono text-[#9dff00] uppercase tracking-widest">REFERRAL PROGRAM</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-light text-white mb-3">
                                Refer & Get <span className="text-[#9dff00] font-normal">Free Hackathon Passes</span>
                            </h3>
                            <p className="text-zinc-400 text-sm font-light leading-relaxed font-sans">
                                Share your unique referral code (generated upon registration) with other innovators. Teams that secure <strong className="text-white">10 successful referrals</strong> will receive <strong className="text-[#9dff00]">FREE passes</strong> (the offline participation fee will be waived entirely for the whole team).
                            </p>
                        </div>
                        <div className="flex items-center gap-4 self-start md:self-center shrink-0">
                            <div className="px-5 py-3 rounded-2xl bg-zinc-950/50 border border-zinc-900 text-center font-mono">
                                <div className="text-xs text-zinc-500">REFERRALS NEEDED</div>
                                <div className="text-lg font-bold text-white">10 Teams</div>
                            </div>
                            <div className="px-5 py-3 rounded-2xl bg-[#9dff00]/10 border border-[#9dff00]/20 text-center font-mono">
                                <div className="text-xs text-[#9dff00]">REWARD</div>
                                <div className="text-lg font-bold text-[#9dff00]">Free Pass</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Timeline Section */}
            <section id="details" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 border-t border-zinc-800/40">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
                        Event <span className="text-[#9dff00] font-normal">Timeline</span>
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
                        Track the major program milestones. Shortlisted teams will transition from online submissions to on-campus development.
                    </p>
                </div>

                <div className="relative timeline-container-anim max-w-4xl mx-auto">
                    {/* Vertical connecting line */}
                    <div className="absolute left-4 md:left-1/2 w-[1px] bg-zinc-800 timeline-base-line" />
                    <div className="absolute left-4 md:left-1/2 w-[1px] bg-[#9dff00] origin-top scale-y-0 timeline-progress-line shadow-[0_0_10px_#9dff00]" style={{ transformOrigin: 'top' }} />

                    <div className="space-y-12">
                        {/* Timeline Item 1 */}
                        <div className="timeline-item-anim relative flex flex-col md:flex-row items-start md:justify-between group">
                            <div className="timeline-dot absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 transition-colors z-20 flex items-center justify-center">
                                <div className="timeline-inner-dot w-1.5 h-1.5 rounded-full bg-zinc-800 transition-colors" />
                            </div>
                            <div className="timeline-content pl-12 md:pl-0 md:w-[45%] text-left md:text-right">
                                <div className="text-xs font-mono text-[#9dff00] mb-2 uppercase tracking-wider">UNTIL 5 JULY</div>
                                <h3 className="text-xl font-medium text-white mb-2">Idea Abstract Submission</h3>
                                <p className="text-zinc-400 text-sm font-light leading-relaxed">
                                    Pitch your innovative idea abstract and choose your domain track. Valid submissions are awarded a certificate and evaluated for the final event.
                                </p>
                            </div>
                            <div className="hidden md:block w-[10%]" />
                            <div className="hidden md:block w-[45%]" />
                        </div>

                        {/* Timeline Item 2 */}
                        <div className="timeline-item-anim relative flex flex-col md:flex-row items-start md:justify-between group">
                            <div className="timeline-dot absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 transition-colors z-20 flex items-center justify-center">
                                <div className="timeline-inner-dot w-1.5 h-1.5 rounded-full bg-zinc-800 transition-colors" />
                            </div>
                            <div className="hidden md:block w-[45%]" />
                            <div className="hidden md:block w-[10%]" />
                            <div className="timeline-content pl-12 md:pl-0 md:w-[45%] text-left">
                                <div className="text-xs font-mono text-[#9dff00] mb-2 uppercase tracking-wider">9 JULY</div>
                                <h3 className="text-xl font-medium text-white mb-2">Development Workshop</h3>
                                <p className="text-zinc-400 text-sm font-light leading-relaxed mb-3">
                                    A hands-on physical workshop designed to prepare teams. We cover cloud APIs, FOSS implementation, smart automation integrations, and rapid deployment frameworks.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {['AI Tools', 'Cloud Systems', 'FOSS Integration', 'Automation'].map(t => (
                                        <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/60 text-zinc-400">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Timeline Item 3 */}
                        <div className="timeline-item-anim relative flex flex-col md:flex-row items-start md:justify-between group">
                            <div className="timeline-dot absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 transition-colors z-20 flex items-center justify-center">
                                <div className="timeline-inner-dot w-1.5 h-1.5 rounded-full bg-zinc-800 transition-colors" />
                            </div>
                            <div className="timeline-content pl-12 md:pl-0 md:w-[45%] text-left md:text-right">
                                <div className="text-xs font-mono text-[#9dff00] mb-2 uppercase tracking-wider">10–11 JULY</div>
                                <h3 className="text-xl font-medium text-white mb-2">24-Hour Offline Hackathon</h3>
                                <p className="text-zinc-400 text-sm font-light leading-relaxed">
                                    Sprint physically at SNIST to transform your proposal into a fully working software solution. Collaborate with on-site mentors and industry evaluators.
                                </p>
                            </div>
                            <div className="hidden md:block w-[10%]" />
                            <div className="hidden md:block w-[45%]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Prize Pool & Highlights Section */}
            <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 border-t border-zinc-800/40">
                <div className="text-center mb-16">
                    <span className="text-xs font-mono text-[#9dff00] uppercase tracking-widest block mb-3">EXCITING REWARDS</span>
                    <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
                        Prizes & <span className="text-[#9dff00] font-normal">Incentives</span>
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed font-sans">
                        Compete for a grand prize pool, secure valuable internship opportunities, and receive guidance from industry mentors.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch highlight-grid-anim">
                    {/* Grand Prize Card */}
                    <div className="highlight-card-anim spotlight-card lg:col-span-1 border border-[#9dff00]/25 bg-gradient-to-b from-[#18181b] to-[#0d0d0e] rounded-3xl p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(157,255,0,0.03)] relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#9dff00]/10 rounded-full blur-2xl pointer-events-none" />
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#9dff00]/10 border border-[#9dff00]/20 flex items-center justify-center mb-8">
                                <Trophy className="w-6 h-6 text-[#9dff00]" />
                            </div>
                            <span className="text-xs font-mono text-[#9dff00] uppercase tracking-widest block mb-1">CASH PRIZES & MORE</span>
                            <h3 className="text-4xl font-light text-white tracking-tight leading-tight mb-4">
                                ₹2.5 Lakhs <br />
                                <span className="font-semibold text-[#9dff00]">Prize Pool</span>
                            </h3>
                            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                                Exciting cash rewards, exclusive internships, custom swag packages, and recognition certificates await top-performing teams.
                            </p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-zinc-800/60 text-left">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">INCENTIVES</span>
                            <div className="text-white text-xs font-mono font-bold uppercase tracking-wider">Winner categories revealed soon</div>
                        </div>
                    </div>

                    {/* Highlights Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Certificates */}
                        <div className="highlight-card-anim spotlight-card border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 rounded-3xl p-6 flex flex-col justify-between transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800/40 border border-zinc-800 flex items-center justify-center group-hover:border-[#9dff00]/30 transition-all">
                                    <Award className="w-5 h-5 text-zinc-300 group-hover:text-[#9dff00] transition-colors" />
                                </div>
                            </div>
                            <div className="mt-8">
                                <h4 className="text-lg font-normal text-white mb-2">Participation Certificates</h4>
                                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                                    Every participant who submits a valid idea abstract and completes the verification will receive an official Participation Certificate.
                                </p>
                            </div>
                        </div>

                        {/* Internships */}
                        <div className="highlight-card-anim spotlight-card border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 rounded-3xl p-6 flex flex-col justify-between transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800/40 border border-zinc-800 flex items-center justify-center group-hover:border-[#9dff00]/30 transition-all">
                                    <Brain className="w-5 h-5 text-zinc-300 group-hover:text-[#9dff00] transition-colors" />
                                </div>
                            </div>
                            <div className="mt-8">
                                <h4 className="text-lg font-normal text-white mb-2">Internship Placements</h4>
                                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                                    Top-performing participants will be considered for direct internship opportunities with partner organizations and growing startups.
                                </p>
                            </div>
                        </div>

                        {/* Experts */}
                        <div className="highlight-card-anim spotlight-card border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 rounded-3xl p-6 flex flex-col justify-between transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800/40 border border-zinc-800 flex items-center justify-center group-hover:border-[#9dff00]/30 transition-all">
                                    <Code className="w-5 h-5 text-zinc-300 group-hover:text-[#9dff00] transition-colors" />
                                </div>
                            </div>
                            <div className="mt-8">
                                <h4 className="text-lg font-normal text-white mb-2">Industry Expert Mentoring</h4>
                                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                                    Gain hands-on mentoring from industry leaders specializing in AI orchestration, cloud computing, and product design.
                                </p>
                            </div>
                        </div>

                        {/* Recruiters */}
                        <div className="highlight-card-anim spotlight-card border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 rounded-3xl p-6 flex flex-col justify-between transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800/40 border border-zinc-800 flex items-center justify-center group-hover:border-[#9dff00]/30 transition-all">
                                    <Users2 className="w-5 h-5 text-zinc-300 group-hover:text-[#9dff00] transition-colors" />
                                </div>
                            </div>
                            <div className="mt-8">
                                <h4 className="text-lg font-normal text-white mb-2">Exposure to Recruiters</h4>
                                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                                    Present your builds directly to hiring managers, founders, and community leads seeking technical talent.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Why Participate Section */}
            <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 border-t border-zinc-800/40 bg-black/10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
                        Why <span className="text-[#9dff00] font-normal">Participate?</span>
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
                        Form a team, build actual working solutions, and unlock exclusive rewards.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 highlight-grid-anim">
                    <div className="highlight-card-anim spotlight-card border border-zinc-800/80 bg-zinc-900/5 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-300">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                            <Sparkles className="w-4 h-4 text-[#9dff00]" />
                        </div>
                        <h4 className="text-base font-medium text-white mb-2">Solve Real Problems</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                            Develop localized products designed to optimize resource allocation for micro-businesses and public administrations.
                        </p>
                    </div>

                    <div className="highlight-card-anim spotlight-card border border-zinc-800/80 bg-zinc-900/5 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-300">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                            <Code className="w-4 h-4 text-[#9dff00]" />
                        </div>
                        <h4 className="text-base font-medium text-white mb-2">Rapid Prototyping</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                            Learn the disciplines of rapid MVP creation, API mockups, and deployment pipelines during a 24-hour build sprint.
                        </p>
                    </div>

                    <div className="highlight-card-anim spotlight-card border border-zinc-800/80 bg-zinc-900/5 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-300">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                            <Users2 className="w-4 h-4 text-[#9dff00]" />
                        </div>
                        <h4 className="text-base font-medium text-white mb-2">Collaborative Network</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                            Connect with fellow developers, UI designers, and startup innovators from multiple institutions across India.
                        </p>
                    </div>

                    <div className="highlight-card-anim spotlight-card border border-zinc-800/80 bg-zinc-900/5 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-300">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                            <Gift className="w-4 h-4 text-[#9dff00]" />
                        </div>
                        <h4 className="text-base font-medium text-white mb-2">Exclusive Swag</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                            Acquire branded T-shirts, premium developer sticker packs, and limited edition community merchandise.
                        </p>
                    </div>
                </div>
            </section>



            {/* 6. Registration Form Section */}
            <section ref={formSectionRef} id="register" className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-28 border-t border-zinc-800/40">
                {REGISTRATIONS_CLOSED ? (
                    <div className="flex flex-col items-center">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
                                Registration <span className="text-[#9dff00] font-normal">Closed</span>
                            </h2>
                        </div>

                        <div className="flex w-full items-center justify-center max-w-4xl mx-auto">
                            <div className="w-full bg-[#18181b]/30 border border-zinc-800/60 rounded-[32px] p-8 md:p-12 text-center backdrop-blur-xl relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#9dff00]/40 to-transparent rounded-t-[32px]" />
                                <div className="w-16 h-16 rounded-2xl bg-[#9dff00]/10 border border-[#9dff00]/30 flex items-center justify-center mx-auto mb-6">
                                    <Medal size={32} className="text-[#9dff00] animate-pulse" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Registrations are now closed</h3>
                                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-6 font-sans">
                                    Thank you for the overwhelming response! The registration phase for the Digital India Hackathon has officially concluded.
                                </p>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-mono">
                                    <span>Shortlist results will be announced soon.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
                                Secure Your <span className="text-[#9dff00] font-normal">Team Slot</span>
                            </h2>
                            <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
                                Submit your details, select your domain track, describe your idea proposal, and complete payment verification.
                            </p>
                        </div>

                {/* Horizontal Top Stepper for Mobile/Tablet */}
                <div className="lg:hidden w-full max-w-[1440px] mb-6 px-2 font-mono text-[10px] uppercase tracking-widest flex items-center justify-between">
                    {[
                        { num: '01.', label: 'PROFILE' },
                        { num: '02.', label: 'MEMBERS' },
                        { num: '03.', label: 'SOLUTION' },
                        { num: '04.', label: 'PAYMENT' }
                    ].map((s, idx) => {
                        const stepNum = idx + 1;
                        const isActive = activeStep === stepNum;
                        const isCompleted = activeStep > stepNum;
                        return (
                            <div
                                key={s.num}
                                onClick={() => activeStep > stepNum && setActiveStep(stepNum as 1 | 2 | 3 | 4)}
                                className={`flex flex-col items-center gap-1.5 flex-1 relative ${activeStep > stepNum ? 'cursor-pointer' : ''
                                    }`}
                            >
                                {/* Connecting line between steps */}
                                {idx > 0 && (
                                    <div className={`absolute right-[50%] top-3 -translate-y-1/2 w-full h-[1px] -z-10 transition-colors duration-300 ${activeStep >= stepNum ? 'bg-[#9dff00]/50' : 'bg-zinc-800/60'
                                        }`} />
                                )}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-[9px] transition-all duration-300 ${isActive
                                        ? 'bg-[#9dff00] border-[#9dff00] text-zinc-950 shadow-[0_0_10px_rgba(157,255,0,0.3)]'
                                        : isCompleted
                                            ? 'bg-zinc-800 border-[#9dff00] text-[#9dff00]'
                                            : 'bg-zinc-900 border-zinc-800/60 text-zinc-500'
                                    }`}>
                                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : stepNum}
                                </div>
                                <span className={`text-[8px] sm:text-[9px] font-sans font-bold tracking-wider transition-colors duration-300 ${isActive ? 'text-[#9dff00]' : isCompleted ? 'text-zinc-300' : 'text-zinc-500'
                                    }`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="flex w-full flex-col lg:flex-row items-stretch justify-center gap-6 max-w-[1440px] h-auto lg:h-[600px] relative">
                    <div ref={containerRef} className="flex-1 flex flex-col lg:flex-row gap-4 w-full h-auto lg:h-full items-stretch select-none">
                        {/* Step 1 Card: PROFILE */}
                        <div
                            key="step-1"
                            ref={step1Ref}
                            onClick={() => activeStep > 1 && setActiveStep(1)}
                            className={`relative border border-zinc-800/40 ${isTeamSizeOpen ? 'overflow-visible' : 'overflow-hidden'} flex-col justify-between h-auto lg:h-full w-full lg:w-auto bg-[#18181b] text-[#f4f4f5] rounded-[32px] p-6 sm:p-8 lg:p-10 ${activeStep === 1 ? 'flex' : 'hidden lg:flex'
                                } ${activeStep > 1 ? 'cursor-pointer' : ''
                                }`}
                        >
                            {activeStep > 1 ? (
                                /* Collapsed Slim View */
                                renderCollapsedCard('01.', 'PROFILE', activeStep > 1)
                            ) : (
                                /* Expanded View */
                                <div className="fade-in-content flex flex-col justify-between h-full w-full">
                                    <div className="flex-1 flex flex-col min-h-0">
                                        <div className="text-xs font-bold text-zinc-500 font-mono mb-4">01.</div>
                                        <h2 className="text-3xl font-light text-[#9dff00] mb-6 tracking-tight font-sans">Add your personal information.</h2>

                                        <div className="flex-1 overflow-visible pr-2 space-y-6 lg:space-y-8 mb-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={leaderName}
                                                        onChange={(e) => {
                                                            setLeaderName(e.target.value)
                                                            if (errors.leaderName) setErrors(prev => ({ ...prev, leaderName: undefined }))
                                                        }}
                                                        placeholder="Team Leader Name"
                                                        className={`w-full text-xl sm:text-2xl font-light py-2.5 border-b ${errors.leaderName ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                            } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                    />
                                                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">Team Leader Name</span>
                                                    {errors.leaderName && <p className="text-red-400 text-xs mt-1 font-mono">{errors.leaderName}</p>}
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={teamName}
                                                        onChange={(e) => {
                                                            setTeamName(e.target.value)
                                                            if (errors.teamName) setErrors(prev => ({ ...prev, teamName: undefined }))
                                                        }}
                                                        placeholder="Team Name"
                                                        className={`w-full text-xl sm:text-2xl font-light py-2.5 border-b ${errors.teamName ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                            } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                    />
                                                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">Team Name</span>
                                                    {errors.teamName && <p className="text-red-400 text-xs mt-1 font-mono">{errors.teamName}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                                <div>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => {
                                                            setEmail(e.target.value)
                                                            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                                                        }}
                                                        placeholder="Email"
                                                        className={`w-full text-xl sm:text-2xl font-light py-2.5 border-b ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                            } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                    />
                                                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">Email Address</span>
                                                    {errors.email && <p className="text-red-400 text-xs mt-1 font-mono">{errors.email}</p>}
                                                </div>
                                                <div>
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => {
                                                            setPhone(e.target.value)
                                                            if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }))
                                                        }}
                                                        placeholder="00000 0000"
                                                        className={`w-full text-xl sm:text-2xl font-light py-2.5 border-b ${errors.phone ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                            } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                    />
                                                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">Phone Number</span>
                                                    {errors.phone && <p className="text-red-400 text-xs mt-1 font-mono">{errors.phone}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={college}
                                                        onChange={(e) => {
                                                            setCollege(e.target.value)
                                                            if (errors.college) setErrors(prev => ({ ...prev, college: undefined }))
                                                        }}
                                                        placeholder="College / Institution"
                                                        className={`w-full text-xl sm:text-2xl font-light py-2.5 border-b ${errors.college ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                            } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                    />
                                                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">College Name</span>
                                                    {errors.college && <p className="text-red-400 text-xs mt-1 font-mono">{errors.college}</p>}
                                                </div>
                                                <div className="relative" ref={teamSizeDropdownRef}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsTeamSizeOpen(!isTeamSizeOpen)}
                                                        className="w-full text-xl sm:text-2xl font-light py-2.5 border-b border-zinc-800 hover:border-zinc-600 focus:border-zinc-400 outline-none bg-transparent text-white transition-all cursor-pointer flex justify-between items-center text-left"
                                                    >
                                                        <span>{teamSize === 1 ? '1 Member' : `${teamSize} Members`}</span>
                                                        <svg
                                                            className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isTeamSizeOpen ? 'rotate-180 text-white' : ''}`}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">Team Size</span>
                                                    {isTeamSizeOpen && (
                                                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl z-[100] overflow-hidden team-size-dropdown">
                                                            {[1, 2, 3, 4].map((size) => (
                                                                <button
                                                                    key={size}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setTeamSize(size)
                                                                        setTeamMembers((prev) => {
                                                                            const newMembers = [...prev]
                                                                            const targetLen = size - 1
                                                                            if (newMembers.length < targetLen) {
                                                                                while (newMembers.length < targetLen) {
                                                                                    newMembers.push({ name: '', email: '' })
                                                                                }
                                                                            } else if (newMembers.length > targetLen) {
                                                                                newMembers.splice(targetLen)
                                                                            }
                                                                            return newMembers
                                                                        })
                                                                        setIsTeamSizeOpen(false)
                                                                    }}
                                                                    className={`w-full text-left px-5 py-3.5 text-base sm:text-lg font-light transition-all flex items-center justify-between ${
                                                                        teamSize === size
                                                                            ? 'bg-zinc-800/60 text-[#9dff00] font-medium border-l-2 border-[#9dff00]'
                                                                            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                                                    }`}
                                                                >
                                                                    <span>{size === 1 ? '1 Member' : `${size} Members`}</span>
                                                                    {teamSize === size && <Check className="w-4 h-4 text-[#9dff00]" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={referredBy}
                                                        onChange={(e) => setReferredBy(e.target.value.toUpperCase())}
                                                        placeholder="Code (Optional)"
                                                        className="w-full text-xl sm:text-2xl font-light py-2.5 border-b border-zinc-800 focus:border-zinc-400 outline-none bg-transparent text-white placeholder-zinc-700 transition-all"
                                                    />
                                                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">Referral Code (Optional)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
                                        <div />
                                        <button
                                            type="button"
                                            onClick={handleStep1Continue}
                                            className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 py-3.5 px-8 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-[#9dff00]/10 transition-all cursor-pointer"
                                        >
                                            Continue <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2 Card: MEMBERS */}
                        <div
                            key="step-2"
                            ref={step2Ref}
                            onClick={() => activeStep > 2 && setActiveStep(2)}
                            className={`relative border border-zinc-800/40 overflow-hidden flex-col justify-between h-auto lg:h-full w-full lg:w-auto bg-[#18181b] text-[#f4f4f5] rounded-[32px] p-6 sm:p-8 lg:p-10 ${activeStep === 2 ? 'flex' : 'hidden lg:flex'
                                } ${activeStep > 2 ? 'cursor-pointer' : ''
                                }`}
                        >
                            {activeStep === 1 ? (
                                /* Unopened Collapsed View */
                                renderCollapsedCard('02.', 'MEMBERS', activeStep > 2)
                            ) : activeStep > 2 ? (
                                /* Completed Collapsed View */
                                renderCollapsedCard('02.', 'MEMBERS', activeStep > 2)
                            ) : (
                                /* Expanded View */
                                <div className="fade-in-content flex flex-col justify-between h-full w-full">
                                    <div className="flex-1 flex flex-col min-h-0">
                                        <div className="text-xs font-bold text-zinc-500 font-mono mb-4">02.</div>
                                        <h2 className="text-3xl font-light text-[#9dff00] mb-6 tracking-tight">Add your team members.</h2>

                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-6">
                                            <div className="space-y-6">
                                                {teamSize === 1 ? (
                                                    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-zinc-800 rounded-2xl p-6 bg-zinc-950/20">
                                                        <Users2 className="w-12 h-12 text-zinc-650 mb-4" />
                                                        <h4 className="text-zinc-300 text-sm font-medium mb-1">Solo Participation</h4>
                                                        <p className="text-zinc-500 text-xs max-w-xs leading-relaxed font-sans">
                                                            You have selected a team size of 1. You don't need to add any other members. Click Continue to proceed.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    Array.from({ length: teamSize - 1 }).map((_, i) => (
                                                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={teamMembers[i]?.name || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...teamMembers]
                                                                        updated[i] = { ...updated[i], name: e.target.value }
                                                                        setTeamMembers(updated)
                                                                        if (errors[`teamMemberName_${i}`]) {
                                                                            setErrors(prev => ({ ...prev, [`teamMemberName_${i}`]: undefined }))
                                                                        }
                                                                    }}
                                                                    placeholder={`Member ${i + 2} Name`}
                                                                    className={`w-full text-lg font-light py-2 border-b ${
                                                                        errors[`teamMemberName_${i}`] ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                                    } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                                />
                                                                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mt-1 block">Member {i + 2} Name</span>
                                                                {errors[`teamMemberName_${i}`] && <p className="text-red-400 text-xs mt-1 font-mono">{errors[`teamMemberName_${i}`]}</p>}
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="email"
                                                                    value={teamMembers[i]?.email || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...teamMembers]
                                                                        updated[i] = { ...updated[i], email: e.target.value }
                                                                        setTeamMembers(updated)
                                                                        if (errors[`teamMemberEmail_${i}`]) {
                                                                            setErrors(prev => ({ ...prev, [`teamMemberEmail_${i}`]: undefined }))
                                                                        }
                                                                    }}
                                                                    placeholder={`Member ${i + 2} Email`}
                                                                    className={`w-full text-lg font-light py-2 border-b ${
                                                                        errors[`teamMemberEmail_${i}`] ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                                    } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                                />
                                                                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mt-1 block">Member {i + 2} Email Address</span>
                                                                {errors[`teamMemberEmail_${i}`] && <p className="text-red-400 text-xs mt-1 font-mono">{errors[`teamMemberEmail_${i}`]}</p>}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
                                        <div />
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setActiveStep(1)}
                                                className="text-zinc-400 hover:text-white font-medium px-4 py-2 text-sm transition-colors cursor-pointer"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleStep2Continue}
                                                className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 py-3.5 px-8 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-[#9dff00]/10 transition-all cursor-pointer"
                                            >
                                                Continue <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 3 Card: IDEA DESCRIPTION */}
                        <div
                            key="step-3"
                            ref={step3Ref}
                            onClick={() => activeStep > 3 && setActiveStep(3)}
                            className={`relative border border-zinc-800/40 ${isDomainOpen ? 'overflow-visible' : 'overflow-hidden'} flex-col justify-between h-auto lg:h-full w-full lg:w-auto bg-[#18181b] text-[#f4f4f5] rounded-[32px] p-6 sm:p-8 lg:p-10 ${activeStep === 3 ? 'flex' : 'hidden lg:flex'
                                } ${activeStep > 3 ? 'cursor-pointer' : ''
                                }`}
                        >
                            {activeStep < 3 ? (
                                /* Unopened Collapsed View */
                                renderCollapsedCard('03.', 'SOLUTION', activeStep > 3)
                            ) : activeStep > 3 ? (
                                /* Completed Collapsed View */
                                renderCollapsedCard('03.', 'SOLUTION', activeStep > 3)
                            ) : (
                                /* Expanded View */
                                <div className="fade-in-content flex flex-col justify-between h-full w-full">
                                    <div className="flex-1 flex flex-col min-h-0">
                                        <div className="text-xs font-bold text-zinc-500 font-mono mb-4">03.</div>
                                        <h2 className="text-3xl font-light text-[#9dff00] mb-6 tracking-tight">Select domain & describe solution.</h2>

                                        <div className="flex-1 overflow-visible pr-2 space-y-6 mb-6">
                                            <div className="relative" ref={domainDropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsDomainOpen(!isDomainOpen)}
                                                    className="w-full text-xl sm:text-2xl font-light py-2.5 border-b border-zinc-800 hover:border-zinc-600 focus:border-zinc-400 outline-none bg-transparent text-white transition-all cursor-pointer flex justify-between items-center text-left"
                                                >
                                                    <span className={domain ? 'text-white' : 'text-zinc-700'}>
                                                        {domain || 'Select Domain Track'}
                                                    </span>
                                                    <svg
                                                        className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isDomainOpen ? 'rotate-180 text-white' : ''}`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">Domain Track</span>
                                                {errors.domain && <p className="text-red-400 text-xs mt-1 font-mono">{errors.domain}</p>}
                                                {isDomainOpen && (
                                                    <div className="absolute left-0 right-0 top-full mt-2 bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar domain-dropdown">
                                                        {domains.map((d) => (
                                                            <button
                                                                key={d}
                                                                type="button"
                                                                onClick={() => {
                                                                    setDomain(d)
                                                                    if (errors.domain) setErrors(prev => ({ ...prev, domain: undefined }))
                                                                    setIsDomainOpen(false)
                                                                }}
                                                                className={`w-full text-left px-5 py-3.5 text-base sm:text-lg font-light transition-all flex items-center justify-between ${
                                                                    domain === d
                                                                        ? 'bg-zinc-800/60 text-[#9dff00] font-medium border-l-2 border-[#9dff00]'
                                                                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                                                }`}
                                                            >
                                                                <span>{d}</span>
                                                                {domain === d && <Check className="w-4 h-4 text-[#9dff00]" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <textarea
                                                    value={idea}
                                                    onChange={(e) => {
                                                        setIdea(e.target.value)
                                                        if (errors.idea) setErrors(prev => ({ ...prev, idea: undefined }))
                                                    }}
                                                    placeholder="Describe your innovative idea for the Digital India Ideathon. What problem real-world does it solve? What impact does it make?..."
                                                    className={`w-full text-xl font-light py-4 border-b ${errors.idea ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                        } outline-none bg-transparent text-white placeholder-zinc-700 resize-none h-40 transition-all`}
                                                />
                                                <div className="flex justify-between items-center mt-2.5">
                                                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Idea Proposal Details</span>
                                                    <span className={`text-[10px] font-mono ${idea.length < 150 ? 'text-zinc-500' : 'text-[#9dff00] font-semibold'}`}>
                                                        {idea.length}/150 min characters
                                                    </span>
                                                </div>
                                                {errors.idea && <p className="text-red-400 text-xs mt-1 font-mono">{errors.idea}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
                                        <div />
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setActiveStep(2)}
                                                className="text-zinc-400 hover:text-white font-medium px-4 py-2 text-sm transition-colors cursor-pointer"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleStep3Continue}
                                                className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 py-3.5 px-8 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-[#9dff00]/10 transition-all cursor-pointer"
                                            >
                                                Continue to Payment <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 4 Card: PAYMENT VERIFICATION */}
                        <div
                            key="step-4"
                            ref={step4Ref}
                            className={`relative border border-zinc-800/40 overflow-hidden flex-col justify-between h-auto lg:h-full w-full lg:w-auto bg-[#18181b] text-[#f4f4f5] rounded-[32px] p-6 sm:p-8 lg:p-10 ${activeStep === 4 ? 'flex' : 'hidden lg:flex'
                                }`}
                        >
                            {activeStep < 4 ? (
                                /* Unopened Collapsed View */
                                renderCollapsedCard('04.', 'PAYMENT', activeStep > 4)
                            ) : isSubmitted ? (
                                /* Success View inside the card */
                                <div className="success-content fade-in-content flex flex-col justify-between h-full w-full">
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="text-xs font-bold text-zinc-500 font-mono mb-2">04.</div>
                                        <h2 className="text-2xl font-light text-[#9dff00] mb-4 tracking-tight font-sans">Registration Confirmed!</h2>

                                        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4">
                                            <div className="flex items-center justify-center gap-3 py-3 border-b border-zinc-800/60">
                                                <div className="w-10 h-10 rounded-full bg-[#9dff00]/10 flex items-center justify-center border border-[#9dff00]/25">
                                                    <Check className="w-5 h-5 text-[#9dff00]" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white text-sm font-semibold">Your team is registered!</h4>
                                                    <p className="text-[10px] text-zinc-500 font-mono uppercase">Unique code: {myReferralCode}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl text-center">
                                                    <div className="text-zinc-500 text-[8px] font-mono uppercase tracking-wider mb-0.5">Points</div>
                                                    <div className="text-sm font-bold font-mono text-white">{dashboardData?.referralPoints ?? 0}</div>
                                                </div>
                                                <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl text-center">
                                                    <div className="text-zinc-500 text-[8px] font-mono uppercase tracking-wider mb-0.5">Rank</div>
                                                    <div className="text-sm font-bold font-mono text-[#9dff00]">#{dashboardData?.currentRank ?? '-'}</div>
                                                </div>
                                                <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl text-center">
                                                    <div className="text-zinc-500 text-[8px] font-mono uppercase tracking-wider mb-0.5">Referrals</div>
                                                    <div className="text-sm font-bold font-mono text-white">{dashboardData?.successfulReferrals?.length ?? 0}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 pt-2">
                                                <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block">Your Referral Link</label>
                                                <div className="text-[10px] font-mono bg-black/60 p-2.5 rounded-xl border border-zinc-800 text-zinc-300 break-all select-all flex items-center justify-between">
                                                    <span>{typeof window !== 'undefined' ? `${window.location.origin}/events/digitalindia?ref=${myReferralCode}` : `https://domain.com/events/digitalindia?ref=${myReferralCode}`}</span>
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const link = typeof window !== 'undefined' ? `${window.location.origin}/events/digitalindia?ref=${myReferralCode}` : `https://domain.com/events/digitalindia?ref=${myReferralCode}`
                                                            navigator.clipboard.writeText(link)
                                                            alert('Referral link copied to clipboard!')
                                                        }}
                                                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg text-[10px] font-semibold flex-1 cursor-pointer transition-colors"
                                                    >
                                                        Copy Link
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(myReferralCode)
                                                            alert('Referral code copied to clipboard!')
                                                        }}
                                                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg text-[10px] font-semibold flex-1 cursor-pointer transition-colors"
                                                    >
                                                        Copy Code
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-zinc-900/60">
                                                <div className="text-[9px] font-mono text-zinc-500 mb-1.5 uppercase tracking-wide">Share Link</div>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {(() => {
                                                        const link = typeof window !== 'undefined' ? `${window.location.origin}/events/digitalindia?ref=${myReferralCode}` : `https://domain.com/events/digitalindia?ref=${myReferralCode}`
                                                        const shareText = `Build for India! Join the Digital India Hackathon. Use my referral code "${myReferralCode}" to register:`
                                                        
                                                        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + link)}`
                                                        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`
                                                        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(link)}`
                                                        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`

                                                        return (
                                                            <>
                                                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded text-[10px] font-semibold transition-colors">
                                                                    WhatsApp
                                                                </a>
                                                                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="bg-sky-600 hover:bg-sky-700 text-white px-2.5 py-1 rounded text-[10px] font-semibold transition-colors">
                                                                    Telegram
                                                                </a>
                                                                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white px-2.5 py-1 rounded text-[10px] font-semibold transition-colors">
                                                                    X
                                                                </a>
                                                                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 text-white px-2.5 py-1 rounded text-[10px] font-semibold transition-colors">
                                                                    LinkedIn
                                                                </a>
                                                            </>
                                                        )
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' })
                                            }}
                                            className="text-[#9dff00] hover:underline text-xs font-mono font-semibold"
                                        >
                                            View Leaderboard
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.push('/events')}
                                            className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 rounded-full py-3 px-6 text-xs font-bold flex items-center gap-1 shadow-lg shadow-[#9dff00]/10 transition-all cursor-pointer"
                                        >
                                            Got It <Check className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Expanded View (Payment Only) */
                                <form onSubmit={handleSubmit} className="fade-in-content flex flex-col justify-between h-full w-full">
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
                                        <div>
                                            <div className="text-xs font-bold text-zinc-500 font-mono mb-2">04.</div>
                                            <h2 className="text-3xl font-light text-[#9dff00] mb-4 tracking-tight">Complete payment verification.</h2>
                                        </div>

                                        {/* Payment details integration */}
                                        <div className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-xs font-bold uppercase text-zinc-400 mb-2 flex items-center gap-1.5 font-mono">
                                                    <CreditCard className="w-4 h-4 text-zinc-300" /> Registration Fee
                                                </h4>
                                                <div className="text-3xl font-light text-white mb-3">₹{upiAmount}</div>
                                                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                                                    Please scan the UPI QR code to complete your payment of ₹{upiAmount}. Note your UPI Transaction ID/UTR once finished.
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 text-xs font-mono bg-black/60 p-2.5 rounded-xl border border-zinc-800 text-zinc-300 select-all break-all shadow-sm flex items-center justify-between">
                                                        <span>UPI ID: {upiId}</span>
                                                        <button
                                                            type="button"
                                                            onClick={handleCopyUPI}
                                                            className="text-zinc-500 hover:text-[#9dff00] p-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors flex items-center gap-1 cursor-pointer font-sans text-[10px]"
                                                            title="Copy UPI ID"
                                                        >
                                                            {copied ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 text-[#9dff00]" />
                                                                    <span className="text-[#9dff00] font-medium">Copied!</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                                                    <span>Copy</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <div className="relative w-48 h-48 border border-zinc-800 bg-white rounded-2xl overflow-hidden p-3 shadow-sm">
                                                    <Image
                                                        src="/assets/events/upi-qr-v3.png"
                                                        alt="UPI Payment QR Code"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1.5 block">UTR / Transaction ID</label>
                                                <input
                                                    type="text"
                                                    value={utrId}
                                                    onChange={(e) => {
                                                        setUtrId(e.target.value)
                                                        if (errors.utrId) setErrors(prev => ({ ...prev, utrId: undefined }))
                                                    }}
                                                    placeholder="Enter UTR or Transaction ID"
                                                    className={`w-full text-lg font-light py-2 border-b ${errors.utrId ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                        } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                />
                                                {errors.utrId && <p className="text-red-400 text-xs mt-1">{errors.utrId}</p>}
                                            </div>

                                            <div>
                                                <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1.5 block">Upload Receipt Screenshot</label>
                                                <div className={`relative border border-dashed rounded-xl p-3 text-center transition-all ${errors.screenshot ? 'border-red-400 bg-red-950/20' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/30'
                                                    }`}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    {screenshotPreview ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="relative w-8 h-8 rounded overflow-hidden border border-zinc-800">
                                                                <img src={screenshotPreview} alt="Screenshot" className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-xs text-zinc-300 truncate max-w-[120px]">{screenshot?.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-zinc-400 flex items-center justify-center gap-1.5">
                                                            <Upload className="w-3.5 h-3.5 text-zinc-500" /> Click or drag screenshot
                                                        </span>
                                                    )}
                                                </div>
                                                {errors.screenshot && <p className="text-red-500 text-xs mt-1">{errors.screenshot}</p>}
                                            </div>
                                        </div>

                                        {apiError && (
                                            <p className="text-red-400 text-xs text-center border border-red-950/40 bg-red-950/25 rounded-xl py-3 px-4 font-mono">{apiError}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800">
                                        <div className="text-[9px] text-zinc-500 max-w-[280px] leading-tight font-mono uppercase">

                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setActiveStep(3)}
                                                disabled={isSubmitting}
                                                className="text-zinc-400 hover:text-white font-medium px-4 py-2 text-sm disabled:opacity-50 transition-colors cursor-pointer"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 py-3.5 px-8 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-[#9dff00]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> Submitting
                                                    </>
                                                ) : (
                                                    <>
                                                        Submit Idea <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
                    </>
                )}
            </section>

            {/* Referral Dashboard lookup */}
            <section id="referral-dashboard" className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 md:py-16 border-t border-zinc-800/40">
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-[32px] p-6 md:p-10 spotlight-card">
                    <h2 className="text-3xl font-light text-white tracking-tight mb-4 flex items-center gap-2">
                        <Users2 className="text-[#9dff00] w-8 h-8" />
                        Referral <span className="text-[#9dff00] font-normal">Program Dashboard</span>
                    </h2>
                    <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed mb-8 max-w-2xl font-sans">
                        Track your successful referrals, view your rank on the leaderboard, and claim your free passes once you reach 10 successful referrals!
                    </p>

                    {dashboardData ? (
                        /* Loaded Dashboard View */
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-zinc-900/60 border border-zinc-800/50 p-5 rounded-2xl text-center">
                                    <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider mb-1">Referral Code</div>
                                    <div className="text-2xl font-bold font-mono text-[#9dff00]">{dashboardData.referralCode}</div>
                                </div>
                                <div className="bg-zinc-900/60 border border-zinc-800/50 p-5 rounded-2xl text-center">
                                    <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider mb-1">Referral Points</div>
                                    <div className="text-2xl font-bold font-mono text-white">{dashboardData.referralPoints}</div>
                                </div>
                                <div className="bg-zinc-900/60 border border-zinc-800/50 p-5 rounded-2xl text-center">
                                    <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider mb-1">Current Rank</div>
                                    <div className="text-2xl font-bold font-mono text-[#9dff00]">#{dashboardData.currentRank}</div>
                                </div>
                                <div className="bg-zinc-900/60 border border-zinc-800/50 p-5 rounded-2xl text-center">
                                    <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider mb-1">Successful Referrals</div>
                                    <div className="text-2xl font-bold font-mono text-white">{dashboardData.successfulReferrals?.length || 0}</div>
                                </div>
                            </div>

                            <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block mb-1">Your Unique Referral Link</label>
                                        <div className="text-xs font-mono bg-black/60 p-3 rounded-xl border border-zinc-800 text-zinc-300 break-all select-all">
                                            {typeof window !== 'undefined' ? `${window.location.origin}/events/digitalindia?ref=${dashboardData.referralCode}` : `https://domain.com/events/digitalindia?ref=${dashboardData.referralCode}`}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const link = typeof window !== 'undefined' ? `${window.location.origin}/events/digitalindia?ref=${dashboardData.referralCode}` : `https://domain.com/events/digitalindia?ref=${dashboardData.referralCode}`
                                                navigator.clipboard.writeText(link)
                                                alert('Referral link copied to clipboard!')
                                            }}
                                            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                                        >
                                            Copy Link
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(dashboardData.referralCode)
                                                alert('Referral code copied to clipboard!')
                                            }}
                                            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                                        >
                                            Copy Code
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-zinc-900/60">
                                    <div className="text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wide">Share on Social Media</div>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            const link = typeof window !== 'undefined' ? `${window.location.origin}/events/digitalindia?ref=${dashboardData.referralCode}` : `https://domain.com/events/digitalindia?ref=${dashboardData.referralCode}`
                                            const shareText = `Build for India! Join the Digital India Hackathon. Use my referral code "${dashboardData.referralCode}" to register:`
                                            
                                            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + link)}`
                                            const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`
                                            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(link)}`
                                            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`

                                            return (
                                                <>
                                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-green-650 hover:bg-green-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
                                                        WhatsApp
                                                    </a>
                                                    <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
                                                        Telegram
                                                    </a>
                                                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
                                                        X
                                                    </a>
                                                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
                                                        LinkedIn
                                                    </a>
                                                </>
                                            )
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {dashboardData.successfulReferrals && dashboardData.successfulReferrals.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wide">Your Referrals ({dashboardData.successfulReferrals.length})</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {dashboardData.successfulReferrals.map((refTeam: any, index: number) => (
                                            <div key={index} className="bg-zinc-950/30 border border-zinc-900/60 p-3 rounded-xl flex justify-between items-center text-xs font-sans">
                                                <span className="text-white font-medium">{refTeam.teamName}</span>
                                                <span className="text-zinc-500 text-[10px] font-mono">
                                                    {new Date(refTeam.registeredAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4 border-t border-zinc-900/60">
                                <button
                                    type="button"
                                    onClick={handleLogoutDashboard}
                                    className="text-zinc-500 hover:text-red-400 text-xs font-mono flex items-center gap-1 transition-colors"
                                >
                                    Use Different Email
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Lookup Form View */
                        <form onSubmit={handleDashboardLookup} className="max-w-md">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <input
                                        type="email"
                                        placeholder="Enter team leader's email"
                                        value={dashboardEmail}
                                        onChange={(e) => {
                                            setDashboardEmail(e.target.value)
                                            setDashboardError(null)
                                        }}
                                        className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-[#9dff00] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-650 outline-none transition-all font-sans"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={dashboardLoading}
                                    className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all shrink-0 cursor-pointer"
                                >
                                    {dashboardLoading ? 'Searching...' : 'View Dashboard'}
                                    <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
                                </button>
                            </div>
                            {dashboardError && (
                                <p className="text-red-400 text-xs mt-2 font-mono">{dashboardError}</p>
                            )}
                        </form>
                    )}
                </div>
            </section>

            {/* Referral Leaderboard */}
            <section id="leaderboard" className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 md:py-16 border-t border-zinc-800/40">
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-[32px] p-6 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-3xl font-light text-white tracking-tight mb-2 flex items-center gap-2">
                                <Trophy className="text-[#9dff00] w-8 h-8" />
                                Referral <span className="text-[#9dff00] font-normal">Leaderboard</span>
                            </h2>
                            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Compete and earn free hackathon passes</p>
                        </div>
                        
                        <div className="relative max-w-xs w-full bg-[#18181b] border border-zinc-800 rounded-xl px-3.5 py-2 flex items-center gap-2 shadow-sm">
                            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by team name..."
                                value={leaderboardSearch}
                                onChange={(e) => setLeaderboardSearch(e.target.value)}
                                className="bg-transparent outline-none text-white text-xs placeholder:text-zinc-600 flex-1 font-mono"
                            />
                        </div>
                    </div>

                    {/* Banner */}
                    <div className="bg-[#9dff00]/10 border border-[#9dff00]/20 rounded-2xl p-4 mb-6 text-center shadow-[0_0_20px_rgba(157,255,0,0.05)]">
                        <p className="text-xs sm:text-sm font-semibold text-[#9dff00] flex items-center justify-center gap-2 font-sans">
                            <Trophy className="w-4 h-4 text-[#9dff00] shrink-0" /> Reach 10 Successful Referrals and Earn FREE Hackathon Passes!
                        </p>
                    </div>

                    {/* Table */}
                    <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/20">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
                            <thead>
                                <tr className="bg-zinc-900/50 border-b border-zinc-800/80">
                                    <th className="px-6 py-4 text-zinc-400 font-mono text-xs uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-4 text-zinc-400 font-mono text-xs uppercase tracking-wider">Team Name</th>
                                    <th className="px-6 py-4 text-zinc-400 font-mono text-xs uppercase tracking-wider text-right">Referral Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardLoading && leaderboardData.length === 0 ? (
                                    Array.from({ length: 3 }).map((_, idx) => (
                                        <tr key={idx} className="border-b border-zinc-900/40">
                                            <td className="px-6 py-4"><div className="h-4 w-8 bg-zinc-800 rounded animate-pulse" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" /></td>
                                            <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-zinc-800 rounded animate-pulse ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : leaderboardData.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-zinc-500 font-mono text-xs">
                                            No teams found on the leaderboard.
                                        </td>
                                    </tr>
                                ) : (
                                    leaderboardData.map((team) => {
                                        const isTop10 = team.rank <= 10
                                        const isGold = team.rank === 1
                                        const isSilver = team.rank === 2
                                        const isBronze = team.rank === 3

                                        return (
                                            <tr
                                                key={team.teamName}
                                                className={`border-b border-zinc-900/40 hover:bg-zinc-900/20 transition-all duration-300 ${
                                                    isTop10 ? 'bg-[#9dff00]/[0.015]' : ''
                                                }`}
                                            >
                                                <td className="px-6 py-4 font-mono font-bold">
                                                    {isGold ? (
                                                        <span className="inline-flex items-center gap-1.5 text-yellow-500"><Medal className="w-4 h-4 text-yellow-550 shrink-0" /> <span className="text-yellow-500/80">#1</span></span>
                                                    ) : isSilver ? (
                                                        <span className="inline-flex items-center gap-1.5 text-slate-300"><Medal className="w-4 h-4 text-slate-300 shrink-0" /> <span className="text-slate-300/80">#2</span></span>
                                                    ) : isBronze ? (
                                                        <span className="inline-flex items-center gap-1.5 text-amber-600"><Medal className="w-4 h-4 text-amber-600 shrink-0" /> <span className="text-amber-600/80">#3</span></span>
                                                    ) : (
                                                        <span className={isTop10 ? 'text-[#9dff00]' : 'text-zinc-500'}>
                                                            #{team.rank}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className={`px-6 py-4 font-sans font-medium ${isTop10 ? 'text-white' : 'text-zinc-400'}`}>
                                                    {team.teamName}
                                                    {isTop10 && (
                                                        <span className="ml-2 text-[9px] font-mono bg-[#9dff00]/15 text-[#9dff00] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                                                            Top 10
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-bold text-base text-white">
                                                    {team.referralPoints}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Rules & FAQ Split Section */}
            <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 border-t border-zinc-800/40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Rules & Guidelines */}
                    <div>
                        <h2 className="text-3xl font-light text-white tracking-tight mb-8">
                            Rules & <span className="text-[#9dff00] font-normal">Regulations</span>
                        </h2>
                        <div className="space-y-4">
                            {[
                                { title: "Original Submissions Only", desc: "All developed work must be original and built during the offline hackathon. Copied templates result in immediate disqualification." },
                                { title: "Jury Decision Finality", desc: "The decisions of the evaluation jury and organizing committee are final and binding in all cases." }
                            ].map((rule, idx) => (
                                <div key={idx} className="flex gap-4 items-start pb-4 border-b border-zinc-800/40 last:border-0 last:pb-0">
                                    <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-[10px] font-mono shrink-0 mt-0.5">
                                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white text-sm font-medium mb-1 font-sans">{rule.title}</h4>
                                        <p className="text-zinc-400 text-xs font-light leading-relaxed font-sans">
                                            {rule.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: FAQs Accordion */}
                    <div>
                        <h2 className="text-3xl font-light text-white tracking-tight mb-8">
                            Frequently Asked <span className="text-[#9dff00] font-normal">Questions</span>
                        </h2>

                        <div className="space-y-3">
                            {faqs.map((faq, idx) => {
                                const isOpen = openFaq === idx;
                                return (
                                    <div key={idx} className="border border-zinc-800/80 bg-zinc-900/5 rounded-2xl overflow-hidden transition-all duration-300">
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                                            className="w-full text-left px-5 py-4 flex items-center justify-between text-[#f4f4f5] hover:text-[#9dff00] transition-colors"
                                        >
                                            <span className="text-xs sm:text-sm font-medium pr-4">{faq.q}</span>
                                            <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#9dff00]' : ''}`} />
                                        </button>
                                        
                                        <div className={`grid transition-all duration-300 ease-in-out ${
                                            isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-zinc-800/40' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                                        }`}>
                                            <div className="overflow-hidden">
                                                <p className="px-5 py-4 text-zinc-400 text-xs sm:text-sm leading-relaxed font-light font-sans">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 flex justify-between items-center text-xs text-zinc-500 font-mono uppercase tracking-widest border-t border-zinc-800/40">
                <div>CLOUD COMMUNITY CLUB</div>
                <div>STUDENT DEVELOPERS COMMUNITY - SNIST</div>
            </footer>
        </div>
    )
}
