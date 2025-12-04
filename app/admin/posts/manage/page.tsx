"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Edit, Trash2, Eye, Plus, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Post {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
    views: number;
}

export default function ManagePostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const res = await fetch('/api/posts?all=true');
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPosts(posts.filter(post => post.id !== id));
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Error deleting post');
        } finally {
            setDeletingId(null);
        }
    }

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Manage Posts</h1>
                    <p style={{ color: '#888' }}>View, edit, and manage your blog content.</p>
                </div>
                <Link href="/admin/posts/new" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> New Post
                </Link>
            </div>

            {/* Toolbar */}
            <div style={{
                marginBottom: '2rem',
                display: 'flex',
                gap: '1rem',
                background: 'rgba(255,255,255,0.02)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)'
            }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            color: 'var(--foreground)',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>Loading posts...</div>
                ) : filteredPosts.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', background: 'rgba(255,255,255,0.01)' }}>
                                <th style={thStyle}>Title</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Views</th>
                                <th style={thStyle}>Date</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((post) => (
                                <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{post.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'monospace' }}>/{post.slug}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '99px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            background: post.published ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                            color: post.published ? '#4caf50' : '#ffc107',
                                            border: `1px solid ${post.published ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)'}`
                                        }}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888' }}>
                                            <Eye size={14} />
                                            <span>{post.views.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, color: '#888' }}>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <Link href={`/blog/${post.slug}`} target="_blank" title="View Live" style={actionBtnStyle}>
                                                <Eye size={16} />
                                            </Link>
                                            {/* Edit link placeholder - would link to /admin/posts/edit/[id] */}
                                            <button disabled title="Edit (Coming Soon)" style={{ ...actionBtnStyle, opacity: 0.5, cursor: 'not-allowed' }}>
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                disabled={deletingId === post.id}
                                                title="Delete"
                                                style={{ ...actionBtnStyle, color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.3)' }}
                                            >
                                                {deletingId === post.id ? '...' : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1rem', color: '#333' }}>
                            <FileText size={48} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No posts found</h3>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>{searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first blog post.'}</p>
                        {!searchTerm && (
                            <Link href="/admin/posts/new" className="btn">
                                Create Post
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const thStyle = {
    padding: '1rem 1.5rem',
    fontSize: '0.8rem',
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    fontWeight: '600'
};

const tdStyle = {
    padding: '1rem 1.5rem',
    fontSize: '0.95rem',
    verticalAlign: 'middle'
};

const actionBtnStyle = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: '#888',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
};
