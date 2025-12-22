"use client";

import { useEffect, useRef, useState } from 'react';

export type AnimationDirection = 'up' | 'down' | 'left' | 'right';
export type AnimationVariant = 'fade' | 'slide' | 'scale' | 'slideScale' | 'rotate';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
    direction?: AnimationDirection;
    variant?: AnimationVariant;
    delay?: number; // in milliseconds
    duration?: number; // in milliseconds
}

export default function ScrollReveal({
    children,
    className = "",
    threshold = 0.1,
    direction = 'up',
    variant = 'slide',
    delay = 0,
    duration = 500  // Faster default for snappier feel
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: threshold,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    const animationClass = `reveal-${variant}-${direction}`;

    return (
        <div
            ref={ref}
            className={`scroll-reveal ${animationClass} ${isVisible ? 'is-visible' : ''} ${className}`}
            style={{
                transitionDelay: `${delay}ms`,
                transitionDuration: `${duration}ms`
            }}
        >
            {children}
        </div>
    );
}
