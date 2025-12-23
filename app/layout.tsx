import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import PageTransition from "@/components/PageTransition";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
    title: {
        default: "Olympus Theon | Forjando Hombres de Élite",
        template: "%s | Olympus Theon"
    },
    description: "Potenciando la masculinidad y la filosofía del esfuerzo absoluto. Programas de coaching, mentoría y desarrollo personal para hombres.",
    keywords: ["coaching masculino", "desarrollo personal", "mentoría hombres", "alto rendimiento", "estoicismo", "Olympus Theon"],
    authors: [{ name: "Alejandro Lloveras" }],
    creator: "Olympus Theon",
    metadataBase: new URL("https://olympustheon.com"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "es_ES",
        url: "https://olympustheon.com",
        siteName: "Olympus Theon",
        title: "Olympus Theon | Forjando Hombres de Élite",
        description: "Potenciando la masculinidad y la filosofía del esfuerzo absoluto. Programas de coaching y desarrollo personal.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Olympus Theon - Forjando Hombres de Élite",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Olympus Theon | Forjando Hombres de Élite",
        description: "Potenciando la masculinidad y la filosofía del esfuerzo absoluto.",
        images: ["/og-image.png"],
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
    icons: {
        icon: "/olympus_logo.png",
        apple: "/olympus_logo.png",
    },
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                {/* PWA Meta Tags */}
                <meta name="application-name" content="Olympus Theon" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Olympus Theon" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#050505" />
                <link rel="apple-touch-icon" href="/olympus_logo.png" />

                {/* DNS Prefetch and Preconnect */}
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* Preload critical resources */}
                <link rel="preload" href="/hero-gym.png" as="image" />

                {/* Google Fonts */}
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600&display=swap" rel="stylesheet" />


                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "Organization",
                                    "@id": "https://olympustheon.com/#organization",
                                    "name": "Olympus Theon",
                                    "url": "https://olympustheon.com",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://olympustheon.com/olympus_logo.png"
                                    },
                                    "founder": {
                                        "@type": "Person",
                                        "name": "Alejandro Lloveras"
                                    },
                                    "description": "Potenciando la masculinidad y la filosofía del esfuerzo absoluto.",
                                    "sameAs": [
                                        "https://wa.me/34608961701"
                                    ]
                                },
                                {
                                    "@type": "WebSite",
                                    "@id": "https://olympustheon.com/#website",
                                    "url": "https://olympustheon.com",
                                    "name": "Olympus Theon",
                                    "publisher": {
                                        "@id": "https://olympustheon.com/#organization"
                                    },
                                    "inLanguage": "es-ES"
                                }
                            ]
                        })
                    }}
                />
            </head>
            <body className={inter.className} style={{ backgroundColor: '#050505', color: '#ededed' }} suppressHydrationWarning>
                <ServiceWorkerRegistration />
                <Providers>
                    <PageTransition>
                        {children}
                    </PageTransition>
                </Providers>
            </body>
        </html>
    );
}
