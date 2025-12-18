"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, Eye, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import ContentPreview from '@/components/admin/ContentPreview';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [category, setCategory] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');

    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isPublished, setIsPublished] = useState(false);

    // Load existing post data
    useEffect(() => {
        async function loadPost() {
            try {
                const res = await fetch(`/api/posts/${postId}`);
                if (!res.ok) throw new Error('Post not found');
                const post = await res.json();

                setTitle(post.title || '');
                setSubtitle(post.subtitle || '');
                setSlug(post.slug || '');
                setContent(post.content || '');
                setExcerpt(post.excerpt || '');
                setMetaDescription(post.metaDescription || '');
                setCategory(post.category || '');
                setFeaturedImage(post.featuredImage || '');
                setIsPublished(post.published || false);
            } catch (error) {
                console.error('Error loading post:', error);
                alert('Error al cargar el post');
                router.push('/admin/posts');
            } finally {
                setLoading(false);
            }
        }

        if (postId) {
            loadPost();
        }
    }, [postId, router]);

    const handleSave = async () => {
        if (!title.trim()) {
            alert('El título es obligatorio');
            return;
        }

        setSaving(true);
        setSaveStatus('saving');

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    subtitle,
                    slug,
                    content,
                    excerpt,
                    metaDescription,
                    category,
                    featuredImage,
                    published: isPublished
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Error al guardar');
            }

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Save error:', error);
            setSaveStatus('error');
            alert(error instanceof Error ? error.message : 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!title.trim()) {
            alert('El título es obligatorio');
            return;
        }

        setPublishing(true);

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    subtitle,
                    slug,
                    content,
                    excerpt,
                    metaDescription,
                    category,
                    featuredImage,
                    published: !isPublished
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Error al publicar');
            }

            setIsPublished(!isPublished);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Publish error:', error);
            alert(error instanceof Error ? error.message : 'Error al publicar');
        } finally {
            setPublishing(false);
        }
    };

    if (loading) {
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

    return (
        <div className="admin-fade-enter">
            {/* Top Bar */}
            <div className="admin-topbar" style={{ marginBottom: '2rem', padding: '1rem 0' }}>
                <div className="admin-topbar-left">
                    <button
                        className="admin-back-btn"
                        onClick={() => router.push('/admin/posts')}
                    >
                        <ArrowLeft size={18} />
                        Volver
                    </button>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Editar Post
                    </h1>
                    {saveStatus === 'saved' && (
                        <span className="admin-autosave">
                            <CheckCircle2 size={16} />
                            Guardado
                        </span>
                    )}
                </div>
                <div className="admin-topbar-right">
                    <button
                        onClick={() => setShowPreview(true)}
                        className="admin-btn admin-btn-secondary"
                    >
                        <Eye size={18} />
                        Vista Previa
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="admin-btn admin-btn-secondary"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Guardar
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className={`admin-btn ${isPublished ? 'admin-btn-warning' : 'admin-btn-publish'}`}
                        style={isPublished ? { background: '#f59e0b', color: '#000' } : undefined}
                    >
                        {publishing ? 'Procesando...' : isPublished ? 'Despublicar' : 'Publicar'}
                    </button>
                </div>
            </div>

            {/* Main Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                {/* Left Column - Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label className="admin-label">Título</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="admin-input"
                            placeholder="Título del post..."
                            style={{ fontSize: '1.5rem', fontWeight: '600' }}
                        />
                    </div>

                    <div>
                        <label className="admin-label">Subtítulo (opcional)</label>
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="admin-input"
                            placeholder="Subtitle (optional)..."
                        />
                    </div>

                    <div>
                        <label className="admin-label">URL Slug</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="admin-input"
                            placeholder="auto-generated-from-title"
                            style={{ fontFamily: 'monospace' }}
                        />
                    </div>

                    <div>
                        <label className="admin-label">Contenido</label>
                        <div className="admin-editor-container">
                            <RichTextEditor
                                content={content}
                                onChange={setContent}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <ImageUploader
                        onUpload={setFeaturedImage}
                        currentImage={featuredImage}
                        label="Imagen Destacada"
                    />

                    <div>
                        <label className="admin-label">Categoría</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="admin-select"
                        >
                            <option value="">Seleccionar categoría...</option>
                            <option value="entrenamiento">Entrenamiento</option>
                            <option value="nutricion">Nutrición</option>
                            <option value="mentalidad">Mentalidad</option>
                            <option value="lifestyle">Lifestyle</option>
                        </select>
                    </div>

                    <div>
                        <label className="admin-label">Extracto / Resumen (para listados)</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="admin-textarea"
                            rows={4}
                            placeholder="Un breve resumen del post que aparecerá en los listados..."
                        />
                        <p className="admin-helper-text">{excerpt.length}/200 caracteres recomendados</p>
                    </div>

                    <div>
                        <label className="admin-label">Meta Descripción SEO (para buscadores)</label>
                        <textarea
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            className="admin-textarea"
                            rows={3}
                            placeholder="Descripción que aparecerá en los resultados de Google..."
                        />
                        <p className="admin-helper-text">{metaDescription.length}/160 caracteres óptimos para SEO</p>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div
                    className="admin-modal-overlay"
                    onClick={() => setShowPreview(false)}
                    style={{ alignItems: 'flex-start', paddingTop: '2rem', overflowY: 'auto' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '90%',
                            maxWidth: '900px',
                            background: 'var(--admin-bg-elevated)',
                            borderRadius: 'var(--admin-radius-lg)',
                            border: '1px solid var(--admin-border)',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid var(--admin-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Vista Previa</h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="admin-btn admin-btn-secondary"
                            >
                                Cerrar
                            </button>
                        </div>
                        <ContentPreview
                            content={content}
                            title={title}
                            featuredImage={featuredImage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
