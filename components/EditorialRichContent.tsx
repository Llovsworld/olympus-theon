import type { CSSProperties } from 'react';
import ConsentRichContent from '@/components/ConsentRichContent';

interface EditorialRichContentProps {
    html: string;
    className?: string;
    style?: CSSProperties;
}

/**
 * Most editorial pages are plain, already-sanitized HTML and do not need to
 * hydrate a client component. Keep the interactive boundary only for articles
 * that contain a consent-gated YouTube embed.
 */
export default function EditorialRichContent({
    html,
    className,
    style,
}: EditorialRichContentProps) {
    if (html.includes('data-youtube-consent="true"')) {
        return <ConsentRichContent html={html} className={className} style={style} />;
    }

    return (
        <div
            className={className}
            style={style}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
