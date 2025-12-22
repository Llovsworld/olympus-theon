'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);

    useEffect(() => {
        // Start exit animation
        setIsAnimating(true);

        // Wait for animation, then update content - faster timing
        const timer = setTimeout(() => {
            setDisplayChildren(children);
            setIsAnimating(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [pathname, children]);

    // Intercept link clicks globally
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href && !link.target && !link.download) {
                const url = new URL(link.href);
                // Only intercept same-origin links
                if (url.origin === window.location.origin && url.pathname !== pathname) {
                    // Prevent default navigation immediately
                    e.preventDefault();
                    e.stopPropagation();

                    // Start animation
                    setIsAnimating(true);

                    // Navigate after shorter delay for snappier feel
                    setTimeout(() => {
                        router.push(url.pathname + url.search + url.hash);
                    }, 300);
                }
            }
        };

        // Use capture phase to intercept before Next.js Link
        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, [pathname, router]);

    return (
        <>
            {/* Page transition overlay with circular wipe */}
            <div className={`page-transition-overlay ${isAnimating ? 'active' : ''}`}>
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
                {displayChildren}
            </div>
        </>
    );
}

