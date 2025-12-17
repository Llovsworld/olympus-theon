import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function StorySection() {
    return (
        <section className="ceo-philosophy-section">
            <div className="container-full">
                <div className="ceo-philosophy-grid">
                    {/* Left Column: Content */}
                    <div className="ceo-philosophy-content">
                        <ScrollReveal variant="fade" delay={0}>
                            <div className="ceo-top-ticker">
                                ABRAZA LA OSCURIDAD. ELLA TE MOSTRARÁ LA LUZ.
                            </div>
                            <h2 className="ceo-philosophy-title">
                                EXCELENCIA<br />
                                A TRAVÉS DE<br />
                                METODOLOGÍA
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal variant="fade" delay={100}>
                            <p className="ceo-philosophy-description">
                                Transformamos visiones en realidades mediante estrategias precisas y
                                ejecución impecable. Cada proyecto es una oportunidad para demostrar
                                que la excelencia no es un accidente, sino el resultado de un método probado.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal variant="fade" delay={200}>
                            <div className="ceo-philosophy-actions">
                                <Link href="/programas" className="btn-ceo-primary">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8l6-6V4c0-1.1-.9-2-2-2zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                    </svg>
                                    INICIAR CONSULTORÍA
                                </Link>
                                <Link href="#method" className="btn-ceo-secondary">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                    EXPLORAR TRABAJO
                                </Link>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal variant="fade" delay={300}>
                            <div className="ceo-philosophy-stats" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-around', gap: '0.5rem' }}>
                                <div className="ceo-philosophy-stat" style={{ flex: '1', textAlign: 'center', minWidth: '0' }}>
                                    <div className="ceo-philosophy-stat-value">150+</div>
                                    <div className="ceo-philosophy-stat-label">
                                        PROYECTOS<br />COMPLETADOS
                                    </div>
                                </div>
                                <div className="ceo-philosophy-stat" style={{ flex: '1', textAlign: 'center', minWidth: '0' }}>
                                    <div className="ceo-philosophy-stat-value">98%</div>
                                    <div className="ceo-philosophy-stat-label">
                                        SATISFACCIÓN<br />CLIENTE
                                    </div>
                                </div>
                                <div className="ceo-philosophy-stat" style={{ flex: '1', textAlign: 'center', minWidth: '0' }}>
                                    <div className="ceo-philosophy-stat-value">12+</div>
                                    <div className="ceo-philosophy-stat-label">
                                        AÑOS<br />EXPERIENCIA
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column: CEO Photo */}
                    <div className="ceo-philosophy-image">
                        <ScrollReveal variant="scale" delay={0}>
                            <div className="ceo-philosophy-image-wrapper">
                                <Image
                                    src="/ceo_portrait.jpg"
                                    alt="Alejandro Lloveras Sauras - CEO"
                                    fill
                                    loading="lazy"
                                    className="ceo-philosophy-photo"
                                    style={{ objectFit: 'cover' }}
                                />
                                {/* CEO Info Overlay - Inside Image */}
                                <div className="ceo-philosophy-quote-overlay">
                                    <p className="ceo-philosophy-quote-label">Alejandro Lloveras Sauras</p>
                                    <p className="ceo-philosophy-quote-text">
                                        Fundador y CEO de Olympus Theon. Especialista en transformación
                                        personal y desarrollo de alto rendimiento físico y mental.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
