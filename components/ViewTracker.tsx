"use client";

import { useEffect } from 'react';

interface ViewTrackerProps {
    type: 'post' | 'book';
    slug: string;
}

export default function ViewTracker({ type, slug }: ViewTrackerProps) {
    useEffect(() => {
        let sent = false;
        const payload = JSON.stringify({ type, slug });

        const trackView = () => {
            if (sent) return;
            sent = true;

            fetch('/api/track-view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true,
            }).catch((error) => console.error('Failed to track view:', error));
        };

        // View counting is non-critical, so keep it out of the initial network
        // burst used by the hero image, fonts and page content.
        const fallbackTimer = window.setTimeout(trackView, 1200);
        const idleId = 'requestIdleCallback' in window
            ? window.requestIdleCallback(trackView, { timeout: 1500 })
            : null;

        const trackBeforeLeaving = () => {
            if (sent) return;
            sent = true;
            const queued = navigator.sendBeacon(
                '/api/track-view',
                new Blob([payload], { type: 'application/json' })
            );
            if (!queued) {
                sent = false;
                trackView();
            }
        };

        window.addEventListener('pagehide', trackBeforeLeaving, { once: true });

        return () => {
            window.clearTimeout(fallbackTimer);
            if (idleId !== null) window.cancelIdleCallback(idleId);
            window.removeEventListener('pagehide', trackBeforeLeaving);
            if (!sent && process.env.NODE_ENV === 'production') trackView();
        };
    }, [type, slug]);

    return null; // This component doesn't render anything
}
