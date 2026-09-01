'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import { legalPublic } from '@/lib/legal-public';

export default function FooterNewsletterForm() {
    const [email, setEmail] = useState('');
    const [consentAccepted, setConsentAccepted] = useState(false);
    const [website, setWebsite] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    consentAccepted,
                    privacyAccepted: consentAccepted,
                    source: 'footer',
                    website,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                setStatus('error');
                setMessage(data.error || 'No hemos podido iniciar la suscripción.');
                return;
            }

            setStatus('success');
            setMessage(data.message);
            setEmail('');
            setConsentAccepted(false);
            setWebsite('');
        } catch {
            setStatus('error');
            setMessage('Error de conexión. Inténtalo de nuevo más tarde.');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="footer-newsletter-form">
            <div className="form-honeypot" aria-hidden="true">
                <label htmlFor="footer-newsletter-website">No rellenes este campo</label>
                <input
                    id="footer-newsletter-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                />
            </div>

            <label className="sr-only" htmlFor="footer-newsletter-email">Correo electrónico</label>
            <div className="footer-newsletter-input-group">
                <input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="tu@email.com"
                    className="footer-newsletter-input"
                    disabled={status === 'loading'}
                    required
                    maxLength={254}
                    autoComplete="email"
                    inputMode="email"
                />
                <button
                    type="submit"
                    className="footer-newsletter-btn"
                    disabled={status === 'loading'}
                    aria-label="Solicitar suscripción"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>
            </div>

            <label className="form-consent-row form-consent-row--compact">
                <input
                    type="checkbox"
                    required
                    checked={consentAccepted}
                    onChange={(event) => setConsentAccepted(event.target.checked)}
                />
                <span>
                    Quiero recibir artículos y novedades por correo. Responsable: {legalPublic.responsibleName}.
                    Base: mi consentimiento. Proveedores técnicos: Vercel, Neon y Resend, con posibles transferencias
                    explicadas en la <Link href="/privacidad">Política de privacidad</Link>. Puedo retirar el
                    consentimiento y ejercer mis derechos escribiendo a{' '}
                    <a href={`mailto:${legalPublic.email}`}>{legalPublic.email}</a>.
                </span>
            </label>

            <div className="form-status-slot" aria-live="polite" aria-atomic="true">
                {message ? (
                    <p className={`footer-newsletter-message ${status}`} role={status === 'error' ? 'alert' : 'status'}>
                        {message}
                    </p>
                ) : null}
            </div>
        </form>
    );
}
