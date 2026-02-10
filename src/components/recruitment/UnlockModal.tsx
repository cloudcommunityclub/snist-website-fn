'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate } from '@/types/recruitment';

interface UnlockModalProps {
    isOpen: boolean;
    onUnlock: (data: Candidate) => void;
    onClose: () => void;
}

export default function UnlockModal({ isOpen, onUnlock, onClose }: UnlockModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUnlock({
            ...formData,
            isVerified: false,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-[#0a0a0a] border border-white/[0.06] rounded-2xl shadow-2xl p-8 backdrop-blur-md relative"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">Identity Verification</span>
                            </div>
                            <h2 className="font-bold text-white text-lg tracking-tight title-main mb-2">
                                Verify to Continue
                            </h2>
                            <p className="text-gray-500 text-sm font-light">
                                Complete verification to access classified challenges
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-white/30 text-xs uppercase tracking-widest mb-2 font-mono">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b border-white/[0.06] bg-transparent text-white py-3 focus:border-cyan-400/50 outline-none transition-colors duration-300 placeholder:text-white/15"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-white/30 text-xs uppercase tracking-widest mb-2 font-mono">
                                    College Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b border-white/[0.06] bg-transparent text-white py-3 focus:border-cyan-400/50 outline-none transition-colors duration-300 placeholder:text-white/15"
                                    placeholder="you@college.edu"
                                />
                            </div>

                            <div>
                                <label htmlFor="mobile" className="block text-white/30 text-xs uppercase tracking-widest mb-2 font-mono">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b border-white/[0.06] bg-transparent text-white py-3 focus:border-cyan-400/50 outline-none transition-colors duration-300 placeholder:text-white/15"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl hover:bg-cyan-400/10 hover:border-cyan-500/30 hover:text-cyan-400 hover:shadow-[0_0_20px_-6px_rgba(6,182,212,0.2)] transition-all duration-300 mt-8"
                            >
                                Unlock Challenge
                            </button>
                        </form>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 text-white/20 hover:text-cyan-400 transition-colors duration-300 text-sm"
                        >
                            ✕
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
