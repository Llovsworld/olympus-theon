import type { Metadata } from 'next';

import { LegalCallout, LegalPage, LegalSection } from '@/components/legal/LegalPage';
import { LEGAL_LAST_UPDATED, legalPublic } from '@/lib/legal-public';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'Accesibilidad',
    description: 'Compromiso, medidas y canal de comunicación sobre accesibilidad de Olympus Theon.',
    alternates: { canonical: `${SITE_URL}/accesibilidad` },
};

const toc = [
    { href: '#compromiso' as const, label: 'Compromiso' },
    { href: '#medidas' as const, label: 'Medidas aplicadas' },
    { href: '#limitaciones' as const, label: 'Limitaciones conocidas' },
    { href: '#contacto' as const, label: 'Comunicar una barrera' },
];

export default function AccessibilityPage() {
    return (
        <LegalPage
            eyebrow="Experiencia inclusiva"
            title="Declaración de accesibilidad"
            summary="Nuestro objetivo es que los contenidos y funciones de Olympus Theon puedan utilizarse con independencia del dispositivo o de las capacidades de cada persona."
            updated={LEGAL_LAST_UPDATED}
            toc={toc}
        >
            <LegalCallout title="Estado de la revisión">
                <p>
                    Se ha realizado una revisión técnica interna de las rutas principales. Esta declaración no afirma
                    una certificación formal de conformidad total; describe las medidas aplicadas y el trabajo continuo.
                </p>
            </LegalCallout>

            <LegalSection id="compromiso" title="1. Compromiso">
                <p>
                    Tomamos como referencia las Pautas de Accesibilidad para el Contenido Web WCAG 2.2, nivel AA. La
                    accesibilidad se considera en la estructura semántica, navegación por teclado, legibilidad,
                    formularios, foco visible, contenido adaptable y reducción de barreras en móviles.
                </p>
            </LegalSection>

            <LegalSection id="medidas" title="2. Medidas aplicadas">
                <ul>
                    <li>Enlace para saltar al contenido principal y regiones semánticas identificables.</li>
                    <li>Foco visible y objetivos táctiles adecuados en controles principales.</li>
                    <li>Etiquetas, autocompletado, estados y mensajes anunciables en formularios.</li>
                    <li>Diseño adaptable sin desplazamiento horizontal en anchos habituales.</li>
                    <li>Textos alternativos en imágenes relevantes y enlaces con propósito reconocible.</li>
                    <li>Respeto por la preferencia del sistema para reducir movimiento cuando está disponible.</li>
                    <li>Bloqueo informado del contenido externo antes de cargar vídeos de terceros.</li>
                </ul>
            </LegalSection>

            <LegalSection id="limitaciones" title="3. Limitaciones conocidas">
                <p>
                    Algunos contenidos editoriales antiguos o materiales de terceros podrían no alcanzar todavía el
                    mismo nivel de accesibilidad. Los vídeos externos dependen además de los controles y subtítulos que
                    ofrezca su proveedor. Revisaremos las incidencias comunicadas y priorizaremos las que impidan acceder
                    a información o completar una función esencial.
                </p>
            </LegalSection>

            <LegalSection id="contacto" title="4. Comunicar una barrera de accesibilidad">
                <p>
                    Si encuentras una barrera, escribe a <a href={`mailto:${legalPublic.email}`}>{legalPublic.email}</a>{' '}
                    indicando la página, el problema, el navegador o tecnología de apoyo utilizada y, si puedes, una
                    captura. Responderemos con una alternativa accesible o con información sobre la corrección prevista.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
