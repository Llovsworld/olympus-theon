"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to check if a route is active (accounting for locale)
    const isActive = (route: string) => {
        return pathname.includes(route);
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-content">
                <Link href="/" className="logo">OLYMPUS THEON</Link>
                <nav className="nav">
                    <Link href="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`}>Blog</Link>
                    <Link href="/books" className={`nav-link ${isActive('/books') ? 'active' : ''}`}>Libros</Link>
                    <Link href="/programas" className={`nav-link ${isActive('/programas') ? 'active' : ''}`}>Programas</Link>
                    <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contacto</Link>
                </nav>
            </div>
        </header>
    );
}
