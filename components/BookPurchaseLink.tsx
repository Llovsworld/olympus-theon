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
        </div>
    );
}
