"use client";

import { useLocale } from 'next-intl';
import { useState, useEffect, useRef } from 'react';

import { Link, usePathname } from '@/i18n/navigation';

const labels = {
    es: {
        blog: 'Blog',
        books: 'Libros',
        programs: 'Programas',
        contact: 'Contacto',
        tagline: 'Confía en el proceso',
        openMenu: 'Abrir menú',
        closeMenu: 'Cerrar menú',
        navigation: 'Navegación principal',
        mobileNavigation: 'Navegación móvil',
        language: 'Idioma',
        skip: 'Saltar al contenido principal',
    },
    en: {
        blog: 'Blog',
        books: 'Books',
        programs: 'Programs',
        contact: 'Contact',
        tagline: 'Trust the process',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        navigation: 'Main navigation',
        mobileNavigation: 'Mobile navigation',
        language: 'Language',
        skip: 'Skip to main content',
    },
} as const;

export default function Header() {
    const pathname = usePathname();
    const locale = useLocale() === 'en' ? 'en' : 'es';
    const t = labels[locale];
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const mobileOverlayRef = useRef<HTMLDivElement>(null);
    const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

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

        const animationFrame = window.requestAnimationFrame(handleScroll);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!menuOpen) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
                return;
            }

            if (event.key === 'Tab') {
                const overlayLinks = Array.from(
                    mobileOverlayRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []
                );
                const focusableElements = [menuButtonRef.current, ...overlayLinks].filter(
                    (element): element is HTMLElement => Boolean(element)
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements.at(-1);

                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement?.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);
        const focusFrame = window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus());

        return () => {
            window.cancelAnimationFrame(focusFrame);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [menuOpen]);

    useEffect(() => {
        const desktopQuery = window.matchMedia('(min-width: 769px)');
        const closeOnDesktop = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setMenuOpen(false);
            }
        };

        desktopQuery.addEventListener('change', closeOnDesktop);
        return () => desktopQuery.removeEventListener('change', closeOnDesktop);
    }, []);

    // Helper to check if a route is active (accounting for locale)
    const isActive = (route: string) => {
        return pathname === route || pathname.startsWith(`${route}/`);
    };

    const headerClasses = ['header'];
    if (scrolled) {
        headerClasses.push('scrolled', 'compact');
    }

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <a className="skip-link" href="#main-content">{t.skip}</a>
            <header className={headerClasses.join(' ')}>
                {/* Reading Progress Bar */}
                <div
                    className="reading-progress-bar"
                    style={{ width: `${scrollProgress}%` }}
                    role="progressbar"
                    aria-label={locale === 'es' ? 'Progreso de la página' : 'Page progress'}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(scrollProgress)}
                />

                <div className="container header-content-centered">
                    {/* Hamburger Button (mobile only) */}
                    <button
                        ref={menuButtonRef}
                        className="hamburger-btn"
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={menuOpen ? t.closeMenu : t.openMenu}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                    >
                        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                    </button>

                    {/* Desktop Nav Left */}
                    <nav className="nav-left desktop-nav" aria-label={`${t.navigation}: ${t.blog}, ${t.books}`}>
                        <Link href="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`} aria-current={isActive('/blog') ? 'page' : undefined}>{t.blog}</Link>
                        <Link href="/books" className={`nav-link ${isActive('/books') ? 'active' : ''}`} aria-current={isActive('/books') ? 'page' : undefined}>{t.books}</Link>
                    </nav>

                    {/* Logo */}
                    <div className="logo-wrapper">
                        <Link href="/" className="logo-centered">OLYMPUS THEON</Link>
                        <span className="header-tagline">{t.tagline}</span>
                    </div>

                    {/* Desktop Nav Right */}
                    <nav className="nav-right desktop-nav" aria-label={`${t.navigation}: ${t.programs}, ${t.contact}`}>
                        <Link href="/programas" className={`nav-link ${isActive('/programas') ? 'active' : ''}`} aria-current={isActive('/programas') ? 'page' : undefined}>{t.programs}</Link>
                        <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`} aria-current={isActive('/contact') ? 'page' : undefined}>{t.contact}</Link>
                    </nav>
                </div>
            </header>

            {/* Mobile Nav Overlay */}
            <div
                ref={mobileOverlayRef}
                id="mobile-navigation"
                className={`mobile-nav-overlay ${menuOpen ? 'open' : ''}`}
                onClick={() => {
                    closeMenu();
                    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
                }}
                role={menuOpen ? 'dialog' : undefined}
                aria-modal={menuOpen ? true : undefined}
                aria-label={menuOpen ? t.mobileNavigation : undefined}
                aria-hidden={!menuOpen}
                inert={!menuOpen}
            >
                <nav className="mobile-nav" aria-label={t.mobileNavigation} onClick={(e) => e.stopPropagation()}>
                    <Link ref={firstMobileLinkRef} href="/blog" className={`mobile-nav-link ${isActive('/blog') ? 'active' : ''}`} aria-current={isActive('/blog') ? 'page' : undefined} onClick={closeMenu}>{t.blog}</Link>
                    <Link href="/books" className={`mobile-nav-link ${isActive('/books') ? 'active' : ''}`} aria-current={isActive('/books') ? 'page' : undefined} onClick={closeMenu}>{t.books}</Link>
                    <Link href="/programas" className={`mobile-nav-link ${isActive('/programas') ? 'active' : ''}`} aria-current={isActive('/programas') ? 'page' : undefined} onClick={closeMenu}>{t.programs}</Link>
                    <Link href="/contact" className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`} aria-current={isActive('/contact') ? 'page' : undefined} onClick={closeMenu}>{t.contact}</Link>
                </nav>
            </div>
        </>
    );
}
