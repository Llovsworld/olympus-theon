"use client";

import { useEffect, useRef } from 'react';

interface ParallaxSectionProps {
    children: React.ReactNode;
    speed?: number; // 0.1 to 1, lower is slower
    className?: string;
}

export default function ParallaxSection({
    children,
    speed = 0.5,
    className = ""
}: ParallaxSectionProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrame = 0;

        const updatePosition = () => {
            animationFrame = 0;
            const element = ref.current;
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const parallaxOffset = (scrollPercent - 0.5) * 100 * speed;

            element.style.transform = `translateY(${parallaxOffset}px)`;
        };

        const handleScroll = () => {
            if (!animationFrame) {
                animationFrame = window.requestAnimationFrame(updatePosition);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updatePosition();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
        };
    }, [speed]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                transform: 'translateY(0px)',
                transition: 'transform 0.1s ease-out'
            }}
        >
            {children}
        </div>
    );
}
