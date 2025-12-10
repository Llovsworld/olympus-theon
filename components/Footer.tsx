'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

        setStatus('loading');
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setStatus('success');
                setMessage('Bienvenido a la élite.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Error al suscribirse.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Error de conexión.');
        }
    }

    return (
        <footer className="footer-compact">
            <div className="container">
                <div className="footer-main">
                    {/* Column 1: Logo + Description + Social Icons */}
                    <div className="footer-brand-col">
                        <div className="footer-logo">OLYMPUS THEON</div>
                        <p className="footer-tagline">
                            Transformando visiones en realidades mediante estrategias precisas y ejecución impecable.
                            Excelencia a través de metodología.
                        </p>
                        <div className="footer-social-icons">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="mailto:contacto@olympustheon.com" className="footer-social-link" aria-label="Email">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                            <a href="https://wa.me/34608961701" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="WhatsApp">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Empresa */}
                    <div className="footer-links-col">
                        <h4 className="footer-col-title">EMPRESA</h4>
                        <nav className="footer-nav-list">
                            <Link href="/#story">Sobre Nosotros</Link>
                            <Link href="/programas">Portfolio</Link>
                            <Link href="/#method">Metodología</Link>
                            <Link href="/blog">Blog</Link>
                        </nav>
                    </div>

                    {/* Column 3: Servicios */}
                    <div className="footer-links-col">
                        <h4 className="footer-col-title">SERVICIOS</h4>
                        <nav className="footer-nav-list">
                            <Link href="/programas">Estrategia Digital</Link>
                            <Link href="/programas">Identidad de Marca</Link>
                            <Link href="/programas">Desarrollo Web</Link>
                            <Link href="/contact">Consultoría</Link>
                        </nav>
                    </div>

                    {/* Column 4: Legal */}
                    <div className="footer-links-col">
                        <h4 className="footer-col-title">LEGAL</h4>
                        <nav className="footer-nav-list">
                            <Link href="/privacy">Política de Privacidad</Link>
                            <Link href="/terms">Términos de Servicio</Link>
                            <Link href="/privacy">Accesibilidad</Link>
                            <Link href="/privacy">Cookies</Link>
                        </nav>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="footer-newsletter">
                    <div className="footer-newsletter-content">
                        <div className="footer-newsletter-text">
                            <h4 className="footer-newsletter-title">Únete a la Élite</h4>
                            <p className="footer-newsletter-subtitle">Protocolos mentales y físicos. Sin spam.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="footer-newsletter-form">
                            <div className="footer-newsletter-input-group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="footer-newsletter-input"
                                    disabled={status === 'loading'}
                                />
                                <button
                                    type="submit"
                                    className="footer-newsletter-btn"
                                    disabled={status === 'loading'}
                                    aria-label="Suscribirse"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </div>
                            {message && <p className={`footer-newsletter-message ${status}`}>{message}</p>}
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="footer-bottom-compact">
                    <p className="footer-copyright">© {new Date().getFullYear()} Olympus Theon. Todos los derechos reservados.</p>
                    <div className="footer-contact-info">
                        <a href="mailto:contacto@olympustheon.com" className="footer-contact-link">contacto@olympustheon.com</a>
                        <a href="tel:+34608961701" className="footer-contact-link">+34 608 961 701</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
