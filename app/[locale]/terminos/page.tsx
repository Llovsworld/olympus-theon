import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LegalCallout, LegalPage, LegalSection } from '@/components/legal/LegalPage';
import { LEGAL_LAST_UPDATED, legalPublic } from '@/lib/legal-public';
import { legalPagesEnabled } from '@/lib/legal-identity';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'Condiciones de uso',
    description: 'Condiciones de acceso, uso y solicitud de información sobre los programas de Olympus Theon.',
    alternates: { canonical: `${SITE_URL}/terminos` },
};

const toc = [
    { href: '#alcance' as const, label: 'Alcance' },
    { href: '#servicios' as const, label: 'Información sobre servicios' },
    { href: '#salud' as const, label: 'Salud y resultados' },
    { href: '#contratacion' as const, label: 'Contratación futura' },
    { href: '#uso' as const, label: 'Uso del sitio' },
    { href: '#contacto' as const, label: 'Contacto' },
];

export default function TermsPage() {
    if (!legalPagesEnabled) notFound();

    return (
        <LegalPage
            eyebrow="Reglas del servicio"
            title="Condiciones de uso"
            summary="Estas condiciones regulan la navegación y las solicitudes de información. La web no formaliza actualmente pagos ni contratos en línea."
            updated={LEGAL_LAST_UPDATED}
            toc={toc}
        >
            <LegalCallout title="Importante">
                <p>
                    Enviar un formulario o escribir por WhatsApp no implica admisión en un programa ni genera una
                    obligación de pago. Antes de contratar se facilitarán por escrito el alcance, precio total,
                    impuestos, duración, cancelaciones y demás condiciones aplicables.
                </p>
            </LegalCallout>

            <LegalSection id="alcance" title="1. Alcance y aceptación">
                <p>
                    Al utilizar este sitio aceptas estas condiciones en lo relativo a la navegación y al uso de sus
                    contenidos. Si no estás de acuerdo, puedes dejar de utilizarlo. Las condiciones específicas de un
                    programa prevalecerán sobre este texto cuando se formalicen expresamente y no podrán reducir los
                    derechos imperativos de consumidores y usuarios.
                </p>
            </LegalSection>

            <LegalSection id="servicios" title="2. Información sobre programas y disponibilidad">
                <p>
                    Las páginas de programas son informativas. La disponibilidad, plazas, calendario y adecuación se
                    confirman individualmente. Las descripciones pueden actualizarse para reflejar mejoras, siempre sin
                    alterar una contratación ya formalizada salvo acuerdo válido entre las partes.
                </p>
                <p>
                    Las imágenes, ejemplos y referencias a rendimiento describen el enfoque del servicio, no una
                    promesa de resultados concretos. Cualquier precio que llegue a mostrarse indicará si incluye
                    impuestos y los gastos adicionales aplicables antes de contratar.
                </p>
            </LegalSection>

            <LegalSection id="salud" title="3. Naturaleza educativa, salud y resultados">
                <p>
                    Olympus Theon ofrece acompañamiento educativo y de desarrollo personal. Salvo que un contrato
                    identifique expresamente a un profesional sanitario habilitado, el servicio no constituye atención
                    médica, psicológica, psiquiátrica, fisioterapéutica ni nutrición clínica, y no sustituye diagnóstico,
                    tratamiento o seguimiento profesional.
                </p>
                <p>
                    Antes de modificar entrenamiento, alimentación o hábitos que puedan afectar a tu salud, consulta a
                    un profesional cualificado, especialmente si existe una enfermedad, lesión, embarazo, medicación o
                    antecedente relevante. En una emergencia, contacta con los servicios de emergencia de tu país.
                </p>
                <p>
                    Los resultados dependen del punto de partida, contexto, decisiones y constancia de cada persona. No
                    se garantizan transformaciones, ingresos, rendimiento físico ni resultados emocionales específicos.
                </p>
            </LegalSection>

            <LegalSection id="contratacion" title="4. Contratación, pagos y desistimiento">
                <p>
                    Actualmente el sitio no integra checkout. Si se ofrece una contratación a distancia, antes del pago
                    recibirás en soporte duradero la identidad del prestador, características, precio total, impuestos,
                    duración, sesiones, forma de prestación, política de reprogramación, cancelación, reclamaciones y el
                    derecho de desistimiento que legalmente corresponda.
                </p>
                <p>
                    Si solicitas que un servicio comience durante el plazo legal de desistimiento, se recabará de forma
                    separada la petición y el reconocimiento exigidos por la normativa. Ninguna cláusula excluye los
                    derechos que no puedan renunciarse legalmente.
                </p>
                <p>
                    No debe aceptarse ningún pago ni iniciarse una prestación hasta haber entregado y aceptado esas
                    condiciones específicas en un soporte que la persona pueda conservar.
                </p>
            </LegalSection>

            <LegalSection id="uso" title="5. Conducta, propiedad intelectual y disponibilidad">
                <p>
                    Debes utilizar el sitio de forma lícita, sin intentar acceder a zonas privadas, alterar el servicio,
                    introducir malware, automatizar abusivamente solicitudes o vulnerar derechos de terceros. Los
                    contenidos propios no pueden explotarse comercialmente sin autorización.
                </p>
                <p>
                    Podemos realizar mantenimiento, corregir errores o retirar contenidos. Procuraremos que el servicio
                    sea accesible y seguro, pero no garantizamos disponibilidad ininterrumpida. Consulta también el{' '}
                    <Link href="/aviso-legal">Aviso legal</Link>.
                </p>
            </LegalSection>

            <LegalSection id="contacto" title="6. Consultas y reclamaciones">
                <p>
                    Para consultas sobre estas condiciones o una futura contratación, escribe a{' '}
                    <a href={`mailto:${legalPublic.email}`}>{legalPublic.email}</a> o llama al{' '}
                    <a href={`tel:${legalPublic.phoneHref}`}>{legalPublic.phoneDisplay}</a>. El tratamiento de tus datos
                    se rige por la <Link href="/privacidad">Política de privacidad</Link>.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
