"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const scrolledRef = useRef(false);

    useEffect(() => {
        let animationFrame = 0;

        const updateHeader = () => {
            animationFrame = 0;
            const currentScrollY = window.scrollY;
            const nextScrolled = currentScrollY > 50;

            if (nextScrolled !== scrolledRef.current) {
                scrolledRef.current = nextScrolled;
                setScrolled(nextScrolled);
            }

            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = windowHeight > 0 ? (currentScrollY / windowHeight) * 100 : 0;
            if (progressBarRef.current) {
                progressBarRef.current.style.width = `${Math.min(100, Math.max(0, progress))}%`;
            }
        };

        const handleScroll = () => {
            if (!animationFrame) {
                animationFrame = window.requestAnimationFrame(updateHeader);
            }
        };

        updateHeader();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
        };
    }, [pathname]);

    // Close mobile menu when route changes
    useEffect(() => {
        const animationFrame = window.requestAnimationFrame(() => setMenuOpen(false));
        return () => window.cancelAnimationFrame(animationFrame);
    }, [pathname]);

    // Helper to check if a route is active (accounting for locale)
    const isActive = (route: string) => {
        return pathname.includes(route);
    };

    const headerClasses = ['header'];
    if (scrolled) {
        headerClasses.push('scrolled', 'compact');
    }

    return (
        <>
            <header className={headerClasses.join(' ')}>
                {/* Reading Progress Bar */}
                <div
                    ref={progressBarRef}
                    className="reading-progress-bar"
                    style={{ width: '0%' }}
                />

                <div className="container header-content-centered">
                    {/* Hamburger Button (mobile only) */}
                    <button
                        className="hamburger-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                    </button>

                    {/* Desktop Nav Left */}
                    <nav className="nav-left desktop-nav">
                        <Link href="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`}>Blog</Link>
                        <Link href="/books" className={`nav-link ${isActive('/books') ? 'active' : ''}`}>Libros</Link>
                    </nav>

                    {/* Logo */}
                    <div className="logo-wrapper">
                        <Link href="/" className="logo-centered">OLYMPUS THEON</Link>
                        <span className="header-tagline">Trust the process</span>
                    </div>

                    {/* Desktop Nav Right */}
                    <nav className="nav-right desktop-nav">
                        <Link href="/programas" className={`nav-link ${isActive('/programas') ? 'active' : ''}`}>Programas</Link>
                        <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contacto</Link>
                    </nav>
                </div>
            </header>

            {/* Mobile Nav Overlay */}
            <div className={`mobile-nav-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
                <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
                    <Link href="/blog" className={`mobile-nav-link ${isActive('/blog') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Blog</Link>
                    <Link href="/books" className={`mobile-nav-link ${isActive('/books') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Libros</Link>
                    <Link href="/programas" className={`mobile-nav-link ${isActive('/programas') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Programas</Link>
                    <Link href="/contact" className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Contacto</Link>
                </nav>
            </div>
        </>
    );
}
