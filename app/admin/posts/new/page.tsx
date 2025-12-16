"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, Eye, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function NewPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [category, setCategory] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | ''>('');
    const [showPreview, setShowPreview] = useState(false);

    const [editorKey, setEditorKey] = useState(0);

    const categories = [
        'Mindset',
        'Productividad',
        'Fitness',
        'Negocios',
        'Desarrollo Personal',
        'Lifestyle',
        'Motivación'
    ];

    // Auto-save to localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('draft-post');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setTitle(parsed.title || '');
                setSubtitle(parsed.subtitle || '');
                setSlug(parsed.slug || '');
                setContent(parsed.content || '');
                setExcerpt(parsed.excerpt || '');
                setMetaDescription(parsed.metaDescription || '');
                setCategory(parsed.category || '');
                setFeaturedImage(parsed.featuredImage || '');
                // Force editor remount to show loaded content
                setEditorKey(k => k + 1);
            } catch (e) {
                console.error('Failed to load draft:', e);
            }
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (title || content) {
                setAutoSaveStatus('saving');
                localStorage.setItem('draft-post', JSON.stringify({
                    title,
                    subtitle,
                    slug,
                    content,
                    excerpt,
                    metaDescription,
                    category,
                    featuredImage
                }));
                setTimeout(() => setAutoSaveStatus('saved'), 500);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [title, subtitle, slug, content, excerpt, metaDescription, category, featuredImage]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSaveDraft();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                handlePublish();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [title, slug, content, featuredImage]);

    // Auto-generate slug from title
    function handleTitleChange(newTitle: string) {
        setTitle(newTitle);
        if (!slug || slug === generateSlug(title)) {
            setSlug(generateSlug(newTitle));
        }
    }

    function generateSlug(text: string) {
        return text
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    async function handleSaveDraft() {
        if (!title.trim()) {
            setStatus('❌ Title is required');
            return;
        }

        setLoading(true);
        setStatus('');

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug: slug || generateSlug(title),
                    content,
                    excerpt,
                    metaDescription,
                    category,
                    featuredImage,
                    published: false
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || 'Failed to save draft');
            }

            setStatus('✅ Draft saved successfully!');
            localStorage.removeItem('draft-post');
            setTimeout(() => router.push('/admin/posts/manage'), 1500);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save draft';
            setStatus(`❌ ${message}`);
        } finally {
            setLoading(false);
        }
    }

    async function handlePublish() {
        if (!title.trim()) {
            setStatus('❌ Title is required');
            return;
        }
        if (!content.trim()) {
            setStatus('❌ Content cannot be empty');
            return;
        }

        setLoading(true);
        setStatus('');

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug: slug || generateSlug(title),
                    content,
                    excerpt,
                    metaDescription,
                    category,
                    featuredImage,
                    published: true
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || errorData.error || 'Failed to publish post');
            }

            setStatus('✅ Post published successfully!');
            localStorage.removeItem('draft-post');
            setTimeout(() => router.push('/admin/posts/manage'), 1500);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to publish post';
            setStatus(`❌ ${message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#ededed' }}>
            {/* Top Bar */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: '#050505',
                borderBottom: '1px solid #1f1f1f',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => router.push('/admin')}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#888',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.95rem'
                        }}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    {autoSaveStatus === 'saved' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.9rem' }}>
                            <CheckCircle2 size={16} />
                            <span>Draft saved</span>
                        </div>
                    )}
                    {autoSaveStatus === 'saving' && (
                        <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Saving...</div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {status && (
                        <span style={{
                            fontSize: '0.9rem',
                            color: status.includes('❌') ? '#ef4444' : '#10b981'
                        }}>
                            {status}
                        </span>
                    )}

                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        disabled={loading}
                        style={{
                            padding: '0.625rem 1.25rem',
                            background: 'transparent',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            color: '#ededed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Eye size={16} />
                        Preview
                    </button>

                    <button
                        onClick={handleSaveDraft}
                        disabled={loading || !title.trim()}
                        style={{
                            padding: '0.625rem 1.25rem',
                            background: 'transparent',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            opacity: loading || !title.trim() ? 0.5 : 1,
                            color: '#ededed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Save size={16} />
                        {loading ? 'Saving...' : 'Save Draft'}
                    </button>

                    <button
                        onClick={handlePublish}
                        disabled={loading || !title.trim() || !content.trim()}
                        style={{
                            padding: '0.625rem 1.5rem',
                            background: loading || !title.trim() || !content.trim() ? '#333' : '#ff6719',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading || !title.trim() || !content.trim() ? 'not-allowed' : 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '600'
                        }}
                    >
                        {loading ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* Main Editor */}
            <div style={{
                maxWidth: '740px',
                margin: '0 auto',
                padding: '4rem 2rem'
            }}>
                {/* Title */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Post Title..."
                    style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        padding: '0',
                        background: 'transparent',
                        color: '#ededed',
                        fontFamily: 'inherit'
                    }}
                />

                {/* Subtitle */}
                <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Subtitle (optional)..."
                    style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '1.5rem',
                        color: '#888',
                        marginBottom: '2rem',
                        padding: '0',
                        background: 'transparent',
                        fontFamily: 'inherit'
                    }}
                />

                {/* URL Slug */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>
                        URL Slug
                    </label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="auto-generated-from-title"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            fontSize: '0.95rem',
                            fontFamily: 'monospace',
                            color: '#ededed',
                            background: 'rgba(255,255,255,0.05)'
                        }}
                    />
                </div>

                {/* Category */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>
                        Categoría
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            fontSize: '0.95rem',
                            color: '#ededed',
                            background: 'rgba(255,255,255,0.05)',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">Seleccionar categoría...</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Excerpt */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>
                        Extracto / Resumen
                        <span style={{ color: '#555', fontWeight: '400', marginLeft: '0.5rem' }}>(para listados)</span>
                    </label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Un breve resumen del post que aparecerá en los listados..."
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            fontSize: '0.95rem',
                            color: '#ededed',
                            background: 'rgba(255,255,255,0.05)',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.25rem' }}>
                        {excerpt.length}/200 caracteres recomendados
                    </p>
                </div>

                {/* Meta Description (SEO) */}
                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #1f1f1f' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>
                        Meta Descripción SEO
                        <span style={{ color: '#555', fontWeight: '400', marginLeft: '0.5rem' }}>(para buscadores)</span>
                    </label>
                    <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Descripción que aparecerá en los resultados de Google..."
                        rows={2}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            fontSize: '0.95rem',
                            color: '#ededed',
                            background: 'rgba(255,255,255,0.05)',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                    <p style={{ fontSize: '0.8rem', color: metaDescription.length > 160 ? '#ef4444' : '#555', marginTop: '0.25rem' }}>
                        {metaDescription.length}/160 caracteres óptimos para SEO
                    </p>
                </div>

                {/* Featured Image */}
                <div style={{ marginBottom: '3rem' }}>
                    <ImageUploader
                        label="Featured Image"
                        onUpload={setFeaturedImage}
                        currentImage={featuredImage}
                    />
                </div>

                {/* Content Editor */}
                <div className="admin-editor" style={{
                    marginBottom: '4rem',
                    border: '1px solid #1f1f1f',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <RichTextEditor
                        key={editorKey} // Remounts editor when drafts load
                        content={content}
                        onChange={setContent}
                        placeholder="Start writing your post..."
                    />
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.9)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }} onClick={() => setShowPreview(false)}>
                    <div style={{
                        background: '#050505',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        borderRadius: '12px',
                        padding: '3rem',
                        border: '1px solid #1f1f1f'
                    }} onClick={(e) => e.stopPropagation()}>
                        {featuredImage && (
                            <img src={featuredImage} alt={title} style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '8px',
                                marginBottom: '2rem'
                            }} />
                        )}
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#ededed' }}>
                            {title || 'Untitled Post'}
                        </h1>
                        {subtitle && (
                            <h2 style={{ fontSize: '1.5rem', color: '#888', marginBottom: '2rem', fontWeight: '400' }}>
                                {subtitle}
                            </h2>
                        )}
                        <div
                            className="prose prose-invert prose-lg"
                            style={{ color: '#ededed' }}
                            dangerouslySetInnerHTML={{ __html: content || '<p>No content yet...</p>' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
