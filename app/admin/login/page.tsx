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
                setError("Invalid credentials");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            setError("An error occurred");
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
                    Admin Access
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem',
                            color: '#aaa',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
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
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem',
                            color: '#aaa',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
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
                        <div style={{
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
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
