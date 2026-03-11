'use client';
import React, { useEffect } from 'react';

const SuccessAnimation: React.FC = () => {
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    // Dynamic import — only loads canvas-confetti when this effect fires
    import('canvas-confetti').then(({ default: confetti }) => {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md text-center shadow-xl transform animate-bounce border border-indigo-500">
        <div className="w-16 h-16 bg-indigo-900 rounded-full mx-auto flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-indigo-300 mt-4">Registration Successful!</h3>
        <p className="text-gray-300 mt-2">Welcome to Cloud Community Club! We're excited to have you join us.</p>
        <p className="text-gray-300 mt-2">You'll receive further details via email soon.</p>
      </div>
    </div>
  );
};

export default SuccessAnimation;
