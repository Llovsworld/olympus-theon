import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import ScrollReveal from './ScrollReveal';

export default function StorySection() {
    return (
        <section id="story" className="ceo-philosophy-section section-anchor">
            <div className="container-full">
                <div className="ceo-philosophy-grid">
                    {/* Left Column: Content */}
                    <div className="ceo-philosophy-content">
                        <ScrollReveal variant="fade" delay={0}>
                            <div className="ceo-top-ticker">
                                EL FUNDADOR
                            </div>
                            <h2 className="ceo-philosophy-title">
                                EL CARÁCTER<br />
                                TAMBIÉN SE<br />
                                ENTRENA
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal variant="fade" delay={100}>
                            <p className="ceo-philosophy-description">
                                Olympus Theon nace de una idea sencilla: la motivación es inestable,
                                pero un sistema bien construido permanece. Entrenamos hábitos, criterio y
                                capacidad de ejecución para que el progreso no dependa de cómo te sientas hoy.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal variant="fade" delay={200}>
                            <div className="ceo-philosophy-actions">
                                <Link href="/programas" className="btn-ceo-primary">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8l6-6V4c0-1.1-.9-2-2-2zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                    </svg>
                                    VER PROGRAMAS
                                </Link>
                                <Link href="#method" className="btn-ceo-secondary">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                    CONOCER EL MÉTODO
                                </Link>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal variant="fade" delay={300}>
                            <div className="ceo-philosophy-stats" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-around', gap: '0.5rem' }}>
                                <div className="ceo-philosophy-stat" style={{ flex: '1', textAlign: 'center', minWidth: '0' }}>
                                    <div className="ceo-philosophy-stat-value">01</div>
                                    <div className="ceo-philosophy-stat-label">
                                        PLAN<br />CLARO
                                    </div>
                                </div>
                                <div className="ceo-philosophy-stat" style={{ flex: '1', textAlign: 'center', minWidth: '0' }}>
                                    <div className="ceo-philosophy-stat-value">03</div>
                                    <div className="ceo-philosophy-stat-label">
                                        PILARES<br />INTEGRADOS
                                    </div>
                                </div>
                                <div className="ceo-philosophy-stat" style={{ flex: '1', textAlign: 'center', minWidth: '0' }}>
                                    <div className="ceo-philosophy-stat-value">∞</div>
                                    <div className="ceo-philosophy-stat-label">
                                        MEJORA<br />CONTINUA
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
                                    alt="Alejandro Lloveras Sauras, fundador de Olympus Theon"
                                    fill
                                    sizes="(max-width: 968px) 100vw, 50vw"
                                    loading="lazy"
                                    className="ceo-philosophy-photo"
                                    style={{ objectFit: 'cover' }}
                                />
                                {/* CEO Info Overlay - Inside Image */}
                                <div className="ceo-philosophy-quote-overlay">
                                    <p className="ceo-philosophy-quote-label">Alejandro Lloveras Sauras</p>
                                    <p className="ceo-philosophy-quote-text">
                                        Fundador de Olympus Theon. Una propuesta que integra disciplina,
                                        entrenamiento y dirección personal en un único sistema de trabajo.
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
