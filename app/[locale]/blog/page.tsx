import { prisma } from '@/lib/prisma';
import BlogList from '@/components/BlogList';
import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div style={{ minHeight: '100vh', background: '#050505' }}>
            {/* Header Section with Background */}
            <div style={{
                padding: '8rem 0 4rem',
                textAlign: 'center',
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url("/snake_bg_user.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                marginBottom: '3rem',
                borderBottom: '1px solid #1f1f1f'
            }}>
                <div className="container">
                    <ScrollReveal variant="scale">
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: '800',
                            marginBottom: '1rem',
                            color: '#fff',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            background: 'linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 30px rgba(255, 255, 255, 0.1)'
                        }}>
                            BLOG
                        </h1>
                    </ScrollReveal>
                    <ScrollReveal variant="fade" delay={200}>
                        <p style={{
                            color: '#ccc',
                            fontSize: '1.1rem',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: '1.6'
                        }}>
                            Pensamientos, ideas y reflexiones sobre el camino hacia la excelencia.
                        </p>
                    </ScrollReveal>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '6rem', maxWidth: '1200px', margin: '0 auto' }}>
                <BlogList posts={posts} />
            </div>
        </div>
    );
}
