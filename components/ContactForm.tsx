"use client";

import { useState, type FormEvent } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div style={{
            background: 'rgba(15, 15, 15, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '3.5rem',
            backdropFilter: 'blur(10px)'
        }}>
            <h2 style={{
                fontSize: '1.8rem',
                marginBottom: '0.5rem',
                color: '#fff',
                fontWeight: '700',
                letterSpacing: '-0.02em'
            }}>
                Enviar un Mensaje
            </h2>
            <p style={{
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '3rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
            }}>
                Respondemos en 24 horas
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {/* Name Field */}
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        id="name"
                        required
                        placeholder=" "
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '1.2rem 0',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '1.1rem',
                            outline: 'none',
                            transition: 'border-color 0.3s',
                            fontWeight: '300'
                        }}
                        onFocus={(e) => e.target.style.borderBottomColor = '#fff'}
                        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.15)'}
                    />
                    <label
                        htmlFor="name"
                        style={{
                            position: 'absolute',
                            top: formData.name ? '-20px' : '1.2rem',
                            left: 0,
                            color: formData.name ? '#fff' : '#666',
                            fontSize: formData.name ? '0.75rem' : '1rem',
                            transition: 'all 0.3s ease',
                            pointerEvents: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            fontWeight: '400'
                        }}
                    >
                        Tu Nombre
                    </label>
                </div>

                {/* Email Field */}
                <div style={{ position: 'relative' }}>
                    <input
                        type="email"
                        id="email"
                        required
                        placeholder=" "
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '1.2rem 0',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '1.1rem',
                            outline: 'none',
                            transition: 'border-color 0.3s',
                            fontWeight: '300'
                        }}
                        onFocus={(e) => e.target.style.borderBottomColor = '#fff'}
                        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.15)'}
                    />
                    <label
                        htmlFor="email"
                        style={{
                            position: 'absolute',
                            top: formData.email ? '-20px' : '1.2rem',
                            left: 0,
                            color: formData.email ? '#fff' : '#666',
                            fontSize: formData.email ? '0.75rem' : '1rem',
                            transition: 'all 0.3s ease',
                            pointerEvents: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            fontWeight: '400'
                        }}
                    >
                        Correo Electrónico
                    </label>
                </div>

                {/* Message Field */}
                <div style={{ position: 'relative' }}>
                    <textarea
                        id="message"
                        rows={4}
                        required
                        placeholder=" "
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '1.2rem 0',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '1.1rem',
                            outline: 'none',
                            resize: 'vertical',
                            transition: 'border-color 0.3s',
                            fontFamily: 'inherit',
                            fontWeight: '300'
                        }}
                        onFocus={(e) => e.target.style.borderBottomColor = '#fff'}
                        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.15)'}
                    ></textarea>
                    <label
                        htmlFor="message"
                        style={{
                            position: 'absolute',
                            top: formData.message ? '-20px' : '1.2rem',
                            left: 0,
                            color: formData.message ? '#fff' : '#666',
                            fontSize: formData.message ? '0.75rem' : '1rem',
                            transition: 'all 0.3s ease',
                            pointerEvents: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            fontWeight: '400'
                        }}
                    >
                        Tu Mensaje
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                        padding: '1.3rem 3rem',
                        background: '#fff',
                        color: '#000',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                        opacity: status === 'loading' ? 0.7 : 1,
                        marginTop: '1rem',
                        transition: 'all 0.3s ease',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                        if (status !== 'loading') {
                            e.currentTarget.style.background = '#e0e0e0';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (status !== 'loading') {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }
                    }}
                >
                    {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
                </button>

                {status === 'success' && (
                    <div style={{
                        padding: '1.2rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderLeft: '2px solid #fff',
                        color: '#fff',
                        fontSize: '0.9rem',
                        letterSpacing: '0.02em'
                    }}>
                        <strong>Mensaje recibido.</strong> Te contactaremos en las próximas 24 horas.
                    </div>
                )}

                {status === 'error' && (
                    <div style={{
                        padding: '1.2rem',
                        background: 'rgba(255, 50, 50, 0.1)',
                        borderLeft: '2px solid #ff3333',
                        color: '#ffaaaa',
                        fontSize: '0.9rem'
                    }}>
                        Error al enviar. Por favor intenta de nuevo o contáctanos directamente.
                    </div>
                )}
            </form>
        </div>
    );
}
