'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Book {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    views: number;
    createdAt: string;
}

export default function ManageBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        try {
            const response = await fetch('/api/books?all=true');
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Failed to fetch books:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        try {
            const response = await fetch(`/api/books?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete book');
            }

            // Remove the book from the list
            setBooks(books.filter(book => book.id !== id));
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book. Please try again.');
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <p>Loading books...</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Manage Books</h1>
                <Link href="/admin/books/new" className="btn">
                    Upload New Book
                </Link>
            </div>

            {books.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '4px',
                    color: '#888'
                }}>
                    <p style={{ fontSize: '1.2rem' }}>No books found.</p>
                    <Link href="/admin/books/new" className="btn" style={{ marginTop: '1rem' }}>
                        Upload Your First Book
                    </Link>
                </div>
            ) : (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.03)' }}>
                                <th style={thStyle}>Title</th>
                                <th style={thStyle}>Slug</th>
                                <th style={thStyle}>Views</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Created</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={tdStyle}>{book.title}</td>
                                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.9rem', color: '#888' }}>
                                        /{book.slug}
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888' }}>
                                            <span style={{ fontSize: '1.1rem' }}>👁️</span>
                                            <span>{book.views?.toLocaleString() || 0}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            background: book.published ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                                            color: book.published ? '#4caf50' : '#ff9800',
                                            border: `1px solid ${book.published ? '#4caf50' : '#ff9800'}`
                                        }}>
                                            {book.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        {new Date(book.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link
                                                href={`/books/${book.slug}`}
                                                target="_blank"
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255, 215, 0, 0.1)',
                                                    color: '#FFD700',
                                                    border: '1px solid rgba(255, 215, 0, 0.3)',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(book.id)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(244, 67, 54, 0.1)',
                                                    color: '#f44336',
                                                    border: '1px solid rgba(244, 67, 54, 0.3)',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirmation Dialog */}
            {deleteId && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#1a1a1a',
                        padding: '2rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Confirm Deletion</h2>
                        <p style={{ marginBottom: '2rem', color: '#ccc' }}>
                            Are you sure you want to delete this book? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setDeleteId(null)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: '#fff',
                                    border: '1px solid var(--border)',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#f44336',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const thStyle = {
    padding: '1rem',
    textAlign: 'left' as const,
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#888'
};

const tdStyle = {
    padding: '1rem',
    fontSize: '0.95rem'
};
