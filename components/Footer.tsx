'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

import { Link } from '@/i18n/navigation';

export default function Footer() {
    const locale = useLocale() === 'en' ? 'en' : 'es';
    const isEnglish = locale === 'en';
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage(isEnglish ? 'Please enter a valid email address.' : 'Introduce un correo electrónico válido.');
            return;
        }

        setStatus('loading');
        setMessage('');
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setStatus('success');
                setMessage(isEnglish ? 'Welcome to the elite.' : 'Bienvenido a la élite.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || (isEnglish ? 'Subscription failed.' : 'Error al suscribirse.'));
            }
        } catch {
            setStatus('error');
            setMessage(isEnglish ? 'Connection error.' : 'Error de conexión.');
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
                            {isEnglish
                                ? 'Turning visions into reality through precise strategy and flawless execution. Excellence through methodology.'
                                : 'Transformando visiones en realidades mediante estrategias precisas y ejecución impecable. Excelencia a través de metodología.'}
                        </p>
                        <div className="footer-social-icons">
                            <a href="https://www.instagram.com/llovsworld/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="https://x.com/OlympusTheon" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X (Twitter)">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://substack.com/@olympustheon" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Substack">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@OlympusTheon" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="YouTube">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a href="mailto:Olympustheon@gmail.com" className="footer-social-link" aria-label="Email">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </a>
                            <a href="https://wa.me/34608961701" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="WhatsApp">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="footer-links-col">
                        <h4 className="footer-col-title">{isEnglish ? 'NAVIGATION' : 'NAVEGACIÓN'}</h4>
                        <nav className="footer-nav-list">
                            <Link href="/blog">Blog</Link>
                            <Link href="/books">{isEnglish ? 'Books' : 'Libros'}</Link>
                            <Link href="/programas">{isEnglish ? 'Programs' : 'Programas'}</Link>
                            <Link href="/contact">{isEnglish ? 'Contact' : 'Contacto'}</Link>
                        </nav>
                    </div>

                    {/* Column 3: Contenido */}
                    <div className="footer-links-col">
                        <h4 className="footer-col-title">{isEnglish ? 'CONTENT' : 'CONTENIDO'}</h4>
                        <nav className="footer-nav-list">
                            <Link href="/#method">{isEnglish ? 'Method' : 'Metodología'}</Link>
                            <a href="#newsletter">Newsletter</a>
                        </nav>
                    </div>

                    <div className="footer-links-col">
                        <h4 className="footer-col-title">{isEnglish ? 'CONTACT' : 'CONTACTO'}</h4>
                        <div className="footer-nav-list">
                            <a href="mailto:Olympustheon@gmail.com">Email</a>
                            <a href="tel:+34608961701">{isEnglish ? 'Phone' : 'Teléfono'}</a>
                            <a href="https://wa.me/34608961701" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="footer-newsletter" id="newsletter">
                    <div className="footer-newsletter-content">
                        <div className="footer-newsletter-text">
                            <h4 className="footer-newsletter-title">{isEnglish ? 'Join the Elite' : 'Únete a la Élite'}</h4>
                            <p className="footer-newsletter-subtitle">
                                {isEnglish ? 'Mental and physical protocols. No spam.' : 'Protocolos mentales y físicos. Sin spam.'}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="footer-newsletter-form">
                            <label
                                htmlFor="footer-newsletter-email"
                                style={{
                                    position: 'absolute',
                                    width: '1px',
                                    height: '1px',
                                    padding: 0,
                                    margin: '-1px',
                                    overflow: 'hidden',
                                    clip: 'rect(0, 0, 0, 0)',
                                    whiteSpace: 'nowrap',
                                    border: 0,
                                }}
                            >
                                {isEnglish ? 'Email address' : 'Correo electrónico'}
                            </label>
                            <div className="footer-newsletter-input-group">
                                <input
                                    id="footer-newsletter-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={isEnglish ? 'you@email.com' : 'tu@email.com'}
                                    className="footer-newsletter-input"
                                    disabled={status === 'loading'}
                                    required
                                    autoComplete="email"
                                    aria-label={isEnglish ? 'Email address' : 'Correo electrónico'}
                                    aria-invalid={status === 'error'}
                                    aria-describedby={message ? 'footer-newsletter-status' : undefined}
                                />
                                <button
                                    type="submit"
                                    className="footer-newsletter-btn"
                                    disabled={status === 'loading'}
                                    aria-label={isEnglish ? 'Subscribe' : 'Suscribirse'}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </div>
                            <p
                                id="footer-newsletter-status"
                                className={`footer-newsletter-message ${status}`}
                                role={status === 'error' ? 'alert' : 'status'}
                                aria-live="polite"
                                style={{ display: message ? 'block' : 'none' }}
                            >
                                {message}
                            </p>
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="footer-bottom-compact">
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} Olympus Theon. {isEnglish ? 'All rights reserved.' : 'Todos los derechos reservados.'}
                    </p>
                    <div className="footer-contact-info">
                        <a href="mailto:Olympustheon@gmail.com" className="footer-contact-link">Olympustheon@gmail.com</a>
                        <a href="tel:+34608961701" className="footer-contact-link">+34 608 961 701</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
