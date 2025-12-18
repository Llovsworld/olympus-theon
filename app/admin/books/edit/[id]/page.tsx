"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, Eye, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import ContentPreview from '@/components/admin/ContentPreview';

export default function EditBookPage() {
    const router = useRouter();
    const params = useParams();
    const bookId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [link, setLink] = useState('');

    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isPublished, setIsPublished] = useState(false);

    // Load existing book data
    useEffect(() => {
        async function loadBook() {
            try {
                const res = await fetch(`/api/books/${bookId}`);
                if (!res.ok) throw new Error('Book not found');
                const book = await res.json();

                setTitle(book.title || '');
                setSlug(book.slug || '');
                setAuthor(book.author || '');
                setDescription(book.description || '');
                setContent(book.content || '');
                setCoverImage(book.coverImage || '');
                setLink(book.link || '');
                setIsPublished(book.published || false);
            } catch (error) {
                console.error('Error loading book:', error);
                alert('Error al cargar el libro');
                router.push('/admin/books');
            } finally {
                setLoading(false);
            }
        }

        if (bookId) {
            loadBook();
        }
    }, [bookId, router]);

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) {
            alert('El título y la descripción son obligatorios');
            return;
        }

        setSaving(true);
        setSaveStatus('saving');

        try {
            const res = await fetch(`/api/books/${bookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    author,
                    description,
                    content,
                    coverImage,
                    link,
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
        if (!title.trim() || !description.trim()) {
            alert('El título y la descripción son obligatorios');
            return;
        }

        setPublishing(true);

        try {
            const res = await fetch(`/api/books/${bookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    author,
                    description,
                    content,
                    coverImage,
                    link,
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
                        onClick={() => router.push('/admin/books')}
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
                        Editar Libro
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
                            placeholder="Título del libro..."
                            style={{ fontSize: '1.5rem', fontWeight: '600' }}
                        />
                    </div>

                    <div>
                        <label className="admin-label">Autor</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="admin-input"
                            placeholder="Nombre del autor..."
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
                        <label className="admin-label">Descripción corta</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="admin-textarea"
                            rows={3}
                            placeholder="Una breve descripción del libro..."
                        />
                    </div>

                    <div>
                        <label className="admin-label">Contenido (opcional)</label>
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
                        onUpload={setCoverImage}
                        currentImage={coverImage}
                        label="Portada del Libro"
                    />

                    <div>
                        <label className="admin-label">Enlace de compra (opcional)</label>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="admin-input"
                            placeholder="https://..."
                        />
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
                            featuredImage={coverImage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
