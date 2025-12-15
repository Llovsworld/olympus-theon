"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Scrolled styling
            setScrolled(currentScrollY > 50);

            // Hide/Show logic
            if (currentScrollY > lastScrollY && currentScrollY > 80) { // Scrolling down & passed threshold
                setIsVisible(false);
            } else { // Scrolling up
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Close mobile menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Helper to check if a route is active (accounting for locale)
    const isActive = (route: string) => {
        return pathname.includes(route);
    };

    return (
        <>
            <header className={`header ${scrolled ? 'scrolled' : ''} ${!isVisible ? 'header-hidden' : ''}`}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
