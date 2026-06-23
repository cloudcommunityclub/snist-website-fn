'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { Check, ArrowRight, Upload, CreditCard, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface FormErrors {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    college?: string
    domain?: string
    idea?: string
    utrId?: string
    screenshot?: string
}

export default function DigitalIndiaGSAPForm() {
    const router = useRouter()
    const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)

    // Form fields state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [college, setCollege] = useState('')
    const [domain, setDomain] = useState('')
    const [idea, setIdea] = useState('')
    const [utrId, setUtrId] = useState('')
    const [screenshot, setScreenshot] = useState<File | null>(null)
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)

    const [errors, setErrors] = useState<FormErrors>({})
    const [isDesktop, setIsDesktop] = useState(false)
    const isFirstRender = useRef(true)

    // DOM Refs for animations
    const containerRef = useRef<HTMLDivElement>(null)
    const step1Ref = useRef<HTMLDivElement>(null)
    const step2Ref = useRef<HTMLDivElement>(null)
    const step3Ref = useRef<HTMLDivElement>(null)
    const step4Ref = useRef<HTMLDivElement>(null)

    // UPI configurations
    const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'c3club@upi'
    const upiAmount = '99'

    // Detect screen width
    useEffect(() => {
        const checkIsDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024)
        }
        checkIsDesktop()
        window.addEventListener('resize', checkIsDesktop)
        return () => window.removeEventListener('resize', checkIsDesktop)
    }, [])

    // Animate width changes between cards using GSAP, ensuring height is fixed at 100%
    useEffect(() => {
        if (!isDesktop) {
            // Clear GSAP inline styles on mobile/tablet
            gsap.set([step1Ref.current, step2Ref.current, step3Ref.current, step4Ref.current], { clearProps: 'all' })
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
    }, [activeStep, isSubmitted, isDesktop])

    const validateStep1 = (): boolean => {
        const newErrors: FormErrors = {}
        if (!firstName.trim()) newErrors.firstName = 'First name is required'
        if (!lastName.trim()) newErrors.lastName = 'Last name is required'

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

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateStep2 = (): boolean => {
        const newErrors: FormErrors = {}
        if (!college.trim()) newErrors.college = 'College/Institution is required'
        if (!domain) newErrors.domain = 'Please select a domain'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateStep3 = (): boolean => {
        const newErrors: FormErrors = {}
        if (!idea.trim()) {
            newErrors.idea = 'Idea description is required'
        } else if (idea.trim().length < 50) {
            newErrors.idea = 'Please describe your idea in at least 50 characters'
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

        setIsSubmitting(true)

        try {
            const submitData = new FormData()
            submitData.append('name', `${firstName} ${lastName}`.trim())
            submitData.append('college', college)
            submitData.append('email', email)
            submitData.append('phone', phone)
            submitData.append('idea', `[Domain: ${domain}] ${idea}`)
            submitData.append('utrId', utrId)
            if (screenshot) {
                submitData.append('screenshot', screenshot)
            }

            const response = await fetch('/api/digital-india/submit', {
                method: 'POST',
                body: submitData,
            })

            const result = await response.json()

            if (response.ok && result.success) {
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
        'Healthcare & Education',
        'Smart Cities & Governance',
        'Agriculture & Fintech',
        'Sustainability & Accessibility'
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
        <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#09090b] via-[#121214] to-[#09090b] text-[#f4f4f5] p-6 md:p-12 font-sans selection:bg-[#9dff00]/40 ">
            {/* Background spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(157,255,0,0.04)_0%,transparent_70%)] pointer-events-none" />

            {/* Main Section */}
            <main className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center pt-32 pb-12 md:pt-40 md:pb-20">
                {/* Hackathon Info Section */}
                <div className="w-full max-w-7xl mb-8 text-left border-b border-zinc-800/40 pb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#9dff00]/20 bg-[#9dff00]/5 text-[#9dff00] text-[10px] font-mono tracking-wider mb-4 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9dff00] animate-pulse"></span>
                        Ideathon Challenge
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-light text-white tracking-tight mb-4">
                        Digital India <span className="text-[#9dff00] font-normal">Hackathon</span>
                    </h1>
                    <p className="text-zinc-400 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
                        A hackathon where participants develop tech-driven solutions to real-world challenges faced by regular people in India—from local shopkeepers and street vendors to rural communities. Leverage cloud, FOSS, or smart automation to pitch ideas that drive meaningful, localized impact.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-zinc-300 font-mono uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9dff00] animate-pulse"></span>
                        The top 100 problem statements will be shortlisted
                    </div>
                </div>

                {/* Horizontal Top Stepper for Mobile/Tablet */}
                <div className="lg:hidden w-full max-w-7xl mb-6 px-2 font-mono text-[10px] uppercase tracking-widest flex items-center justify-between">
                    {[
                        { num: '01.', label: 'PROFILE' },
                        { num: '02.', label: 'EXPERTISE' },
                        { num: '03.', label: 'MESSAGE' },
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

                <div className="flex w-full flex-col lg:flex-row items-stretch justify-center gap-6 max-w-7xl h-auto lg:h-[600px] relative">

                    <div ref={containerRef} className="flex-1 flex flex-col lg:flex-row gap-4 w-full h-auto lg:h-full items-stretch select-none">
                        {/* Step 1 Card: PROFILE */}
                        <div
                            key="step-1"
                            ref={step1Ref}
                            onClick={() => activeStep > 1 && setActiveStep(1)}
                            className={`relative border border-zinc-800/40 overflow-hidden flex-col justify-between h-auto lg:h-full w-full lg:w-auto bg-[#18181b] text-[#f4f4f5] rounded-[32px] p-6 sm:p-8 lg:p-10 ${activeStep === 1 ? 'flex' : 'hidden lg:flex'
                                } ${activeStep > 1 ? 'cursor-pointer' : ''
                                }`}
                        >
                            {activeStep > 1 ? (
                                /* Collapsed Slim View */
                                renderCollapsedCard('01.', 'PROFILE', activeStep > 1)
                            ) : (
                                /* Expanded View */
                                <div className="fade-in-content flex flex-col justify-between h-full w-full">
                                    <div>
                                        <div className="text-xs font-bold text-zinc-500 font-mono mb-4">01.</div>
                                        <h2 className="text-3xl font-light text-white mb-10 tracking-tight">Add your personal information.</h2>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => {
                                                        setFirstName(e.target.value)
                                                        if (errors.firstName) setErrors(prev => ({ ...prev, firstName: undefined }))
                                                    }}
                                                    placeholder="First Name"
                                                    className={`w-full text-xl sm:text-2xl font-light py-2.5 border-b ${errors.firstName ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                        } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                />
                                                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">First Name</span>
                                                {errors.firstName && <p className="text-red-400 text-xs mt-1 font-mono">{errors.firstName}</p>}
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => {
                                                        setLastName(e.target.value)
                                                        if (errors.lastName) setErrors(prev => ({ ...prev, lastName: undefined }))
                                                    }}
                                                    placeholder="Last Name"
                                                    className={`w-full text-xl sm:text-2xl font-light py-2.5 border-b ${errors.lastName ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                        } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                />
                                                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">Last Name</span>
                                                {errors.lastName && <p className="text-red-400 text-xs mt-1 font-mono">{errors.lastName}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-6 lg:space-y-8 mb-6">
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
                                                    placeholder="(00) 00000 0000"
                                                    className={`w-full text-xl sm:text-2xl font-light py-2.5 border-b ${errors.phone ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                        } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                                />
                                                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">Phone Number</span>
                                                {errors.phone && <p className="text-red-400 text-xs mt-1 font-mono">{errors.phone}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6">
                                        <div className="w-2.5 h-2.5 bg-[#9dff00] rounded-full animate-pulse shadow-[0_0_10px_rgba(157,255,0,0.4)]" />
                                        <button
                                            onClick={handleStep1Continue}
                                            className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 py-3.5 px-8 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-[#9dff00]/10 transition-all"
                                        >
                                            Continue <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2 Card: EXPERTISE / DOMAIN */}
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
                                renderCollapsedCard('02.', 'EXPERTISE', activeStep > 2)
                            ) : activeStep > 2 ? (
                                /* Completed Collapsed View */
                                renderCollapsedCard('02.', 'EXPERTISE', activeStep > 2)
                            ) : (
                                /* Expanded View */
                                <div className="fade-in-content flex flex-col justify-between h-full w-full">
                                    <div>
                                        <div className="text-xs font-bold text-zinc-500 font-mono mb-4">02.</div>
                                        <h2 className="text-3xl font-light text-white mb-6 tracking-tight">Select the domain of your idea.</h2>

                                        <div className="space-y-3 mb-6">
                                            {domains.map((d) => (
                                                <div
                                                    key={d}
                                                    onClick={() => {
                                                        setDomain(d)
                                                        if (errors.domain) setErrors(prev => ({ ...prev, domain: undefined }))
                                                    }}
                                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl border cursor-pointer transition-all ${domain === d
                                                            ? 'bg-zinc-900/50 border-[#9dff00] text-white shadow-[0_0_15px_rgba(157,255,0,0.05)]'
                                                            : 'bg-transparent border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${domain === d ? 'border-[#7ce000] bg-[#9dff00]' : 'border-zinc-700 bg-transparent'
                                                        }`}>
                                                        {domain === d && <Check className="w-3.5 h-3.5 text-zinc-950 stroke-[3]" />}
                                                    </div>
                                                    <span className="text-base font-medium">{d}</span>
                                                </div>
                                            ))}
                                            {errors.domain && <p className="text-red-400 text-xs mt-1">{errors.domain}</p>}
                                        </div>

                                        <div className="mt-6">
                                            <input
                                                type="text"
                                                value={college}
                                                onChange={(e) => {
                                                    setCollege(e.target.value)
                                                    if (errors.college) setErrors(prev => ({ ...prev, college: undefined }))
                                                }}
                                                placeholder="College / Institution"
                                                className={`w-full text-xl sm:text-2xl font-light py-2 border-b ${errors.college ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                    } outline-none bg-transparent text-white placeholder-zinc-700 transition-all`}
                                            />
                                            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5 block">College Name</span>
                                            {errors.college && <p className="text-red-400 text-xs mt-1 font-mono">{errors.college}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6">
                                        <div className="w-2.5 h-2.5 bg-[#9dff00] rounded-full animate-pulse shadow-[0_0_10px_rgba(157,255,0,0.4)]" />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setActiveStep(1)}
                                                className="text-zinc-400 hover:text-white font-medium px-4 py-2 text-sm transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleStep2Continue}
                                                className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 py-3.5 px-8 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-[#9dff00]/10 transition-all"
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
                            className={`relative border border-zinc-800/40 overflow-hidden flex-col justify-between h-auto lg:h-full w-full lg:w-auto bg-[#18181b] text-[#f4f4f5] rounded-[32px] p-6 sm:p-8 lg:p-10 ${activeStep === 3 ? 'flex' : 'hidden lg:flex'
                                } ${activeStep > 3 ? 'cursor-pointer' : ''
                                }`}
                        >
                            {activeStep < 3 ? (
                                /* Unopened Collapsed View */
                                renderCollapsedCard('03.', 'MESSAGE', activeStep > 3)
                            ) : activeStep > 3 ? (
                                /* Completed Collapsed View */
                                renderCollapsedCard('03.', 'MESSAGE', activeStep > 3)
                            ) : (
                                /* Expanded View (Only Idea Description) */
                                <div className="fade-in-content flex flex-col justify-between h-full w-full">
                                    <div className="flex-1 flex flex-col justify-start">
                                        <div className="text-xs font-bold text-zinc-500 font-mono mb-4">03.</div>
                                        <h2 className="text-3xl font-light text-white mb-6 tracking-tight">Describe your idea.</h2>

                                        <div className="flex-1 flex flex-col min-h-[150px] lg:min-h-[220px]">
                                            <textarea
                                                value={idea}
                                                onChange={(e) => setIdea(e.target.value)}
                                                placeholder="Describe your innovative idea for the Digital India Ideathon. What problem does it solve? How does it leverage cloud/FOSS technology? What impact does it make?..."
                                                className={`w-full flex-1 text-xl font-light py-4 border-b ${errors.idea ? 'border-red-400 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                                                    } outline-none bg-transparent text-white placeholder-zinc-750 resize-none transition-all`}
                                            />
                                            <div className="flex justify-between items-center mt-2.5">
                                                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Idea Proposal Details</span>
                                                <span className={`text-[10px] font-mono ${idea.length < 50 ? 'text-zinc-500' : 'text-[#9dff00] font-semibold'}`}>
                                                    {idea.length}/50 min characters
                                                </span>
                                            </div>
                                            {errors.idea && <p className="text-red-400 text-xs mt-1">{errors.idea}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
                                        <div className="w-2.5 h-2.5 bg-[#9dff00] rounded-full animate-pulse shadow-[0_0_10px_rgba(157,255,0,0.4)]" />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setActiveStep(2)}
                                                className="text-zinc-400 hover:text-white font-medium px-4 py-2 text-sm transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleStep3Continue}
                                                className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 py-3.5 px-8 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-[#9dff00]/10 transition-all"
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
                                    <div>
                                        <div className="text-xs font-bold text-zinc-500 font-mono mb-4">04.</div>
                                        <h2 className="text-3xl font-light text-white mb-6 tracking-tight">Submission Confirmed</h2>

                                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-[#9dff00]/10 flex items-center justify-center mb-6 border border-[#9dff00]/20 shadow-[0_0_30px_rgba(157,255,0,0.15)]">
                                                <Check className="w-8 h-8 text-[#9dff00]" />
                                            </div>
                                            <p className="text-lg font-light text-zinc-300 leading-relaxed max-w-md">
                                                Thank you for your submission. Our team will contact you shortly about next steps.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end items-center mt-6 pt-4 border-t border-zinc-800">
                                        <button
                                            type="button"
                                            onClick={() => router.push('/events')}
                                            className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 rounded-full py-3.5 px-8 text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#9dff00]/10 transition-all"
                                        >
                                            Got It <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Expanded View (Payment Only) */
                                <form onSubmit={handleSubmit} className="fade-in-content flex flex-col justify-between h-full w-full">
                                    <div className="overflow-y-auto pr-2 max-h-none lg:max-h-[380px] custom-scrollbar space-y-5">
                                        <div>
                                            <div className="text-xs font-bold text-zinc-500 font-mono mb-2">04.</div>
                                            <h2 className="text-3xl font-light text-white mb-4 tracking-tight">Complete payment verification.</h2>
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
                                                <div className="text-xs font-mono bg-black/60 p-2.5 rounded-xl border border-zinc-800 text-zinc-300 select-all break-all shadow-sm">
                                                    UPI ID: {upiId}
                                                </div>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <div className="relative w-48 h-48 border border-zinc-800 bg-white rounded-2xl overflow-hidden p-3 shadow-sm">
                                                    <Image
                                                        src="/assets/events/upi-qr.png"
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
                                            <p className="text-red-500 text-xs text-center border border-red-200/50 bg-red-50 rounded-xl py-2 px-4">{apiError}</p>
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
                                                className="text-zinc-400 hover:text-white font-medium px-4 py-2 text-sm disabled:opacity-50 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-[#9dff00] hover:bg-[#8ae000] text-zinc-950 py-3.5 px-8 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-[#9dff00]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full max-w-7xl mx-auto mt-8 flex justify-between items-center text-xs text-zinc-500 font-mono uppercase tracking-widest">
                <div>CLOUD COMMUNITY CLUB</div>
                <div>STUDENT DEVELOPERS COMMUNITY - SNIST</div>
            </footer>
        </div>
    )
}
