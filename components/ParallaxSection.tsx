"use client";

import { useEffect, useRef, useState } from 'react';

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
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const parallaxOffset = (scrollPercent - 0.5) * 100 * speed;

            setOffset(parallaxOffset);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial calculation

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [speed]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                transform: `translateY(${offset}px)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            {children}
        </div>
    );
}
