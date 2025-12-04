"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Book {
    id: number;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function BooksManagementPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        }
    }, [status, router]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await fetch('/api/books');
            const data = await res.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/books/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setBooks(books.filter(b => b.id !== id));
                setDeleteId(null);
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book');
        } finally {
            setDeleting(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0a0a0a'
            }}>
                <div style={{ color: '#FFD700', fontSize: '1.2rem' }}>Loading...</div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            padding: '4rem 2rem',
            color: '#e0e0e0'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem'
                }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Manage Books
                    </h1>
                    <Link
                        href="/admin/books/new"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            color: '#000',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: '600',
                            transition: 'transform 0.2s'
                        }}
                    >
                        + New Book
                    </Link>
                </div>

                {books.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#888'
                    }}>
                        No books yet. Upload your first book!
                    </div>
                ) : (
                    <div style={{
                        background: '#111',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse'
                        }}>
                            <thead>
                                <tr style={{
                                    background: '#1a1a1a',
                                    borderBottom: '2px solid #FFD700'
                                }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Title</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Slug</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Created</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr key={book.id} style={{
                                        borderBottom: '1px solid #222',
                                        transition: 'background 0.2s'
                                    }}>
                                        <td style={{ padding: '1rem' }}>
                                            <Link
                                                href={`/books/${book.slug}`}
                                                target="_blank"
                                                style={{
                                                    color: '#fff',
                                                    textDecoration: 'none',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {book.title}
                                            </Link>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#888', fontSize: '0.9rem' }}>
                                            /{book.slug}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                background: book.published ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                                                color: book.published ? '#0f0' : '#FFA500'
                                            }}>
                                                {book.published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
                                            {new Date(book.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => setDeleteId(book.id)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255, 0, 0, 0.1)',
                                                    color: '#ff4444',
                                                    border: '1px solid rgba(255, 0, 0, 0.3)',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 0, 0, 0.2)';
                                                    e.currentTarget.style.borderColor = '#ff4444';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 0, 0, 0.1)';
                                                    e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.3)';
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId !== null && (
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
                        maxWidth: '500px',
                        width: '90%',
                        border: '1px solid #333'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            marginBottom: '1rem',
                            color: '#fff'
                        }}>
                            Confirm Delete
                        </h2>
                        <p style={{
                            color: '#ccc',
                            marginBottom: '2rem',
                            lineHeight: '1.6'
                        }}>
                            Are you sure you want to delete this book? This action cannot be undone.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={deleting}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#333',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    fontWeight: '500',
                                    opacity: deleting ? 0.5 : 1
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                disabled={deleting}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#ff4444',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    fontWeight: '500',
                                    opacity: deleting ? 0.5 : 1
                                }}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
