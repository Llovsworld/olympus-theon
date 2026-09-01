import type { Metadata } from 'next';

import ConfirmSubscriptionForm from '@/components/ConfirmSubscriptionForm';

export const metadata: Metadata = {
    title: 'Confirmar suscripción',
    robots: { index: false, follow: false, noarchive: true },
};

export default function ConfirmSubscriptionPage() {
    return (
        <div className="legal-action-page">
            <ConfirmSubscriptionForm />
        </div>
    );
}
