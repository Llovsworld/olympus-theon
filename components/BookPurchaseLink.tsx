'use client';

import { track } from '@vercel/analytics';

interface BookPurchaseLinkProps {
    href: string;
    bookSlug: string;
    isAmazonAffiliate: boolean;
}

export default function BookPurchaseLink({
    href,
    bookSlug,
    isAmazonAffiliate,
}: BookPurchaseLinkProps) {
    const disclosureId = `book-affiliate-disclosure-${bookSlug}`;

    function trackOutboundClick() {
        track('book_outbound_click', {
            book: bookSlug,
            retailer: isAmazonAffiliate ? 'amazon' : 'external',
            affiliate: isAmazonAffiliate,
        });
    }

    return (
        <div style={{ marginTop: '3rem' }}>
            <a
                href={href}
                target="_blank"
                rel={isAmazonAffiliate
                    ? 'sponsored nofollow noopener noreferrer'
                    : 'nofollow noopener noreferrer'}
                aria-describedby={isAmazonAffiliate ? disclosureId : undefined}
                onClick={trackOutboundClick}
                className="btn"
                style={{
                    background: '#FFD700',
                    color: '#000',
                    border: 'none',
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                }}
            >
                {isAmazonAffiliate ? 'Ver libro en Amazon' : 'Obtener este libro'}
            </a>

            {isAmazonAffiliate ? (
                <div
                    id={disclosureId}
                    style={{
                        maxWidth: '640px',
                        margin: '1rem auto 0',
                        color: '#c8c8c8',
                        fontSize: '0.78rem',
                        lineHeight: 1.55,
                    }}
                >
                    <p style={{ margin: 0 }}>
                        <strong style={{ color: '#ededed' }}>Publicidad · Enlace de afiliado.</strong>{' '}
                        Si compras a través de este enlace, Olympus Theon puede recibir una comisión sin coste
                        adicional para ti.
                    </p>
                    <p style={{ margin: '0.35rem 0 0' }}>
                        En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los
                        requisitos aplicables.
                    </p>
                </div>
            ) : null}
        </div>
    );
}
