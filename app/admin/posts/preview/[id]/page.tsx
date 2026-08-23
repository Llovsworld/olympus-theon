import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';

import ContentPreview from '@/components/admin/ContentPreview';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizeRichText } from '@/lib/sanitize-content';
import { getContentImageUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Vista previa privada',
    robots: { index: false, follow: false },
};

export default async function PostPreviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/admin/login');
    }

    const { id } = await params;
    const post = await prisma.post.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            category: true,
            featuredImage: true,
            published: true,
            updatedAt: true,
        },
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="admin-fade-enter" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem' }}>
                <Link
                    href="/admin/posts"
                    className="admin-btn admin-btn-secondary"
                    style={{ display: 'inline-flex', marginBottom: '1.5rem' }}
                >
                    <ArrowLeft size={16} />
                    Volver a posts
                </Link>

                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}>
                    <div>
                        <p style={{
                            color: 'var(--admin-accent)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                        }}>
                            Vista previa privada
                        </p>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.65rem' }}>{post.title}</h1>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span className={`admin-badge ${post.published ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                                {post.published ? 'Publicado' : 'Borrador'}
                            </span>
                            {post.category && <span className="admin-text-muted">{post.category}</span>}
                            <span className="admin-text-muted">
                                Actualizado {post.updatedAt.toLocaleDateString('es-ES')}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link href={`/admin/posts/edit/${post.id}`} className="admin-btn admin-btn-primary">
                            <Pencil size={16} />
                            Editar
                        </Link>
                        {post.published && (
                            <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-btn admin-btn-secondary"
                            >
                                <ExternalLink size={16} />
                                Ver publicado
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {!post.published && (
                <div style={{
                    background: 'rgba(255, 193, 7, 0.08)',
                    border: '1px solid rgba(255, 193, 7, 0.24)',
                    borderRadius: '8px',
                    color: '#f7d774',
                    marginBottom: '1.5rem',
                    padding: '1rem 1.25rem',
                }}>
                    Solo tú puedes ver esta página. El artículo continúa oculto para el público.
                </div>
            )}

            <div className="admin-card" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
                <ContentPreview
                    title={post.title}
                    content={sanitizeRichText(post.content)}
                    featuredImage={getContentImageUrl(post.featuredImage) || undefined}
                />
            </div>
        </div>
    );
}
