"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, PenSquare, BookOpen, FileText, Library, ExternalLink, LogOut } from 'lucide-react';
import './admin.css';

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
                justifyContent: 'center',
                background: 'var(--admin-bg)'
            }}>
                <div className="admin-spinner" style={{ width: '48px', height: '48px' }}></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { divider: true },
        { href: '/admin/posts/new', label: 'Nuevo Post', icon: PenSquare },
        { href: '/admin/books/new', label: 'Nuevo Libro', icon: BookOpen },
        { divider: true },
        { href: '/admin/posts', label: 'Gestionar Posts', icon: FileText },
        { href: '/admin/books', label: 'Gestionar Libros', icon: Library },
        { divider: true },
        { href: '/', label: 'Ver Sitio', icon: ExternalLink, external: true },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg)' }}>
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    OLYMPUS ADMIN
                </div>

                <nav className="admin-nav">
                    {navItems.map((item, index) => {
                        if (item.divider) {
                            return <div key={index} className="admin-nav-divider"></div>;
                        }

                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href!}
                                className={`admin-nav-link ${isActive ? 'active' : ''}`}
                                target={item.external ? '_blank' : undefined}
                            >
                                {Icon && <Icon size={18} />}
                                {item.label}
                            </Link>
                        );
                    })}

                    {/* Logout Button at Bottom */}
                    <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <button
                            onClick={() => signOut({ callbackUrl: '/admin/login' })}
                            className="admin-logout-btn"
                        >
                            <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                            Cerrar Sesión
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem 3rem', color: 'var(--admin-text)' }}>
                {children}
            </main>
        </div>
    );
}
