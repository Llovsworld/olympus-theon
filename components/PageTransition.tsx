'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const MINIMUM_TRANSITION_MS = 700;
const TRANSITION_SAFETY_TIMEOUT_MS = 2500;

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isAnimating, setIsAnimating] = useState(false);
    const transitionStartedAt = useRef(0);
    const safetyTimer = useRef<number | null>(null);
    const currentPath = useRef(pathname);

    const startTransition = useCallback(() => {
        transitionStartedAt.current = performance.now();
        setIsAnimating(true);

        if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
        safetyTimer.current = window.setTimeout(() => {
            transitionStartedAt.current = 0;
            setIsAnimating(false);
            safetyTimer.current = null;
        }, TRANSITION_SAFETY_TIMEOUT_MS);
    }, []);

    useEffect(() => {
        currentPath.current = pathname;
        if (!transitionStartedAt.current) return;

        const elapsed = performance.now() - transitionStartedAt.current;
        const remaining = Math.max(0, MINIMUM_TRANSITION_MS - elapsed);

        const timer = window.setTimeout(() => {
            transitionStartedAt.current = 0;
            setIsAnimating(false);
        }, remaining);

        if (safetyTimer.current) {
            window.clearTimeout(safetyTimer.current);
            safetyTimer.current = null;
        }

        return () => window.clearTimeout(timer);
    }, [pathname]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey ||
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) return;

            const target = e.target;
            if (!(target instanceof Element)) return;

            const link = target.closest<HTMLAnchorElement>('a[href]');
            if (!link || link.target || link.download) return;

            const url = new URL(link.href);
            const currentUrl = new URL(window.location.href);
            const changesRoute = url.pathname !== currentUrl.pathname;

            if (url.origin !== currentUrl.origin || !changesRoute) return;

            // Start the visual transition without delaying Next.js navigation.
            // Data loading and the animation can now happen concurrently.
            startTransition();
        };

        document.addEventListener('click', handleClick, true);
        return () => {
            document.removeEventListener('click', handleClick, true);
            if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
        };
    }, [startTransition]);

    useEffect(() => {
        const handleHistoryNavigation = () => {
            if (
                window.location.pathname !== currentPath.current &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) {
                startTransition();
            }
        };

        window.addEventListener('popstate', handleHistoryNavigation);
        return () => window.removeEventListener('popstate', handleHistoryNavigation);
    }, [startTransition]);

    return (
        <>
            {/* Page transition overlay with circular wipe */}
            <div className={`page-transition-overlay ${isAnimating ? 'active' : ''}`} aria-hidden="true">
                <div className="page-transition-content">
                    <div className="page-transition-line left"></div>
                    <div className="page-transition-logo-wrapper">
                        <div className="page-transition-logo">OLYMPUS THEON</div>
                        <div className="page-transition-underline"></div>
                    </div>
                    <div className="page-transition-line right"></div>
                </div>
                <div className="page-transition-circle"></div>
            </div>

            {/* Main content with fade and blur */}
            <div className={`page-content ${isAnimating ? 'exiting' : ''}`}>
                {children}
            </div>
        </>
    );
}
