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
    if (locale !== 'es') {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <div className="site-backdrop" aria-hidden="true" />
            <Header />
            <main id="main-content" tabIndex={-1} className="site-main">
                {children}
            </main>
            <Footer />
        </NextIntlClientProvider>
    );
}
