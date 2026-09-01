import type { Metadata } from 'next';
import Link from 'next/link';

import { LegalCallout, LegalPage, LegalSection } from '@/components/legal/LegalPage';
import { LEGAL_LAST_UPDATED, legalPublic } from '@/lib/legal-public';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'Política de cookies',
    description: 'Cookies y tecnologías similares utilizadas por Olympus Theon.',
    alternates: { canonical: `${SITE_URL}/cookies` },
};

const toc = [
    { href: '#resumen' as const, label: 'Resumen' },
    { href: '#inventario' as const, label: 'Tecnologías utilizadas' },
    { href: '#youtube' as const, label: 'Contenido externo' },
    { href: '#control' as const, label: 'Cómo controlarlas' },
    { href: '#cambios' as const, label: 'Cambios y contacto' },
];

export default function CookiesPage() {
    return (
        <LegalPage
            eyebrow="Privacidad técnica"
            title="Política de cookies y tecnologías similares"
            summary="Inventario real de las tecnologías que utiliza Olympus Theon y de las que no utiliza."
            updated={LEGAL_LAST_UPDATED}
            toc={toc}
        >
            <LegalCallout title="No utilizamos cookies publicitarias">
                <p>
                    Actualmente no usamos Google Analytics, Meta Pixel, perfiles publicitarios ni cookies opcionales
                    en las páginas públicas. Por ese motivo no mostramos un banner de aceptación vacío o engañoso.
                </p>
            </LegalCallout>

            <LegalSection id="resumen" title="1. Qué entendemos por cookies y tecnologías similares">
                <p>
                    Una cookie es un pequeño archivo que un sitio puede guardar en el navegador. También existen
                    tecnologías con funciones parecidas, como el almacenamiento local, Cache Storage o identificadores
                    técnicos. Algunas son imprescindibles para seguridad y funcionamiento; otras requieren información
                    y consentimiento previo cuando se usan para análisis identificable, personalización o publicidad.
                </p>
                <p>
                    Olympus Theon limita el almacenamiento a funciones técnicas: autenticación del panel privado y
                    Cache Storage para carga y resiliencia de páginas públicas. También utiliza métricas diseñadas para
                    funcionar sin cookies. Las cookies estrictamente necesarias están exceptuadas del consentimiento,
                    aunque se explican aquí por transparencia.
                </p>
            </LegalSection>

            <LegalSection id="inventario" title="2. Inventario actual">
                <div className="legal-table-wrap">
                    <table className="legal-table">
                        <thead>
                            <tr><th>Tecnología</th><th>Proveedor y finalidad</th><th>Duración / alcance</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Cookies de sesión de NextAuth</td>
                                <td>Propias. Autentican y protegen exclusivamente el panel de administración.</td>
                                <td>Sesión o hasta 30 días según la cookie técnica. No se usan para visitantes públicos.</td>
                            </tr>
                            <tr>
                                <td>Cookies CSRF y de retorno</td>
                                <td>Propias. Previenen solicitudes fraudulentas y completan el inicio de sesión administrativo.</td>
                                <td>Temporales y restringidas al flujo de autenticación.</td>
                            </tr>
                            <tr>
                                <td>Cache Storage / service worker</td>
                                <td>Propia. Conserva recursos y un máximo limitado de páginas públicas para mejorar carga y resiliencia.</td>
                                <td>Hasta que se actualiza la caché, el navegador la elimina o la persona borra los datos del sitio.</td>
                            </tr>
                            <tr>
                                <td>Vercel Web Analytics</td>
                                <td>Vercel. Estadísticas agregadas de páginas, procedencia aproximada y dispositivo sin cookies de terceros.</td>
                                <td>Identificador temporal derivado de la solicitud, descartado automáticamente tras 24 horas.</td>
                            </tr>
                            <tr>
                                <td>Vercel Speed Insights</td>
                                <td>Vercel. Métricas anónimas de rendimiento y Core Web Vitals.</td>
                                <td>No reconstruye sesiones ni identifica a visitantes.</td>
                            </tr>
                            <tr>
                                <td>Contador de lecturas</td>
                                <td>Propio. Incrementa un contador agregado por artículo o libro, sin identificador de visitante.</td>
                                <td>El total agregado se conserva con el contenido.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p>
                    El almacenamiento local de borradores solo existe dentro del panel administrativo y no se utiliza
                    para observar el comportamiento de las personas visitantes.
                </p>
            </LegalSection>

            <LegalSection id="youtube" title="3. Vídeos y contenido de terceros">
                <p>
                    Un vídeo de YouTube puede comunicar a Google datos técnicos como la dirección IP o el navegador.
                    Para evitar esa conexión automática, los vídeos aparecen bloqueados inicialmente. Solo se crea el
                    iframe de <code>youtube-nocookie.com</code> cuando pulsas “Reproducir vídeo de YouTube”.
                </p>
                <p>
                    Esa decisión se aplica al vídeo concreto y no se guarda como una aceptación general. Antes de
                    cargarlo puedes consultar la{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidad de Google</a>.
                    Los enlaces a WhatsApp, Instagram, X, Substack u otros sitios solo conectan con esos servicios cuando
                    decides abrirlos.
                </p>
            </LegalSection>

            <LegalSection id="control" title="4. Cómo controlar o eliminar el almacenamiento">
                <p>
                    Puedes eliminar cookies y datos del sitio desde la configuración de privacidad de tu navegador.
                    Bloquear cookies técnicas puede impedir el acceso al panel privado, pero no afecta a la navegación
                    pública ordinaria. La caché del sitio puede borrarse desde los ajustes de almacenamiento del navegador.
                </p>
                <p>
                    Si en el futuro incorporamos una tecnología opcional —por ejemplo publicidad, analítica con
                    identificadores o widgets cargados automáticamente— permanecerá bloqueada hasta ofrecer opciones
                    equivalentes de aceptar, rechazar y configurar.
                </p>
            </LegalSection>

            <LegalSection id="cambios" title="5. Cambios y contacto">
                <p>
                    Revisaremos esta política cuando cambie el inventario técnico. Para preguntas, escribe a{' '}
                    <a href={`mailto:${legalPublic.email}`}>{legalPublic.email}</a>. La información general sobre datos
                    personales está en la <Link href="/privacidad">Política de privacidad</Link>.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
