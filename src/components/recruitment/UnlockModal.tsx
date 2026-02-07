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
                    {/* Holographic Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-neutral-900/95 border border-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-md"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-sm tracking-widest uppercase mb-2 title-main">
                                Identity Verification Required
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Complete verification to access classified challenges
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b border-gray-700 bg-transparent text-white py-3 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-700"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">
                                    College Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b border-gray-700 bg-transparent text-white py-3 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-700"
                                    placeholder="you@college.edu"
                                />
                            </div>

                            <div>
                                <label htmlFor="mobile" className="block text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b border-gray-700 bg-transparent text-white py-3 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-700"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold uppercase tracking-widest py-4 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-900/20 mt-8"
                            >
                                Unlock Challenge
                            </button>
                        </form>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
