import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
    FileText,
    BookOpen,
    Eye,
    Plus,
    Settings,
    Image as ImageIcon,
    ArrowRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/admin/login');
    }

    // Fetch real data
    const [postCount, bookCount, recentPosts, postViews, bookViews] = await Promise.all([
        prisma.post.count(),
        prisma.book.count(),
        prisma.post.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                published: true,
                createdAt: true,
                slug: true
            }
        }),
        prisma.post.aggregate({
            _sum: {
                views: true
            }
        }),
        prisma.book.aggregate({
            _sum: {
                views: true
            }
        })
    ]);

    const totalViews = (postViews._sum.views || 0) + (bookViews._sum.views || 0);

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(to right, #fff, #888)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Dashboard
                </h1>
                <p style={{ color: '#666' }}>Welcome back, Admin. Here's what's happening today.</p>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '4rem'
            }}>
                <StatCard
                    title="Total Posts"
                    value={postCount}
                    icon={<FileText size={24} color="#4caf50" />}
                    trend="+2 this week"
                />
                <StatCard
                    title="Total Books"
                    value={bookCount}
                    icon={<BookOpen size={24} color="#2196f3" />}
                    trend="Stable"
                />
                <StatCard
                    title="Total Views"
                    value={totalViews}
                    icon={<Eye size={24} color="#ff9800" />}
                    trend="All time"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                {/* Recent Activity */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Posts</h2>
                        <Link href="/admin/posts/manage" style={{ color: '#888', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        {recentPosts.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                        <th style={thStyle}>Title</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPosts.map((post) => (
                                        <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                            <td style={tdStyle}>{post.title}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '99px',
                                                    fontSize: '0.75rem',
                                                    background: post.published ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                                    color: post.published ? '#4caf50' : '#ffc107',
                                                    border: `1px solid ${post.published ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)'}`
                                                }}>
                                                    {post.published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ ...tdStyle, color: '#666' }}>
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                                No posts yet. Start writing!
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Quick Actions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <ActionLink href="/admin/posts/new" icon={<Plus size={20} />} title="New Post" desc="Write a new blog post" primary />
                        <ActionLink href="/admin/books/new" icon={<BookOpen size={20} />} title="New Book" desc="Upload a book to the library" />
                        <ActionLink href="/admin/media" icon={<ImageIcon size={20} />} title="Media Library" desc="Manage uploaded images" />
                        <ActionLink href="/admin/settings" icon={<Settings size={20} />} title="Settings" desc="Configure site options" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend: string }) {
    return (
        <div style={{
            padding: '1.5rem',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            transition: 'transform 0.2s',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '6px'
                }}>
                    {icon}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>{trend}</span>
            </div>
            <h3 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
        </div>
    );
}

function ActionLink({ href, icon, title, desc, primary = false }: { href: string, icon: React.ReactNode, title: string, desc: string, primary?: boolean }) {
    return (
        <Link href={href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            background: primary ? 'var(--foreground)' : 'rgba(255,255,255,0.02)',
            color: primary ? 'var(--background)' : 'var(--foreground)',
            border: primary ? 'none' : '1px solid var(--border)',
            transition: 'all 0.2s'
        }}>
            <div>{icon}</div>
            <div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{title}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{desc}</div>
            </div>
        </Link>
    );
}

const thStyle = {
    padding: '1rem',
    fontSize: '0.85rem',
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontWeight: '500'
};

const tdStyle = {
    padding: '1rem',
    fontSize: '0.95rem',
    borderTop: '1px solid rgba(255,255,255,0.02)'
};
