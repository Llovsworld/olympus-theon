import type { Metadata } from 'next';
import Link from 'next/link';

import { LegalCallout, LegalPage, LegalSection } from '@/components/legal/LegalPage';
import { hasCompleteLegalIdentity, legalIdentity } from '@/lib/legal-identity';
import { LEGAL_LAST_UPDATED } from '@/lib/legal-public';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'Aviso legal',
    description: 'Identificación del titular y condiciones generales de acceso y uso de Olympus Theon.',
    alternates: { canonical: `${SITE_URL}/aviso-legal` },
};

const toc = [
    { href: '#titular' as const, label: 'Titular del sitio' },
    { href: '#finalidad' as const, label: 'Finalidad y acceso' },
    { href: '#propiedad' as const, label: 'Propiedad intelectual' },
    { href: '#responsabilidad' as const, label: 'Responsabilidad' },
    { href: '#enlaces' as const, label: 'Enlaces externos' },
    { href: '#ley' as const, label: 'Ley aplicable' },
];

export default function LegalNoticePage() {
    return (
        <LegalPage
            eyebrow="Información legal"
            title="Aviso legal"
            summary="Información sobre la persona responsable de Olympus Theon y las reglas básicas de utilización de este sitio web."
            updated={LEGAL_LAST_UPDATED}
            toc={toc}
        >
            {!hasCompleteLegalIdentity ? (
                <LegalCallout title="Identificación pendiente de completar" tone="warning">
                    <p>
                        El NIF y el domicilio profesional deben configurarse antes de publicar esta página.
                        No se utilizan datos ficticios ni marcadores que puedan confundir a las personas usuarias.
                    </p>
                </LegalCallout>
            ) : null}

            <LegalSection id="titular" title="1. Titular del sitio">
                <dl className="legal-data-list">
                    <div><dt>Titular</dt><dd>{legalIdentity.responsibleName}</dd></div>
                    <div><dt>Nombre comercial</dt><dd>{legalIdentity.brandName}</dd></div>
                    <div><dt>NIF</dt><dd>{legalIdentity.taxId ?? 'Pendiente de configurar'}</dd></div>
                    <div><dt>Domicilio profesional</dt><dd>{legalIdentity.postalAddress ?? 'Pendiente de configurar'}</dd></div>
                    {legalIdentity.registryDetails ? (
                        <div><dt>Datos registrales</dt><dd>{legalIdentity.registryDetails}</dd></div>
                    ) : null}
                    <div>
                        <dt>Correo electrónico</dt>
                        <dd><a href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</a></dd>
                    </div>
                    <div>
                        <dt>Teléfono</dt>
                        <dd><a href={`tel:${legalIdentity.phoneHref}`}>{legalIdentity.phoneDisplay}</a></dd>
                    </div>
                    <div><dt>Sitio web</dt><dd><a href={legalIdentity.siteUrl}>{legalIdentity.siteUrl}</a></dd></div>
                </dl>
                <p>
                    Este aviso se facilita de conformidad con la Ley 34/2002, de servicios de la sociedad de la
                    información y de comercio electrónico (LSSI-CE).
                </p>
            </LegalSection>

            <LegalSection id="finalidad" title="2. Finalidad y acceso al sitio">
                <p>
                    Olympus Theon publica contenidos sobre disciplina, desarrollo personal, filosofía práctica,
                    hábitos y rendimiento, y presenta servicios que pueden solicitarse mediante contacto directo.
                    La navegación general es gratuita y no requiere registro.
                </p>
                <p>
                    El acceso al sitio no crea por sí mismo una relación profesional ni implica la contratación de
                    ningún programa. Las condiciones concretas de cada servicio se facilitarán antes de que la persona
                    interesada asuma una obligación de pago.
                </p>
            </LegalSection>

            <LegalSection id="propiedad" title="3. Propiedad intelectual e industrial">
                <p>
                    Los textos, fotografías, elementos gráficos, identidad visual, código y demás contenidos propios
                    están protegidos por la normativa aplicable. Se permite enlazar y compartir las URL públicas,
                    citando la fuente, pero no reproducir, explotar, transformar o distribuir sustancialmente los
                    contenidos sin autorización previa, salvo los usos permitidos por la ley.
                </p>
                <p>
                    Las marcas, obras y materiales de terceros pertenecen a sus respectivos titulares y se utilizan,
                    cuando procede, con fines informativos, de comentario o mediante las licencias correspondientes.
                </p>
            </LegalSection>

            <LegalSection id="responsabilidad" title="4. Responsabilidad y uso adecuado">
                <p>
                    Se procura mantener la información correcta, segura y disponible, pero no puede garantizarse la
                    ausencia absoluta de errores, interrupciones o incidencias técnicas. Los contenidos son generales
                    y educativos: no constituyen diagnóstico ni tratamiento médico, psicológico, nutricional o
                    sanitario, ni sustituyen la atención de profesionales cualificados.
                </p>
                <p>
                    Queda prohibido utilizar el sitio para introducir código malicioso, intentar accesos no autorizados,
                    vulnerar derechos de terceros o realizar actividades contrarias a la ley. La persona usuaria es
                    responsable de las decisiones que adopte a partir de información general y de solicitar ayuda
                    profesional cuando su situación lo requiera.
                </p>
            </LegalSection>

            <LegalSection id="enlaces" title="5. Enlaces y servicios de terceros">
                <p>
                    El sitio puede contener enlaces a servicios externos como WhatsApp, YouTube, Instagram, Substack
                    o librerías. Al abandonar Olympus Theon se aplican las condiciones y políticas del tercero. La
                    inclusión de un enlace no supone controlar ni respaldar todo su contenido.
                </p>
                <p>
                    Los contenidos de YouTube no se cargan automáticamente: se informa y se requiere una acción expresa
                    antes de conectar con esa plataforma. Consulta la <Link href="/cookies">Política de cookies y tecnologías similares</Link>.
                </p>
            </LegalSection>

            <LegalSection id="ley" title="6. Legislación aplicable y contacto">
                <p>
                    Este sitio se rige por la legislación española y europea aplicable. Cualquier controversia se
                    someterá a los juzgados y tribunales que correspondan conforme a las normas imperativas de
                    competencia, respetando en todo caso los derechos de consumidores y usuarios.
                </p>
                <p>
                    Para comunicar una incidencia legal, escribe a <a href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</a>.
                    El tratamiento de datos personales se explica en la <Link href="/privacidad">Política de privacidad</Link>.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
