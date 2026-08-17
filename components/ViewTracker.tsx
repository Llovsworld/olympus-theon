"use client";

import { useEffect } from 'react';

interface ViewTrackerProps {
    type: 'post' | 'book';
    slug: string;
}

export default function ViewTracker({ type, slug }: ViewTrackerProps) {
    useEffect(() => {
        const storageKey = `olympus-view:${type}:${slug}`;
        if (window.sessionStorage.getItem(storageKey)) return;

        window.sessionStorage.setItem(storageKey, '1');
        fetch('/api/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, slug })
        }).then((response) => {
            if (!response.ok) window.sessionStorage.removeItem(storageKey);
        }).catch(() => window.sessionStorage.removeItem(storageKey));
    }, [type, slug]);

    return null; // This component doesn't render anything
}
