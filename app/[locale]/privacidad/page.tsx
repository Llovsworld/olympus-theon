import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LegalCallout, LegalPage, LegalSection } from '@/components/legal/LegalPage';
import {
    hasCompleteLegalIdentity,
    legalPagesEnabled,
    hasConfirmedProcessorCoverage,
    legalIdentity,
} from '@/lib/legal-identity';
import { LEGAL_LAST_UPDATED } from '@/lib/legal-public';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'Política de privacidad',
    description: 'Cómo Olympus Theon recoge, utiliza, conserva y protege los datos personales.',
    alternates: { canonical: `${SITE_URL}/privacidad` },
};

const toc = [
    { href: '#responsable' as const, label: 'Responsable' },
    { href: '#tratamientos' as const, label: 'Datos y finalidades' },
    { href: '#destinatarios' as const, label: 'Proveedores y transferencias' },
    { href: '#conservacion' as const, label: 'Conservación' },
    { href: '#derechos' as const, label: 'Tus derechos' },
    { href: '#menores' as const, label: 'Menores y datos sensibles' },
    { href: '#seguridad' as const, label: 'Seguridad y cambios' },
];

export default function PrivacyPage() {
    if (!legalPagesEnabled) notFound();

    return (
        <LegalPage
            eyebrow="Protección de datos"
            title="Política de privacidad"
            summary="Explicamos qué datos tratamos, para qué los utilizamos y cómo puedes ejercer tus derechos."
            updated={LEGAL_LAST_UPDATED}
            toc={toc}
        >
            {!hasCompleteLegalIdentity ? (
                <LegalCallout title="Identificación pendiente de completar" tone="warning">
                    <p>
                        Esta política no debe publicarse como definitiva hasta incorporar el NIF y el domicilio
                        profesional del responsable mediante la configuración segura del proyecto.
                    </p>
                </LegalCallout>
            ) : null}

            <LegalCallout title="Información esencial">
                <p>
                    Responsable: {legalIdentity.responsibleName}. Contacto para privacidad:{' '}
                    <a href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</a>. No vendemos datos personales,
                    no realizamos publicidad comportamental y no adoptamos decisiones automatizadas con efectos jurídicos.
                </p>
            </LegalCallout>

            <LegalSection id="responsable" title="1. Responsable del tratamiento">
                <dl className="legal-data-list">
                    <div><dt>Responsable</dt><dd>{legalIdentity.responsibleName}</dd></div>
                    <div><dt>Marca</dt><dd>{legalIdentity.brandName}</dd></div>
                    <div><dt>NIF</dt><dd>{legalIdentity.taxId ?? 'Pendiente de configurar'}</dd></div>
                    <div><dt>Domicilio profesional</dt><dd>{legalIdentity.postalAddress ?? 'Pendiente de configurar'}</dd></div>
                    <div><dt>Privacidad y derechos</dt><dd><a href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</a></dd></div>
                </dl>
            </LegalSection>

            <LegalSection id="tratamientos" title="2. Qué datos tratamos y para qué">
                <div className="legal-table-wrap">
                    <table className="legal-table">
                        <thead>
                            <tr><th>Actividad</th><th>Datos y finalidad</th><th>Base jurídica</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Contacto</td>
                                <td>Nombre, correo y contenido del mensaje para responder consultas y solicitudes sobre servicios.</td>
                                <td>Medidas precontractuales solicitadas y, para consultas generales, interés legítimo en responder.</td>
                            </tr>
                            <tr>
                                <td>Teléfono y WhatsApp</td>
                                <td>Número, nombre o alias, información de perfil y mensajes que decides enviar para responderte y gestionar una posible relación precontractual.</td>
                                <td>Medidas precontractuales solicitadas y, para consultas generales, interés legítimo en responder.</td>
                            </tr>
                            <tr>
                                <td>Newsletter</td>
                                <td>Correo, fecha, origen, versión del consentimiento, confirmación y estado de baja para enviar artículos y novedades.</td>
                                <td>Consentimiento, confirmado mediante doble verificación.</td>
                            </tr>
                            <tr>
                                <td>Seguridad</td>
                                <td>Dirección IP, fecha, ruta, agente de usuario y registros técnicos mínimos para prevenir abusos y resolver incidencias.</td>
                                <td>Interés legítimo en proteger el sitio y cumplir obligaciones legales.</td>
                            </tr>
                            <tr>
                                <td>Métricas</td>
                                <td>Páginas, procedencia aproximada, dispositivo y métricas de rendimiento de forma agregada y sin cookies publicitarias.</td>
                                <td>Interés legítimo en conocer el uso y mejorar el funcionamiento, con datos minimizados.</td>
                            </tr>
                            <tr>
                                <td>Panel privado</td>
                                <td>Cookie técnica de sesión y actividad administrativa necesaria para gestionar contenidos.</td>
                                <td>Interés legítimo y seguridad del servicio.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p>
                    Los campos marcados como obligatorios son necesarios para prestar la función solicitada. No
                    utilizaremos los datos del formulario de contacto para publicidad sin un consentimiento separado.
                </p>
            </LegalSection>

            <LegalSection id="destinatarios" title="3. Encargados, destinatarios y transferencias">
                <p>Para operar el sitio pueden intervenir las siguientes categorías de proveedores:</p>
                <ul>
                    <li><strong>Vercel:</strong> alojamiento, funciones, archivos, métricas anónimas y seguridad de infraestructura.</li>
                    <li><strong>Neon:</strong> base de datos PostgreSQL para suscripciones, contenido y contadores agregados.</li>
                    <li><strong>Resend:</strong> envío transaccional y de newsletter.</li>
                    <li><strong>Google/Gmail:</strong> recepción y gestión del correo de contacto.</li>
                    <li><strong>Meta/WhatsApp:</strong> gestión de las conversaciones que inicias voluntariamente mediante sus aplicaciones.</li>
                    <li><strong>YouTube/Google:</strong> únicamente cuando decides cargar voluntariamente un vídeo externo.</li>
                </ul>
                {hasConfirmedProcessorCoverage ? (
                    <p>
                        Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo. Cuando procede,
                        se aplican los mecanismos reconocidos por la normativa, como decisiones de adecuación o
                        cláusulas contractuales tipo, según las condiciones vigentes de cada proveedor. No cedemos
                        datos a terceros para sus propios fines comerciales.
                    </p>
                ) : (
                    <LegalCallout title="Cobertura contractual pendiente" tone="warning">
                        <p>
                            Los formularios no deben activarse en producción hasta verificar y documentar los contratos,
                            subencargados, ubicaciones y garantías de transferencia de todos los proveedores implicados.
                        </p>
                    </LegalCallout>
                )}
            </LegalSection>

            <LegalSection id="conservacion" title="4. Durante cuánto tiempo conservamos los datos">
                <ul>
                    <li><strong>Consultas:</strong> durante su gestión y, como criterio general, hasta 12 meses desde la última comunicación, salvo responsabilidades legales.</li>
                    <li><strong>Newsletter:</strong> mientras la suscripción esté activa. Tras la baja se conserva el mínimo necesario en una lista de supresión para respetar la oposición y atender responsabilidades.</li>
                    <li><strong>Confirmaciones pendientes:</strong> el enlace caduca en 24 horas y los registros no confirmados se revisan para su eliminación periódica.</li>
                    <li><strong>Registros técnicos:</strong> durante el periodo mínimo necesario para seguridad, diagnóstico y cumplimiento de las políticas del proveedor.</li>
                    <li><strong>Métricas:</strong> Vercel descarta el identificador temporal de Web Analytics tras 24 horas y conserva estadísticas agregadas según la configuración del servicio.</li>
                </ul>
                <p>
                    Cuando exista una obligación legal o una reclamación, determinados datos podrán mantenerse
                    bloqueados durante los plazos aplicables, sin utilizarlos para otras finalidades.
                </p>
            </LegalSection>

            <LegalSection id="derechos" title="5. Cómo ejercer tus derechos">
                <p>
                    Puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad, o retirar
                    un consentimiento, escribiendo a <a href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</a>.
                    Indica el derecho que deseas ejercer y la información necesaria para localizar tus datos. Podremos
                    pedir una acreditación adicional solo cuando sea imprescindible para verificar tu identidad.
                </p>
                <p>
                    La baja de la newsletter también puede realizarse desde el enlace incluido en cada correo o desde
                    la <Link href="/baja-newsletter">página de baja</Link>. Si consideras que el tratamiento no respeta
                    la normativa, puedes reclamar ante la{' '}
                    <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos</a>.
                </p>
            </LegalSection>

            <LegalSection id="menores" title="6. Menores y datos especialmente sensibles">
                <p>
                    Los programas y formularios de Olympus Theon se dirigen a personas mayores de 18 años. No envíes
                    información médica, psicológica, biométrica, de salud u otras categorías especialmente sensibles a
                    través del formulario general, correo, teléfono o WhatsApp. Si una futura prestación necesitara esa
                    información, se facilitará una información específica y se aplicarán garantías adicionales antes de
                    recogerla.
                </p>
            </LegalSection>

            <LegalSection id="seguridad" title="7. Seguridad, exactitud y cambios">
                <p>
                    Aplicamos medidas razonables de minimización, control de acceso, cifrado en tránsito, validación y
                    separación del panel privado. Ningún sistema conectado a Internet permite garantizar riesgo cero;
                    por eso revisamos las medidas y limitamos los datos solicitados.
                </p>
                <p>
                    Esta política se actualizará cuando cambien los tratamientos, proveedores o requisitos aplicables.
                    La fecha de la versión vigente figura al inicio. Para información sobre almacenamiento en el
                    dispositivo, consulta la <Link href="/cookies">Política de cookies y tecnologías similares</Link>.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
