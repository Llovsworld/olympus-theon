import BlogList from '@/components/BlogList';
import ScrollReveal from '@/components/ScrollReveal';
import { Metadata } from 'next';
import { getPublishedPostList } from '@/lib/content';

export const metadata: Metadata = {
    title: "Blog",
    description: "Pensamientos, ideas y reflexiones sobre el camino hacia la excelencia. Artículos sobre desarrollo personal, estoicismo y alto rendimiento.",
    openGraph: {
        title: "Blog | Olympus Theon",
        description: "Artículos sobre desarrollo personal, estoicismo y alto rendimiento.",
    },
};

export const revalidate = 300;

export default async function BlogPage() {
    const posts = await getPublishedPostList();

    return (
        <div style={{ minHeight: '100vh', background: '#050505' }}>
            {/* Header Section with Background */}
            {/* Header Section with Background */}
            <div className="page-hero" style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url("/snake-bg.webp")'
            }}>
                <div className="container">
                    <ScrollReveal variant="scale">
                        <h1 className="page-hero-title">
                            BLOG
                        </h1>
                    </ScrollReveal>
                    <ScrollReveal variant="fade" delay={200}>
                        <p className="page-hero-subtitle">
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
