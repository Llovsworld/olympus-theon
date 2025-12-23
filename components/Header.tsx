"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Mark component as mounted to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // Scrolled styling - header always visible
            setScrolled(currentScrollY > 50);

            // Calculate scroll progress
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = windowHeight > 0 ? (currentScrollY / windowHeight) * 100 : 0;
            setScrollProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Helper to check if a route is active (accounting for locale)
    const isActive = (route: string) => {
        return pathname.includes(route);
    };

    // Build class names only after mount to avoid hydration mismatch
    const headerClasses = ['header'];
    if (mounted && scrolled) {
        headerClasses.push('scrolled', 'compact');
    }

    return (
        <>
            <header className={headerClasses.join(' ')}>
                {/* Reading Progress Bar */}
                <div
                    className="reading-progress-bar"
                    style={{ width: mounted ? `${scrollProgress}%` : '0%' }}
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
