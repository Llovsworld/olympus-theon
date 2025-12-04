"use client";

import { useRef, useState, MouseEvent } from 'react';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    perspective?: number;
    maxRotation?: number;
    scale?: number;
}

export default function TiltCard({
    children,
    className = "",
    perspective = 1000,
    maxRotation = 5,
    scale = 1.02
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxRotation;
        const rotateY = ((x - centerX) / centerX) * maxRotation;

        setStyle({
            transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
            transition: 'transform 0.1s ease-out'
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
            transition: 'transform 0.5s ease-out'
        });
    };

    return (
        <div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                ...style,
                transformStyle: 'preserve-3d',
                willChange: 'transform'
            }}
        >
            {children}
        </div>
    );
}
