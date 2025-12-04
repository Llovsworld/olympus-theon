import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-content" style={{
                    textAlign: 'center',
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '4rem 0'
                }}>
                    <ScrollReveal variant="fade">
                        {/* Label */}
                        <div style={{
                            display: 'inline-block',
                            padding: '0.5rem 1.5rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            marginBottom: '2rem',
                            fontSize: '0.75rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#fff'
                        }}>
                            ÚNETE A LA ÉLITE
                        </div>

                        {/* Title */}
                        <h2 className="cta-title" style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: '800',
                            lineHeight: '1',
                            marginBottom: '2rem',
                            color: '#ffffff',
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase'
                        }}>
                            ABRAZA LA OSCURIDAD
                        </h2>

                        {/* Separator */}
                        <div style={{
                            width: '80px',
                            height: '1px',
                            background: '#fff',
                            margin: '0 auto 2.5rem',
                            opacity: 0.3
                        }} />
                    </ScrollReveal>

                    <ScrollReveal variant="fade" delay={200}>
                        <p className="cta-text" style={{
                            fontSize: '1.3rem',
                            color: '#a0a0a0',
                            maxWidth: '700px',
                            margin: '0 auto 3rem',
                            lineHeight: '1.7',
                            fontWeight: '300'
                        }}>
                            La mediocridad es una elección. La excelencia, una imposición. Si estás dispuesto a sacrificar quien eres por quien puedes llegar a ser, bienvenido al origen de tu legado.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal variant="slideScale" direction="up" delay={400}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                            {/* Blog and Books buttons - First Row */}
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href="/blog" className="btn btn-outline" style={{ minWidth: '140px' }}>
                                    BLOGS
                                </Link>
                                <Link href="/books" className="btn btn-outline" style={{ minWidth: '140px' }}>
                                    LIBROS
                                </Link>
                            </div>

                            {/* WhatsApp button - Second Row */}
                            <a
                                href="https://wa.me/34608961701"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                                style={{
                                    background: '#25D366',
                                    color: '#ffffff',
                                    border: '1px solid #25D366',
                                    minWidth: '220px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.698c.968.585 1.903.896 2.79.897h.001c3.181 0 5.768-2.586 5.769-5.766 0-1.545-.601-2.997-1.694-4.089-1.094-1.092-2.546-1.694-4.075-1.695zm6.316 9.854c-1.03 1.033-2.406 1.602-3.869 1.603-1.066 0-2.075-.344-3.032-.912l-.218-.128-2.25.59.602-2.193-.142-.226c-.615-.978-1.004-2.004-1.004-3.35 0-3.009 2.448-5.458 5.457-5.458 1.458 0 2.83.568 3.861 1.601 1.032 1.031 1.6 2.404 1.6 3.862 0 1.458-.568 2.83-1.605 3.861l-.001.05zm-8.554-3.558c-.172-.086-1.015-.502-1.172-.559-.157-.058-.272-.086-.386.086-.115.172-.444.559-.544.673-.1.115-.201.129-.372.043-.172-.086-.725-.268-1.382-.852-.514-.458-.861-1.023-.961-1.195-.101-.172-.011-.266.075-.351.078-.078.172-.201.258-.301.086-.101.115-.172.172-.287.058-.115.029-.215-.014-.301-.043-.086-.386-.931-.53-1.275-.14-.334-.282-.289-.386-.294-.1-.005-.215-.005-.329-.005-.115 0-.301.043-.459.215-.157.172-.602.588-.602 1.433 0 .845.616 1.662.702 1.777.086.115 1.211 1.85 2.935 2.594 1.724.744 1.724.496 2.039.466.315-.029 1.015-.415 1.158-.816.143-.401.143-.745.1-.816-.043-.072-.157-.115-.329-.201z" />
                                </svg>
                                SOLICITAR ACCESO
                            </a>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
