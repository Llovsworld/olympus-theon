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
        <footer className="footer-premium">
            {/* Subtle Light Separator */}
            <div className="footer-separator" />

            <div className="container">
                <div className="footer-grid">
                    {/* Column 1: EXPLORAR */}
                    <div className="footer-col">
                        <h4 className="footer-heading">EXPLORAR</h4>
                        <nav className="footer-nav">
                            <Link href="/programas" className="footer-link">Programas</Link>
                            <Link href="/blog" className="footer-link">Blog</Link>
                            <Link href="/books" className="footer-link">Libros</Link>
                            <Link href="/#story" className="footer-link">Manifiesto</Link>
                        </nav>
                    </div>

                    {/* Column 2: NEWSLETTER */}
                    <div className="footer-col center-col">
                        <h4 className="footer-heading">ÚNETE A LA ÉLITE</h4>
                        <p className="footer-subtext">
                            Protocolos mentales y físicos. Sin spam.
                        </p>
                        <form onSubmit={handleSubmit} className="footer-form-premium">
                            <div className="input-underline-group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="footer-input-underline"
                                    disabled={status === 'loading'}
                                />
                                <button type="submit" className="footer-arrow-btn" disabled={status === 'loading'} aria-label="Suscribirse">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </div>
                            {message && <p className={`footer-message ${status}`}>{message}</p>}
                        </form>
                    </div>

                    {/* Column 3: SOCIAL + LEGAL */}
                    <div className="footer-col right-col">
                        <h4 className="footer-heading">CONEXIÓN</h4>
                        <div className="social-icons-premium">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="YouTube">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                </svg>
                            </a>
                        </div>
                        <div className="footer-legal">
                            <Link href="/privacy">Privacidad</Link>
                            <Link href="/terms">Términos</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} OLYMPUS THEON.</p>
                </div>
            </div>
        </footer>
    );
}
