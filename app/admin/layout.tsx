"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    // If we're on the login page, render without authentication
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (!isLoginPage && status === 'unauthenticated') {
            router.push('/admin/login');
        }
    }, [status, router, isLoginPage]);

    // Login page should render without authentication checks
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (status === 'loading') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ color: '#888' }}>Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                borderRight: '1px solid var(--border)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                <div className="logo" style={{ fontSize: '1.2rem' }}>
                    Olympus Admin
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    <Link href="/admin" className="nav-link" style={{ fontSize: '1rem' }}>
                        Dashboard
                    </Link>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
                    <Link href="/admin/posts/new" className="nav-link" style={{ fontSize: '1rem' }}>
                        New Post
                    </Link>
                    <Link href="/admin/books/new" className="nav-link" style={{ fontSize: '1rem' }}>
                        New Book
                    </Link>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
                    <Link href="/admin/posts/manage" className="nav-link" style={{ fontSize: '1rem' }}>
                        Manage Posts
                    </Link>
                    <Link href="/admin/books/manage" className="nav-link" style={{ fontSize: '1rem' }}>
                        Manage Books
                    </Link>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
                    <Link href="/" className="nav-link" style={{ fontSize: '1rem', opacity: 0.5 }}>
                        Back to Site
                    </Link>

                    {/* Logout Button at Bottom */}
                    <div style={{ marginTop: 'auto' }}>
                        <button
                            onClick={() => signOut({ callbackUrl: '/admin/login' })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                color: '#ff6b6b',
                                fontSize: '0.9rem',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '4rem' }}>
                {children}
            </main>
        </div>
    );
}
