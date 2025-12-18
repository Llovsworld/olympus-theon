"use client";

interface ContentPreviewProps {
    content: string;
    title?: string;
    featuredImage?: string;
}

export default function ContentPreview({ content, title, featuredImage }: ContentPreviewProps) {
    return (
        <div className="admin-preview">
            {featuredImage && (
                <img
                    src={featuredImage}
                    alt={title || 'Featured image'}
                    style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 'var(--admin-radius-md)',
                        marginBottom: '2rem'
                    }}
                />
            )}

            {title && (
                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '2rem',
                    fontWeight: 700,
                    color: 'var(--admin-text)',
                    lineHeight: 1.2
                }}>
                    {title}
                </h1>
            )}

            <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                    lineHeight: '1.8',
                    fontSize: '1.1rem',
                    color: 'var(--admin-text)'
                }}
            />

            <style jsx global>{`
                .preview-content h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 2rem 0 1rem;
                    color: var(--admin-text);
                }
                .preview-content h2 {
                    font-size: 1.75rem;
                    font-weight: 600;
                    margin: 1.75rem 0 0.875rem;
                    color: var(--admin-text);
                }
                .preview-content h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 1.5rem 0 0.75rem;
                    color: var(--admin-text);
                }
                .preview-content p {
                    margin-bottom: 1.5rem;
                }
                .preview-content ul, .preview-content ol {
                    margin: 1.5rem 0;
                    padding-left: 2rem;
                }
                .preview-content li {
                    margin-bottom: 0.5rem;
                }
                .preview-content blockquote {
                    border-left: 3px solid var(--admin-accent);
                    padding-left: 1.5rem;
                    margin: 1.5rem 0;
                    font-style: italic;
                    color: var(--admin-text-secondary);
                }
                .preview-content pre {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem;
                    border-radius: var(--admin-radius-sm);
                    overflow-x: auto;
                    margin: 1.5rem 0;
                }
                .preview-content code {
                    font-family: 'Monaco', 'Courier New', monospace;
                    font-size: 0.9em;
                }
                .preview-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: var(--admin-radius-sm);
                    margin: 1.5rem 0;
                    box-shadow: var(--admin-shadow-sm);
                }
                .preview-content video {
                    max-width: 100%;
                    height: auto;
                    border-radius: var(--admin-radius-sm);
                    margin: 1.5rem 0;
                }
                .preview-content a {
                    color: var(--admin-accent);
                    text-decoration: underline;
                    transition: opacity 0.2s;
                }
                .preview-content a:hover {
                    opacity: 0.8;
                }
                .preview-content iframe {
                    max-width: 100%;
                    margin: 1.5rem 0;
                    border-radius: var(--admin-radius-sm);
                    aspect-ratio: 16 / 9;
                    width: 100%;
                    border: none;
                }
                .preview-content .video-wrapper {
                    position: relative;
                    padding-bottom: 56.25%; /* 16:9 */
                    height: 0;
                    overflow: hidden;
                    margin: 1.5rem 0;
                    border-radius: var(--admin-radius-sm);
                }
                .preview-content .video-wrapper iframe,
                .preview-content .video-wrapper video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: var(--admin-radius-sm);
                }
            `}</style>
        </div>
    );
}
