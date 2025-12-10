'use client';

import { useEffect, useState, useCallback } from 'react';

interface ReadingProgressProps {
    totalReadingTime?: number; // Total reading time in minutes
}

export default function ReadingProgress({ totalReadingTime = 5 }: ReadingProgressProps) {
    const [progress, setProgress] = useState(0);
    const [remainingTime, setRemainingTime] = useState(totalReadingTime);
    const [isVisible, setIsVisible] = useState(false);

    const updateProgress = useCallback(() => {
        const currentProgress = window.scrollY;
        const scrollHeight = document.body.scrollHeight - window.innerHeight;

        if (scrollHeight > 0) {
            const percentage = Math.min((currentProgress / scrollHeight) * 100, 100);
            setProgress(percentage);

            // Calculate remaining time based on progress
            const remaining = Math.ceil(totalReadingTime * (1 - percentage / 100));
            setRemainingTime(remaining);

            // Show indicator only when scrolled past hero section
            setIsVisible(currentProgress > 200);
        }
    }, [totalReadingTime]);

    useEffect(() => {
        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial call
        return () => window.removeEventListener('scroll', updateProgress);
    }, [updateProgress]);

    return (
        <>
            {/* Top Progress Bar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                zIndex: 9999,
                background: 'rgba(255, 255, 255, 0.05)'
            }}>
                <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                    width: `${progress}%`,
                    transition: 'width 0.15s ease-out',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)'
                }} />
            </div>

            {/* Floating Reading Time Indicator */}
            <div style={{
                position: 'fixed',
                bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
                right: '1rem',
                background: 'rgba(10, 10, 10, 0.95)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                borderRadius: '50px',
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                zIndex: 9998,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                pointerEvents: isVisible ? 'auto' : 'none',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                maxWidth: 'calc(100vw - 2rem)'
            }}>
                {/* Circular Progress */}
                <div style={{
                    width: '40px',
                    height: '40px',
                    position: 'relative'
                }}>
                    <svg width="40" height="40" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)' }}>
                        {/* Background circle */}
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="3"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke="#FFD700"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 16}`}
                            strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
                            style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
                        />
                    </svg>
                    {/* Percentage in center */}
                    <span style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: '#FFD700'
                    }}>
                        {Math.round(progress)}%
                    </span>
                </div>

                {/* Time remaining */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.1rem'
                }}>
                    <span style={{
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: '#666'
                    }}>
                        {progress >= 100 ? 'Completado' : 'Tiempo restante'}
                    </span>
                    <span style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#fff'
                    }}>
                        {progress >= 100 ? '✓' : `${remainingTime} min`}
                    </span>
                </div>
            </div>
        </>
    );
}
