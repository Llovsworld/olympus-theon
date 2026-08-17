"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Credenciales incorrectas o demasiados intentos. Espera unos minutos y vuelve a probar.");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch {
            setError("No se pudo iniciar sesión. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '3rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                borderRadius: '4px'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    Olympus Theon
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: '#888',
                    marginBottom: '3rem',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em'
                }}>
                    Acceso de administración
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label htmlFor="admin-username" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem',
                            color: '#aaa',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            Usuario
                        </label>
                        <input
                            id="admin-username"
                            type="text"
                            name="username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--border)',
                                color: 'var(--foreground)',
                                fontSize: '1rem',
                                borderRadius: '2px'
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="admin-password" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem',
                            color: '#aaa',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            Contraseña
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--border)',
                                color: 'var(--foreground)',
                                fontSize: '1rem',
                                borderRadius: '2px'
                            }}
                        />
                    </div>

                    {error && (
                        <div role="alert" aria-live="polite" style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 0, 0, 0.3)',
                            color: '#ff6b6b',
                            borderRadius: '2px',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
}
