'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type UnsubscribeStatus = 'loading' | 'success' | 'error';

export default function UnsubscribeForm() {
    const started = useRef(false);
    const [status, setStatus] = useState<UnsubscribeStatus>('loading');
    const [message, setMessage] = useState('Estamos procesando tu solicitud…');

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        const params = new URLSearchParams(window.location.hash.slice(1));
        const subscriberId = params.get('subscriber') || '';
        const token = params.get('token') || '';
        window.history.replaceState(null, '', window.location.pathname);

        void (async () => {
            if (!subscriberId || !token) {
                setStatus('error');
                setMessage('Abre el enlace de baja incluido en uno de nuestros correos.');
                return;
            }

            try {
                const response = await fetch('/api/unsubscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subscriberId, token }),
                });
                const data = await response.json();

                if (!response.ok) {
                    setStatus('error');
                    setMessage(data.error || 'No hemos podido procesar la baja.');
                    return;
                }

                setStatus('success');
                setMessage(data.message || 'La baja se ha procesado correctamente.');
            } catch {
                setStatus('error');
                setMessage('No hemos podido conectar con el servicio. Inténtalo de nuevo más tarde.');
            }
        })();
    }, []);

    return (
        <section className={`legal-action-panel legal-action-panel--${status}`} aria-live="polite" aria-atomic="true">
            <p className="legal-action-eyebrow">Preferencias de correo</p>
            <h1>{status === 'success' ? 'Baja completada' : status === 'error' ? 'No se pudo completar' : 'Procesando la baja…'}</h1>
            <p role={status === 'error' ? 'alert' : 'status'}>{message}</p>
            <div className="legal-action-links">
                <Link href="/">Volver al inicio</Link>
                {status === 'error' ? <Link href="/contact">Contactar</Link> : null}
            </div>
        </section>
    );
}
