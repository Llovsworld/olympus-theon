"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Plus, Trash2, ExternalLink, AlertTriangle } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function PostsManagementPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        }
    }, [status, router]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPosts(posts.filter(p => p.id !== id));
                setDeleteId(null);
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Error al eliminar el post');
        } finally {
            setDeleting(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh'
            }}>
                <div className="admin-spinner" style={{ width: '48px', height: '48px' }}></div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className="admin-fade-enter">
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.5rem'
                    }}>
                        Gestionar Posts
                    </h1>
                    <p className="admin-text-muted">
                        {posts.length} post{posts.length !== 1 ? 's' : ''} en total
                    </p>
                </div>
                <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">
                    <Plus size={18} />
                    Nuevo Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <p className="admin-text-muted" style={{ fontSize: '1.1rem' }}>
                        No hay posts todavía. ¡Crea tu primer post!
                    </p>
                    <Link href="/admin/posts/new" className="admin-btn admin-btn-primary" style={{ marginTop: '1.5rem' }}>
                        <Plus size={18} />
                        Crear Post
                    </Link>
                </div>
            ) : (
                <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Slug</th>
                                <th style={{ textAlign: 'center' }}>Estado</th>
                                <th style={{ textAlign: 'center' }}>Creado</th>
                                <th style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            style={{
                                                color: 'var(--admin-text)',
                                                textDecoration: 'none',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            {post.title}
                                            <ExternalLink size={14} style={{ opacity: 0.5 }} />
                                        </Link>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-muted)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                        /{post.slug}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`admin-badge ${post.published ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                                            {post.published ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
                                        {new Date(post.createdAt).toLocaleDateString('es-ES')}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => setDeleteId(post.id)}
                                            className="admin-btn admin-btn-danger"
                                            style={{ padding: '0.5rem 1rem' }}
                                        >
                                            <Trash2 size={16} />
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId !== null && (
                <div className="admin-modal-overlay" onClick={() => !deleting && setDeleteId(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'rgba(239, 68, 68, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <AlertTriangle size={24} color="#ef4444" />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--admin-text)' }}>
                                Confirmar Eliminación
                            </h2>
                        </div>
                        <p style={{
                            color: 'var(--admin-text-secondary)',
                            marginBottom: '2rem',
                            lineHeight: '1.6'
                        }}>
                            ¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={deleting}
                                className="admin-btn admin-btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                disabled={deleting}
                                className="admin-btn admin-btn-danger"
                            >
                                {deleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
