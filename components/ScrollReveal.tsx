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

interface ObserverPool {
    observer: IntersectionObserver;
    callbacks: Map<Element, () => void>;
}

const observerPools = new Map<number, ObserverPool>();

function getObserverPool(threshold: number): ObserverPool {
    const existingPool = observerPools.get(threshold);
    if (existingPool) return existingPool;

    const callbacks = new Map<Element, () => void>();
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) callbacks.get(entry.target)?.();
            }
        },
        { threshold, rootMargin: '0px 0px -50px 0px' }
    );
    const pool = { observer, callbacks };
    observerPools.set(threshold, pool);
    return pool;
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
        const element = ref.current;
        if (!element) return;

        const pool = getObserverPool(threshold);
        const reveal = () => {
            setIsVisible(true);
            pool.observer.unobserve(element);
            pool.callbacks.delete(element);
        };

        pool.callbacks.set(element, reveal);
        pool.observer.observe(element);

        return () => {
            pool.observer.unobserve(element);
            pool.callbacks.delete(element);
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
            suppressHydrationWarning
        >
            {children}
        </div>
    );
}
