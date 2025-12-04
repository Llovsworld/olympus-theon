"use client";

interface ContentPreviewProps {
    content: string;
    title?: string;
}

export default function ContentPreview({ content, title }: ContentPreviewProps) {
    return (
        <div style={{
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.02)',
            minHeight: '400px'
        }}>
            {title && (
                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '2rem',
                    fontWeight: 700
                }}>
                    {title}
                </h1>
            )}
            <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                    lineHeight: '1.8',
                    fontSize: '1.1rem'
                }}
            />

            <style jsx global>{`
                .preview-content h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 2rem 0 1rem;
                }
                .preview-content h2 {
                    font-size: 1.75rem;
                    font-weight: 600;
                    margin: 1.75rem 0 0.875rem;
                }
                .preview-content h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 1.5rem 0 0.75rem;
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
                    border-left: 3px solid var(--foreground);
                    padding-left: 1.5rem;
                    margin: 1.5rem 0;
                    font-style: italic;
                    color: #aaa;
                }
                .preview-content pre {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem;
                    border-radius: 4px;
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
                    border-radius: 4px;
                    margin: 1.5rem 0;
                }
                .preview-content a {
                    color: var(--foreground);
                    text-decoration: underline;
                }
                .preview-content iframe {
                    max-width: 100%;
                    margin: 1.5rem 0;
                }
            `}</style>
        </div>
    );
}
