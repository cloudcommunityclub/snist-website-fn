'use client';

import { useState } from 'react';
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

    if (!isOpen) return null;

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
        <div>
            <div>
                <h2>Unlock Challenge</h2>
                <button onClick={onClose}>Close</button>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email">College Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="mobile">Mobile</label>
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">Unlock Challenge</button>
                </form>
            </div>
        </div>
    );
}
