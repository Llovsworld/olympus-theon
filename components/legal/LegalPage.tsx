import type { ReactNode } from 'react';

type TocItem = {
    href: `#${string}`;
    label: string;
};

export function LegalPage({
    eyebrow,
    title,
    summary,
    updated,
    toc,
    children,
}: {
    eyebrow: string;
    title: string;
    summary: string;
    updated: string;
    toc?: TocItem[];
    children: ReactNode;
}) {
    return (
        <article className="legal-page">
            <header className="legal-hero">
                <div className="legal-shell">
                    <p className="legal-eyebrow">{eyebrow}</p>
                    <h1>{title}</h1>
                    <p className="legal-summary">{summary}</p>
                    <p className="legal-updated">Última actualización: {updated}</p>
                </div>
            </header>

            <div className="legal-shell legal-layout">
                {toc && toc.length > 0 ? (
                    <nav className="legal-toc" aria-label="Índice de esta página">
                        <p>En esta página</p>
                        <ol>
                            {toc.map((item) => (
                                <li key={item.href}>
                                    <a href={item.href}>{item.label}</a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                ) : null}

                <div className="legal-content">{children}</div>
            </div>
        </article>
    );
}

export function LegalSection({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className="legal-section">
            <h2>{title}</h2>
            {children}
        </section>
    );
}

export function LegalCallout({ title, children }: { title: string; children: ReactNode }) {
    return (
        <aside className="legal-callout">
            <h2>{title}</h2>
            {children}
        </aside>
    );
}
