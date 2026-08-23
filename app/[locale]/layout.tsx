import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from '@/components/PageTransition';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    // The English routes are not translated yet. Keep them available for
    // navigation work, but do not let search engines index duplicate Spanish
    // content as English.
    return locale === 'en'
        ? { robots: { index: false, follow: true } }
        : {};
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Await params as it's a Promise in Next.js 15+
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as typeof routing.locales[number])) {
        notFound();
    }

    // Let next-intl use the route param rather than request headers. This keeps
    // localized public pages eligible for static generation and revalidation.
    setRequestLocale(locale);

    return (
        <>
            <PageTransition>
                {/* Fixed Background Layer - The Infinite Tunnel */}
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                        zIndex: -1,
                        backgroundImage: 'url(\'/snake-bg.webp\')',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        opacity: 0.5,
                    }}
                />
                <Header />
                <main style={{ minHeight: '80vh', position: 'relative', zIndex: 1 }}>
                    {children}
                </main>
                <Footer />
            </PageTransition>
            <Script id="register-service-worker" strategy="lazyOnload">
                {`if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(() => {}); }`}
            </Script>
            <Analytics />
            <SpeedInsights />
        </>
    );
}
