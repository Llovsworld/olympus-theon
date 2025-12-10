"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, Eye, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function NewBookPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [link, setLink] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | ''>('');
    const [showPreview, setShowPreview] = useState(false);

    // Auto-save to localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('draft-book');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setTitle(parsed.title || '');
                setSlug(parsed.slug || '');
                setAuthor(parsed.author || '');
                setDescription(parsed.description || '');
                setContent(parsed.content || '');
                setCoverImage(parsed.coverImage || '');
                setLink(parsed.link || '');
            } catch (e) {
                console.error('Failed to load draft:', e);
            }
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (title || content) {
                setAutoSaveStatus('saving');
                localStorage.setItem('draft-book', JSON.stringify({
                    title,
                    slug,
                    author,
                    description,
                    content,
                    coverImage,
                    link
                }));
                setTimeout(() => setAutoSaveStatus('saved'), 500);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [title, slug, author, description, content, coverImage, link]);

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
    }, [title, slug, content, coverImage, link]);

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
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug: slug || generateSlug(title),
                    author: author || null,
                    description: description || '',
                    content,
                    coverImage,
                    link,
                    published: false
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || 'Failed to save draft');
            }

            setStatus('✅ Draft saved successfully!');
            localStorage.removeItem('draft-book');
            setTimeout(() => router.push('/admin/books/manage'), 1500);
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

        setLoading(true);
        setStatus('');

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug: slug || generateSlug(title),
                    author: author || null,
                    description: description || '',
                    content,
                    coverImage,
                    link,
                    published: true
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || 'Failed to publish book');
            }

            setStatus('✅ Book published successfully!');
            localStorage.removeItem('draft-book');
            setTimeout(() => router.push('/admin/books/manage'), 1500);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to publish book';
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
                        disabled={loading || !title.trim()}
                        style={{
                            padding: '0.625rem 1.5rem',
                            background: loading || !title.trim() ? '#333' : '#ff6719',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
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
                    placeholder="Book Title..."
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

                {/* Author */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>
                        Autor del Libro
                    </label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Nombre del autor..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            fontSize: '0.95rem',
                            color: '#ededed',
                            background: 'rgba(255,255,255,0.05)'
                        }}
                    />
                </div>

                {/* Description */}
                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #1f1f1f' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>
                        Descripción del Libro
                        <span style={{ color: '#555', fontWeight: '400', marginLeft: '0.5rem' }}>(para listados)</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Breve descripción del libro que aparecerá en los listados..."
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
                        {description.length}/300 caracteres recomendados
                    </p>
                </div>


                {/* Purchase Link */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Purchase / Download Link
                    </label>
                    <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://amazon.com/..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontFamily: 'monospace',
                            color: '#ededed',
                            background: 'rgba(255,255,255,0.05)'
                        }}
                    />
                </div>

                {/* Cover Image */}
                <div style={{ marginBottom: '3rem' }}>
                    <ImageUploader
                        label="Book Cover"
                        onUpload={setCoverImage}
                        currentImage={coverImage}
                    />
                </div>

                {/* Content Editor */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Full Content / Chapters
                    </label>
                    <div className="admin-editor" style={{
                        border: '1px solid #1f1f1f',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.02)'
                    }}>
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Write the full book content here..."
                        />
                    </div>
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
                        {coverImage && (
                            <img src={coverImage} alt={title} style={{
                                maxWidth: '200px',
                                height: 'auto',
                                borderRadius: '4px',
                                marginBottom: '2rem',
                                display: 'block',
                                margin: '0 auto 2rem auto',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }} />
                        )}
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#ededed', textAlign: 'center' }}>
                            {title || 'Untitled Book'}
                        </h1>
                        {description && (
                            <div style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem', fontStyle: 'italic', textAlign: 'center' }}>
                                {description}
                            </div>
                        )}
                        {link && (
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <a href={link} target="_blank" className="btn" style={{ background: '#ededed', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none' }}>
                                    Get This Book
                                </a>
                            </div>
                        )}
                        <div
                            className="prose prose-invert prose-lg"
                            style={{ color: '#ededed', margin: '0 auto' }}
                            dangerouslySetInnerHTML={{ __html: content || '<p>No content yet...</p>' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
