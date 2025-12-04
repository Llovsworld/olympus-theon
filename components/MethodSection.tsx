import ScrollReveal from './ScrollReveal';
import Link from 'next/link';
import TiltCard from './TiltCard';
import ParallaxSection from './ParallaxSection';

export default function MethodSection() {
    return (
        <section className="method-section">
            <div className="container">
                <ParallaxSection speed={0.2}>
                    <ScrollReveal variant="fade" delay={0}>
                        <h2 className="method-title">NUESTRO MÉTODO: LA TRÍADA DEL PODER</h2>
                    </ScrollReveal>
                </ParallaxSection>

                <div className="method-grid">
                    {/* Bloque 1: Reprogramación Mental */}
                    <ScrollReveal variant="slideScale" direction="up" delay={200}>
                        <TiltCard className="method-card">
                            <div className="method-card-number">I</div>
                            <div className="method-icon-container">
                                <div className="method-icon">
                                    {/* Brain/Gear Icon */}
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M9.5 2c-1.82 0-3.53.5-5 1.35C2.99 4.75 2 6.8 2 9c0 5.25 3.5 8.5 7 10.5 3.5-2 7-5.25 7-10.5 0-2.2-.99-4.25-2.5-5.65C11.03 2.5 9.32 2 7.5 2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="9" r="1.5" />
                                        <circle cx="8" cy="9" r="1.5" />
                                        <path d="M12 13c-1.5 0-2.5 1-2.5 2M14.5 13c1.5 0 2.5 1 2.5 2" strokeLinecap="round" />
                                        <path d="M12 9v2M8 9v2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="method-card-title">
                                REPROGRAMACIÓN<br />MENTAL
                            </h3>
                            <div className="method-card-text-container">
                                <p className="method-card-text">
                                    Eliminamos creencias limitantes e instalamos <strong>modelos mentales de alto rendimiento</strong>. Adopta la estoicidad operativa para la toma de decisiones bajo presión.
                                </p>
                            </div>
                        </TiltCard>
                    </ScrollReveal>

                    {/* Bloque 2: Optimización Física */}
                    <ScrollReveal variant="slideScale" direction="up" delay={400}>
                        <TiltCard className="method-card">
                            <div className="method-card-number">II</div>
                            <div className="method-icon-container">
                                <div className="method-icon">
                                    {/* Dumbbell/Muscle Icon */}
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M6.5 6L6.5 18" strokeLinecap="round" />
                                        <path d="M17.5 6L17.5 18" strokeLinecap="round" />
                                        <rect x="3" y="8" width="3" height="8" rx="1" />
                                        <rect x="18" y="8" width="3" height="8" rx="1" />
                                        <path d="M6.5 12L17.5 12" strokeLinecap="round" />
                                        <circle cx="4.5" cy="7" r="1" />
                                        <circle cx="4.5" cy="17" r="1" />
                                        <circle cx="19.5" cy="7" r="1" />
                                        <circle cx="19.5" cy="17" r="1" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="method-card-title">
                                OPTIMIZACIÓN<br />FÍSICA
                            </h3>
                            <div className="method-card-text-container">
                                <p className="method-card-text">
                                    No es solo fitness, es <strong>ingeniería corporal</strong>. Protocolos de entrenamiento y nutrición diseñados para construir una presencia imponente y una energía inagotable.
                                </p>
                            </div>
                        </TiltCard>
                    </ScrollReveal>

                    {/* Bloque 3: Dominio Espiritual */}
                    <ScrollReveal variant="slideScale" direction="up" delay={600}>
                        <TiltCard className="method-card">
                            <div className="method-card-number">III</div>
                            <div className="method-icon-container">
                                <div className="method-icon">
                                    {/* Greek Column/Flame Icon */}
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M6 20h12" strokeLinecap="round" />
                                        <path d="M8 20V8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v12" strokeLinecap="round" />
                                        <path d="M9 7V4h6v3" strokeLinecap="round" />
                                        <path d="M10 11h4M10 14h4" strokeLinecap="round" />
                                        <path d="M7 3h10" strokeLinecap="round" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="method-card-title">
                                DOMINIO ESPIRITUAL<br />Y PROPÓSITO
                            </h3>
                            <div className="method-card-text-container">
                                <p className="method-card-text">
                                    Alinea tus acciones con tu propósito vital. Desarrolla una <strong>brújula interna inquebrantable</strong> que te guíe más allá del éxito material.
                                </p>
                            </div>
                        </TiltCard>
                    </ScrollReveal>
                </div>

                {/* Línea de conexión visual de la tríada */}
                <div className="method-triad-line">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* CTA Button to Programs */}
                <ScrollReveal variant="fade" delay={800}>
                    <div className="method-cta-container">
                        <Link href="/programas" className="btn-outline-large">
                            VER DETALLES DEL PROGRAMA
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
