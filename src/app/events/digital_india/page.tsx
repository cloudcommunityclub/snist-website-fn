'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ArrowLeft, Send, CheckCircle, User, Mail, Phone, School, Lightbulb, Upload, CreditCard, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
        }
    }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
}

interface FormData {
    name: string
    college: string
    email: string
    phone: string
    idea: string
    utrId: string
    screenshot: File | null
}

interface FormErrors {
    name?: string
    college?: string
    email?: string
    phone?: string
    idea?: string
    utrId?: string
    screenshot?: string
}

export default function DigitalIndiaEvent() {
    const [isMounted, setIsMounted] = useState(false)
    const [step, setStep] = useState<1 | 2>(1)
    const [formData, setFormData] = useState<FormData>({
        name: '',
        college: '',
        email: '',
        phone: '',
        idea: '',
        utrId: '',
        screenshot: null
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
    const [apiError, setApiError] = useState<string | null>(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const validateStep1 = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.college.trim()) {
            newErrors.college = 'College name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
        } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit Indian phone number'
        }

        if (!formData.idea.trim()) {
            newErrors.idea = 'Idea description is required'
        } else if (formData.idea.trim().length < 50) {
            newErrors.idea = 'Please describe your idea in at least 50 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateStep2 = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.utrId.trim()) {
            newErrors.utrId = 'UTR ID (Transaction ID) is required'
        } else if (!/^\d{12}$/.test(formData.utrId.trim())) {
            newErrors.utrId = 'UTR ID must be exactly 12 digits'
        }

        if (!formData.screenshot) {
            newErrors.screenshot = 'Payment screenshot is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error on change
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setFormData(prev => ({ ...prev, screenshot: file }))
        if (errors.screenshot) {
            setErrors(prev => ({ ...prev, screenshot: undefined }))
        }

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

    const handleNextStep = (e: React.MouseEvent) => {
        e.preventDefault()
        if (validateStep1()) {
            setStep(2)
        }
    }

    const handlePrevStep = (e: React.MouseEvent) => {
        e.preventDefault()
        setStep(1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setApiError(null)

        if (!validateStep2()) return

        setIsSubmitting(true)

        try {
            const submitData = new FormData()
            submitData.append('name', formData.name)
            submitData.append('college', formData.college)
            submitData.append('email', formData.email)
            submitData.append('phone', formData.phone)
            submitData.append('idea', formData.idea)
            submitData.append('utrId', formData.utrId)
            if (formData.screenshot) {
                submitData.append('screenshot', formData.screenshot)
            }

            const response = await fetch('/api/digital-india/submit', {
                method: 'POST',
                body: submitData,
            })

            const result = await response.json()

            if (response.ok && result.success) {
                setIsSubmitted(true)
            } else {
                setApiError(result.message || 'Something went wrong. Please try again.')
            }
        } catch (err) {
            console.error(err)
            setApiError('Network error. Please check your connection and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isMounted) {
        return <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black" />
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center max-w-lg"
                >
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-tr from-blue-900/40 to-indigo-900/40 border border-blue-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                        <CheckCircle className="w-12 h-12 text-blue-400" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Registration <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Successful!</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Thank you, <span className="text-white font-medium">{formData.name}</span>! Your idea and payment details have been submitted successfully. We will verify your transaction and notify you shortly.
                    </p>
                    <Link
                        href="/events"
                        className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Events
                    </Link>
                </motion.div>
            </div>
        )
    }

    // UPI configurations
    const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'c3club@upi'
    const upiAmount = '99'
    const upiName = 'C3 Club'
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${upiAmount}&cu=INR&tn=Digital%20India%20Ideathon`

    const getProviderIntent = (provider: 'gpay' | 'phonepe' | 'paytm') => {
        switch (provider) {
            case 'gpay':
                return `intent://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${upiAmount}&cu=INR&tn=Digital%20India%20Ideathon#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`
            case 'phonepe':
                return `intent://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${upiAmount}&cu=INR&tn=Digital%20India%20Ideathon#Intent;scheme=upi;package=com.phonepe.app;end`
            case 'paytm':
                return `intent://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${upiAmount}&cu=INR&tn=Digital%20India%20Ideathon#Intent;scheme=upi;package=net.one97.paytm;end`
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black">
            {/* Hero Section */}
            <div className="relative h-[45vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/assets/events/digital-india-banner.png"
                        alt="Digital India Innovation Challenge"
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
                    <div className="absolute inset-0 bg-[radial-gradient(#3b82f633_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 text-center px-4 max-w-4xl mx-auto"
                >
                    {/* Back button */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-6"
                    >
                        <Link
                            href="/events"
                            className="inline-flex items-center text-gray-400 hover:text-white transition-colors group text-sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Events
                        </Link>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-4"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-blue-500">
                            Digital India
                        </span>
                        <br />
                        <span className="text-2xl md:text-3xl text-gray-300 font-light">
                            Innovation Challenge
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-4 md:gap-6 text-gray-300 text-sm mt-6"
                    >
                        <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                            July 15, 2026
                        </div>
                        <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            <Clock className="w-4 h-4 mr-2 text-blue-400" />
                            10:00 AM - 4:00 PM IST
                        </div>
                        <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                            SNIST
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Left Column — Event Info */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="lg:col-span-2 space-y-6"
                    >
                        <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Lightbulb className="w-5 h-5 mr-2 text-blue-400" />
                                About the Event
                            </h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Be a part of India's digital transformation! The Digital India Innovation Challenge is a platform for students to pitch bold, tech-driven ideas that can reshape governance, education, healthcare, and public services.
                            </p>
                            <p className="text-gray-400 leading-relaxed text-sm mt-3">
                                Whether it's an AI-powered solution, a cloud-native app, or a FOSS-based initiative — this is your chance to innovate for impact.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-xl font-semibold text-white mb-4">Highlights</h3>
                            <ul className="space-y-3">
                                {[
                                    "Open to All Departments",
                                    "Idea Submission & Pitch Round",
                                    "Mentorship from Industry Experts",
                                    "Exciting Prizes for Winners",
                                    "Focus on Real-World Impact",
                                    "Collaboration with Government Initiatives"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start text-gray-300 text-sm">
                                        <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mr-3">
                                            <CheckCircle className="w-3 h-3 text-blue-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border border-blue-500/20 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold text-white mb-2">💡 Idea Categories</h3>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {["Healthcare", "Education", "Governance", "Agriculture", "Smart Cities", "Fintech", "Sustainability", "Accessibility"].map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-white/5 text-gray-300 text-xs font-medium rounded-full border border-white/10 hover:border-blue-500/30 hover:text-white transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column — Registration Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-3"
                    >
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 shadow-2xl shadow-black/50 backdrop-blur-sm">
                            {/* Step Indicator */}
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Register Now</h2>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {step === 1 ? 'Step 1: Ideathon Details' : 'Step 2: Payment Verification'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 font-mono text-sm">
                                    <span className={`px-2.5 py-1 rounded ${step === 1 ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold' : 'text-gray-500'}`}>1</span>
                                    <ChevronRight className="w-4 h-4 text-gray-700" />
                                    <span className={`px-2.5 py-1 rounded ${step === 2 ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold' : 'text-gray-500'}`}>2</span>
                                </div>
                            </div>

                            {apiError && (
                                <div className="mb-6 p-4 bg-red-950/30 border border-red-500/30 text-red-200 rounded-xl text-sm flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <span>{apiError}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6" id="digital-india-form">
                                <AnimatePresence mode="wait">
                                    {step === 1 ? (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-6"
                                        >
                                            {/* Name */}
                                            <div>
                                                <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                                    <User className="w-4 h-4 mr-2 text-blue-400" />
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter your full name"
                                                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500/50'} text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} transition-all duration-300`}
                                                />
                                                {errors.name && <p className="mt-1.5 text-red-400 text-xs">{errors.name}</p>}
                                            </div>

                                            {/* College */}
                                            <div>
                                                <label htmlFor="college" className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                                    <School className="w-4 h-4 mr-2 text-blue-400" />
                                                    College / Institution
                                                </label>
                                                <input
                                                    type="text"
                                                    id="college"
                                                    name="college"
                                                    value={formData.college}
                                                    onChange={handleChange}
                                                    placeholder="Enter your college name"
                                                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.college ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500/50'} text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${errors.college ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} transition-all duration-300`}
                                                />
                                                {errors.college && <p className="mt-1.5 text-red-400 text-xs">{errors.college}</p>}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                                    <Mail className="w-4 h-4 mr-2 text-blue-400" />
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="your.email@example.com"
                                                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500/50'} text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} transition-all duration-300`}
                                                />
                                                {errors.email && <p className="mt-1.5 text-red-400 text-xs">{errors.email}</p>}
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                                    <Phone className="w-4 h-4 mr-2 text-blue-400" />
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="9876543210"
                                                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500/50'} text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${errors.phone ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} transition-all duration-300`}
                                                />
                                                {errors.phone && <p className="mt-1.5 text-red-400 text-xs">{errors.phone}</p>}
                                            </div>

                                            {/* Idea Description */}
                                            <div>
                                                <label htmlFor="idea" className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                                    <Lightbulb className="w-4 h-4 mr-2 text-blue-400" />
                                                    Your Idea
                                                </label>
                                                <textarea
                                                    id="idea"
                                                    name="idea"
                                                    value={formData.idea}
                                                    onChange={handleChange}
                                                    rows={6}
                                                    placeholder="Describe your innovative idea for Digital India. What problem does it solve? How does it leverage technology? What impact will it create?"
                                                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.idea ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500/50'} text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${errors.idea ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} transition-all duration-300 resize-none`}
                                                />
                                                <div className="flex justify-between mt-1.5">
                                                    {errors.idea && <p className="text-red-400 text-xs">{errors.idea}</p>}
                                                    <p className={`text-xs ml-auto ${formData.idea.length < 50 ? 'text-gray-500' : 'text-blue-400'}`}>
                                                        {formData.idea.length}/50 min characters
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleNextStep}
                                                className="w-full py-4 rounded-xl font-semibold text-white text-lg bg-blue-600 hover:bg-blue-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-[1.02]"
                                            >
                                                Continue to Payment
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-6"
                                        >
                                            {/* Fee Banner */}
                                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="w-5 h-5 text-blue-400" />
                                                    <div>
                                                        <p className="text-white text-sm font-semibold">Registration Fee</p>
                                                        <p className="text-gray-400 text-xs">Ideathon submission</p>
                                                    </div>
                                                </div>
                                                <div className="text-right font-mono">
                                                    <span className="text-2xl font-bold text-white">₹99</span>
                                                </div>
                                            </div>

                                            {/* QR Code Container */}
                                            <div className="text-center py-4 bg-white/5 border border-white/5 rounded-xl">
                                                <p className="text-xs text-gray-400 mb-3">Scan QR code using GPay, PhonePe, Paytm, or BHIM</p>
                                                <div className="relative w-44 h-44 mx-auto border border-blue-500/20 rounded-xl overflow-hidden p-2 bg-black/40">
                                                    <Image
                                                        src="/assets/events/upi-qr.png"
                                                        alt="UPI Payment QR Code"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <p className="text-xs font-mono text-gray-300 mt-3 bg-black/30 py-1.5 px-3 rounded-lg inline-block select-all">
                                                    UPI ID: {upiId}
                                                </p>
                                            </div>

                                            {/* Mobile UPI apps deep link */}
                                            <div className="block md:hidden text-center">
                                                <p className="text-xs text-gray-400 mb-2">Or open directly with mobile payment providers:</p>
                                                <div className="flex justify-center gap-3">
                                                    <a
                                                        href={getProviderIntent('gpay')}
                                                        className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-lg text-xs font-medium text-blue-400 hover:bg-blue-600/20 transition-colors"
                                                    >
                                                        Google Pay
                                                    </a>
                                                    <a
                                                        href={getProviderIntent('phonepe')}
                                                        className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-xs font-medium text-indigo-400 hover:bg-indigo-600/20 transition-colors"
                                                    >
                                                        PhonePe
                                                    </a>
                                                    <a
                                                        href={getProviderIntent('paytm')}
                                                        className="px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-600/20 transition-colors"
                                                    >
                                                        Paytm
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Screenshot upload */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    <Upload className="w-4 h-4 mr-2 inline text-blue-400" />
                                                    Upload Payment Screenshot
                                                </label>
                                                <div className={`relative border-2 border-dashed ${errors.screenshot ? 'border-red-500/50 bg-red-950/5' : 'border-gray-700 hover:border-blue-500/50 bg-white/5'} rounded-xl p-6 text-center transition-all duration-300`}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        id="payment-screenshot"
                                                    />
                                                    {screenshotPreview ? (
                                                        <div className="flex flex-col items-center">
                                                            <div className="relative w-32 h-32 border border-white/10 rounded-lg overflow-hidden mb-2">
                                                                <img
                                                                    src={screenshotPreview}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <p className="text-xs text-blue-400 font-medium">Click or drag to replace</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1">
                                                            <Upload className="mx-auto h-8 w-8 text-gray-500" />
                                                            <p className="text-sm text-gray-300 font-medium">Select file or drag & drop</p>
                                                            <p className="text-xs text-gray-500">PNG, JPG or JPEG up to 5MB</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.screenshot && <p className="mt-1.5 text-red-400 text-xs">{errors.screenshot}</p>}
                                            </div>

                                            {/* UTR input */}
                                            <div>
                                                <label htmlFor="utrId" className="flex items-center text-sm font-medium text-gray-300 mb-2">
                                                    <CreditCard className="w-4 h-4 mr-2 text-blue-400" />
                                                    UTR / Transaction ID
                                                </label>
                                                <input
                                                    type="text"
                                                    id="utrId"
                                                    name="utrId"
                                                    value={formData.utrId}
                                                    onChange={handleChange}
                                                    placeholder="Enter 12-digit UPI Transaction ID"
                                                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.utrId ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500/50'} text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${errors.utrId ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} transition-all duration-300`}
                                                />
                                                {errors.utrId && <p className="mt-1.5 text-red-400 text-xs">{errors.utrId}</p>}
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-4 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={handlePrevStep}
                                                    disabled={isSubmitting}
                                                    className="w-1/3 shrink-0 py-4 rounded-xl font-semibold border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-300 disabled:opacity-50"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className={`flex-1 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                                                        isSubmitting
                                                            ? 'bg-gray-700 cursor-not-allowed'
                                                            : 'bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]'
                                                    }`}
                                                    id="submit-registration"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <RefreshCw className="animate-spin h-5 w-5 text-white" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-5 h-5" />
                                                            Submit Your Idea
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

