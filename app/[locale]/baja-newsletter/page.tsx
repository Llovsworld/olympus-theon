import type { Metadata } from 'next';

import UnsubscribeForm from '@/components/UnsubscribeForm';

export const metadata: Metadata = {
    title: 'Baja de la newsletter',
    robots: { index: false, follow: false, noarchive: true },
};

export default function UnsubscribePage() {
    return (
        <div className="legal-action-page">
            <UnsubscribeForm />
        </div>
    );
}
