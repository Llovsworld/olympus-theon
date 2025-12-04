import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    if (!['en', 'es'].includes(locale)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            {/* Fixed Background Layer - The Infinite Tunnel */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    zIndex: -1,
                    backgroundImage: 'url(\'/snake_bg_user.jpg\')',
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
        </NextIntlClientProvider>
    );
}
