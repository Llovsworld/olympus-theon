'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type ConfirmationStatus = 'loading' | 'success' | 'error';

export default function ConfirmSubscriptionForm() {
    const started = useRef(false);
    const [status, setStatus] = useState<ConfirmationStatus>('loading');
    const [message, setMessage] = useState('Estamos verificando tu suscripción…');

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        const params = new URLSearchParams(window.location.hash.slice(1));
        const token = params.get('token') || '';
        window.history.replaceState(null, '', window.location.pathname);

        void (async () => {
            if (!token) {
                setStatus('error');
                setMessage('El enlace de confirmación no es válido o está incompleto.');
                return;
            }

            try {
                const response = await fetch('/api/subscribe/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });
                const data = await response.json();

                if (!response.ok) {
                    setStatus('error');
                    setMessage(data.error || 'No hemos podido confirmar la suscripción.');
                    return;
                }

                setStatus('success');
                setMessage(data.message || 'Suscripción confirmada correctamente.');
            } catch {
                setStatus('error');
                setMessage('No hemos podido conectar con el servicio. Inténtalo de nuevo más tarde.');
            }
        })();
    }, []);

    return (
        <section className={`legal-action-panel legal-action-panel--${status}`} aria-live="polite" aria-atomic="true">
            <p className="legal-action-eyebrow">Newsletter Olympus Theon</p>
            <h1>{status === 'success' ? 'Suscripción confirmada' : status === 'error' ? 'No se pudo confirmar' : 'Confirmando…'}</h1>
            <p role={status === 'error' ? 'alert' : 'status'}>{message}</p>
            <div className="legal-action-links">
                <Link href="/">Volver al inicio</Link>
                {status === 'error' ? <Link href="/#newsletter">Solicitar un enlace nuevo</Link> : null}
            </div>
        </section>
    );
}
