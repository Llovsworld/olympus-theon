'use client';

import { useState } from 'react';

export default function FooterNewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
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
                setMessage('Ya formas parte de la élite.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Error al suscribirse.');
            }
        } catch {
            setStatus('error');
            setMessage('Error de conexión.');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="footer-newsletter-form">
            <div className="footer-newsletter-input-group">
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
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
    );
}
