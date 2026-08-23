import { Metadata } from 'next';
import { DEFAULT_LOCALE, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: "Contacto",
    description: "Inicia tu transformación. Contacta con Olympus Theon para mentoría, dudas o acceso a la comunidad privada.",
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
        title: "Contacto | Olympus Theon",
        description: "Inicia tu transformación. Contacta con nosotros.",
        url: `${SITE_URL}/contact`,
        siteName: SITE_NAME,
        locale: DEFAULT_LOCALE,
        images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contacto | Olympus Theon',
        description: 'Inicia tu transformación. Contacta con nosotros.',
        images: [`${SITE_URL}/og.png`],
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
