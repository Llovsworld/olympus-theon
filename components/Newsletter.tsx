'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Newsletter() {
    const t = useTranslations('Newsletter');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage(t('invalidEmail'));
            return;
        }

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
                setMessage(data.message || t('success'));
                setEmail('');
                setTimeout(() => {
                    setStatus('idle');
                    setMessage('');
                }, 5000);
            } else {
                setStatus('error');
                setMessage(data.error || t('error'));
            }
        } catch (error) {
            setStatus('error');
            setMessage(t('error'));
        }
    }

    return (
        <div
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                padding: '3rem 2rem',
                maxWidth: '600px',
                margin: '0 auto',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 4px 10px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '0.75rem',
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em'
                }}>
                    {t('title').replace('📬 ', '')}
                </h3>
                <p style={{
                    color: '#aaa',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    maxWidth: '90%',
                    margin: '0 auto'
                }}>
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('placeholder')}
                        disabled={status === 'loading'}
                        style={{
                            flex: '1 1 250px',
                            padding: '0.875rem 1.25rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '2px',
                            color: '#fff',
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn"
                        style={{
                            padding: '0.875rem 2rem',
                            background: status === 'loading' ? '#666' : '#ededed',
                            color: '#050505',
                            border: 'none',
                            borderRadius: '2px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {status === 'loading' ? '...' : t('subscribe')}
                    </button>
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '4px',
                        background: status === 'success'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${status === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        color: status === 'success' ? '#10b981' : '#ef4444',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        transition: 'all 0.3s ease'
                    }}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
