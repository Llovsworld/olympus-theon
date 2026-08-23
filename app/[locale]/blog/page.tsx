import BlogList from '@/components/BlogList';
import ScrollReveal from '@/components/ScrollReveal';
import { Metadata } from 'next';
import { getPublishedPostList } from '@/lib/content';
import { permanentRedirect } from 'next/navigation';
import { DEFAULT_LOCALE, SITE_NAME, SITE_URL } from '@/lib/seo';

const description = 'Psicología, disciplina y desarrollo personal aplicados a una vida con más claridad, fortaleza y propósito.';

type BlogPageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const { locale } = await params;
    const canonical = `${SITE_URL}/blog`;

    return {
        title: 'Blog',
        description,
        alternates: { canonical },
        robots: locale === 'es' ? undefined : { index: false, follow: true },
        openGraph: {
            title: `Blog | ${SITE_NAME}`,
            description,
            type: 'website',
            url: canonical,
            siteName: SITE_NAME,
            locale: DEFAULT_LOCALE,
            images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: SITE_NAME }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Blog | ${SITE_NAME}`,
            description,
            images: [`${SITE_URL}/og.png`],
        },
    };
}

export const revalidate = 300;

export default async function BlogPage({ params }: BlogPageProps) {
    const { locale } = await params;
    if (locale !== 'es') {
        permanentRedirect('/blog');
    }

    const posts = await getPublishedPostList();

    return (
        <div style={{ minHeight: '100vh', background: '#050505' }}>
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
