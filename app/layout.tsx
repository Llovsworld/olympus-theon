import type { Metadata } from "next";
import localFont from "next/font/local";
import { AUTHOR_NAME, DEFAULT_LOCALE, SITE_NAME, SITE_URL, serializeJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = localFont({
    src: "./fonts/inter-latin-variable.woff2",
    display: "swap",
    variable: "--font-inter",
    weight: "100 900",
});

const dancingScript = localFont({
    src: "./fonts/dancing-script-latin-variable.woff2",
    display: "swap",
    variable: "--font-dancing-script",
    weight: "400 700",
    preload: false,
});

export const metadata: Metadata = {
    title: {
        default: "Olympus Theon | Forjando Personas de Élite",
        template: "%s | Olympus Theon"
    },
    description: "Carácter, disciplina y filosofía del esfuerzo absoluto. Programas de coaching, mentoría y desarrollo personal para personas comprometidas con su crecimiento.",
    keywords: ["coaching personal", "desarrollo personal", "mentoría de alto rendimiento", "disciplina", "estoicismo", "Olympus Theon"],
    authors: [{ name: AUTHOR_NAME, url: `${SITE_URL}/#fundador` }],
    creator: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    openGraph: {
        type: "website",
        locale: DEFAULT_LOCALE,
        url: SITE_URL,
        siteName: SITE_NAME,
        title: "Olympus Theon | Forjando Personas de Élite",
        description: "Carácter, disciplina y filosofía del esfuerzo absoluto. Programas de coaching y desarrollo personal.",
        images: [
            {
                url: "/og.png",
                width: 1200,
                height: 630,
                alt: "Olympus Theon - Forjando Personas de Élite",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Olympus Theon | Forjando Personas de Élite",
        description: "Carácter, disciplina y filosofía del esfuerzo absoluto.",
        images: ["/og.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "oPiCVEb06jS93n8iwMmlO7322lZ-eC8HVUcRM-XCT5I",
    },
    icons: {
        icon: "/icon-192.png",
        apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="es"
            className={`${inter.variable} ${dancingScript.variable}`}
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <head>
                {/* PWA Meta Tags */}
                <meta name="application-name" content="Olympus Theon" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Olympus Theon" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#050505" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: serializeJsonLd({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "Organization",
                                    "@id": `${SITE_URL}/#organization`,
                                    "name": SITE_NAME,
                                    "url": SITE_URL,
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": `${SITE_URL}/icon-512.png`
                                    },
                                    "founder": {
                                        "@type": "Person",
                                        "@id": `${SITE_URL}/#alejandro-lloveras`,
                                        "name": AUTHOR_NAME,
                                        "url": `${SITE_URL}/#fundador`
                                    },
                                    "description": "Carácter, disciplina y filosofía del esfuerzo absoluto.",
                                    "sameAs": [
                                        "https://wa.me/34608961701"
                                    ]
                                },
                                {
                                    "@type": "WebSite",
                                    "@id": `${SITE_URL}/#website`,
                                    "url": SITE_URL,
                                    "name": SITE_NAME,
                                    "publisher": {
                                        "@id": `${SITE_URL}/#organization`
                                    },
                                    "inLanguage": "es-ES"
                                }
                            ]
                        })
                    }}
                />
            </head>
            <body className={inter.className} style={{ backgroundColor: '#050505', color: '#ededed' }} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
