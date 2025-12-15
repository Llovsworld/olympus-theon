import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Contacto",
    description: "Inicia tu transformación. Contacta con Olympus Theon para mentoría, dudas o acceso a la comunidad privada.",
    openGraph: {
        title: "Contacto | Olympus Theon",
        description: "Inicia tu transformación. Contacta con nosotros.",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
