"use client";

import { useEffect } from 'react';

interface ViewTrackerProps {
    type: 'post' | 'book';
    slug: string;
}

export default function ViewTracker({ type, slug }: ViewTrackerProps) {
    useEffect(() => {
        // Track view on mount
        fetch('/api/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, slug })
        }).catch(err => console.error('Failed to track view:', err));
    }, [type, slug]);

    return null; // This component doesn't render anything
}
