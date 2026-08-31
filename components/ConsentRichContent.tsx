'use client';

import type { CSSProperties, MouseEvent } from 'react';

const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

interface ConsentRichContentProps {
    html: string;
    className?: string;
    style?: CSSProperties;
}

/**
 * YouTube stays inert until the visitor deliberately activates that video.
 * The choice is limited to the current page and is not saved as global consent.
 */
export default function ConsentRichContent({ html, className, style }: ConsentRichContentProps) {
    function activateYoutube(event: MouseEvent<HTMLDivElement>) {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const button = target.closest<HTMLButtonElement>('button[data-youtube-consent="true"]');
        if (!button || !event.currentTarget.contains(button)) return;

        const videoId = button.dataset.youtubeId || '';
        if (!YOUTUBE_VIDEO_ID.test(videoId)) return;

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
        iframe.title = 'Vídeo de YouTube';
        iframe.width = '640';
        iframe.height = '360';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.className = 'consent-rich-content__youtube-frame';
        iframe.tabIndex = 0;

        button.replaceWith(iframe);
        iframe.focus();
    }

    return (
        <div
            className={className}
            style={style}
            onClick={activateYoutube}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
