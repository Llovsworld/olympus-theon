"use client";

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import { legalPublic } from '@/lib/legal-public';

type ContactStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        website: '',
        privacyAccepted: false,
    });
    const [status, setStatus] = useState<ContactStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (!response.ok) {
                setStatus('error');
                setStatusMessage(data.error || 'No hemos podido enviar el mensaje.');
                return;
            }

            setStatus('success');
            setStatusMessage(data.message || 'Mensaje enviado correctamente.');
            setFormData({
                name: '',
                email: '',
                message: '',
                website: '',
                privacyAccepted: false,
            });
        } catch {
            setStatus('error');
            setStatusMessage('No hemos podido conectar con el servicio de correo.');
        }
    }

    return (
        <div className="contact-form-card">
            <h2>Enviar un mensaje</h2>
            <p className="contact-form-kicker">Respuesta personal, normalmente en un día hábil</p>

            <form onSubmit={handleSubmit} className="contact-form-stack">
                <div className="form-honeypot" aria-hidden="true">
                    <label htmlFor="contact-website">No rellenes este campo</label>
                    <input
                        id="contact-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={(event) => setFormData((current) => ({ ...current, website: event.target.value }))}
                    />
                </div>

                <label className="contact-field" htmlFor="contact-name">
                    <span>Tu nombre</span>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        autoComplete="name"
                        value={formData.name}
                        onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    />
                </label>

                <label className="contact-field" htmlFor="contact-email">
                    <span>Correo electrónico</span>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        inputMode="email"
                        value={formData.email}
                        onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                    />
                </label>

                <label className="contact-field" htmlFor="contact-message">
                    <span>Tu mensaje</span>
                    <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        required
                        minLength={10}
                        maxLength={3000}
                        value={formData.message}
                        onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                        aria-describedby="contact-sensitive-note"
                    />
                </label>

                <p id="contact-sensitive-note" className="form-privacy-summary">
                    No incluyas datos médicos, psicológicos ni otra información especialmente sensible. Responsable:{' '}
                    {legalPublic.responsibleName}. Finalidad: responder a tu consulta. No recibirás publicidad por usar
                    este formulario. Puedes ejercer tus derechos en{' '}
                    <a href={`mailto:${legalPublic.email}`}>{legalPublic.email}</a>.
                </p>

                <label className="form-consent-row">
                    <input
                        type="checkbox"
                        required
                        checked={formData.privacyAccepted}
                        onChange={(event) => setFormData((current) => ({
                            ...current,
                            privacyAccepted: event.target.checked,
                        }))}
                    />
                    <span>
                        He leído la <Link href="/privacidad">Política de privacidad</Link> y entiendo el tratamiento
                        de mis datos para atender esta consulta.
                    </span>
                </label>

                <button type="submit" className="contact-submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Enviando…' : 'Enviar mensaje'}
                </button>

                <div className="form-status-slot" aria-live="polite" aria-atomic="true">
                    {statusMessage ? (
                        <p className={`form-status form-status--${status}`} role={status === 'error' ? 'alert' : 'status'}>
                            {statusMessage}{' '}
                            {status === 'error' ? (
                                <a href={`mailto:${legalPublic.email}`}>Escribir por correo</a>
                            ) : null}
                        </p>
                    ) : null}
                </div>
            </form>
        </div>
    );
}
