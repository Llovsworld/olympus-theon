import ScrollReveal from './ScrollReveal';
import Link from 'next/link';
import Image from 'next/image';

export default function MethodSection() {
    return (
        <section className="method-section-alt">
            <div className="container">
                <ScrollReveal variant="fade" delay={0}>
                    <h2 className="method-title-main">NUESTRO MÉTODO: LA TRÍADA DEL PODER</h2>
                </ScrollReveal>

                <div className="method-rows">
                    {/* Row 1: Mental Reprogramming */}
                    <div className="method-row">
                        <ScrollReveal variant="fade" delay={200} className="method-image-col">
                            <div className="method-image-container method-image-container--bright">
                                <div className="method-tag">ESTRATEGIA MENTAL</div>
                                <Image
                                    src="/method-mental.webp"
                                    alt="Reprogramación Mental"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="method-image"
                                    style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                                />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="fade" delay={300} className="method-content-col">
                            <h3 className="method-title-large">REPROGRAMACIÓN<br />MENTAL</h3>
                            <p className="method-description">
                                Trabajamos creencias limitantes y modelos mentales orientados al rendimiento.
                                Aplica principios estoicos a la toma de decisiones bajo presión y crea un
                                sistema personal para pensar y actuar con mayor claridad.
                            </p>
                            <div className="method-stats-grid">
                                <div className="method-stat-item">
                                    <span className="method-stat-value">FOCO</span>
                                    <span className="method-stat-label">PRIORIDADES</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">CALMA</span>
                                    <span className="method-stat-label">BAJO PRESIÓN</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">ACCIÓN</span>
                                    <span className="method-stat-label">CON INTENCIÓN</span>
                                </div>
                            </div>
                            <Link href="/programas" className="method-link">
                                CONOCER EL PROGRAMA <span className="arrow">→</span>
                            </Link>
                        </ScrollReveal>
                    </div>

                    {/* Row 2: Physical Optimization (Reversed) */}
                    <div className="method-row reverse">
                        <ScrollReveal variant="fade" delay={200} className="method-image-col">
                            <div className="method-image-container method-image-container--bright">
                                <div className="method-tag">ALTO RENDIMIENTO</div>
                                <Image
                                    src="/method-physical.webp"
                                    alt="Optimización Física"
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="method-image"
                                    style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
                                />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="fade" delay={300} className="method-content-col">
                            <h3 className="method-title-large">OPTIMIZACIÓN<br />FÍSICA</h3>
                            <p className="method-description">
                                No es solo fitness: es estructura, seguimiento y criterio. Integramos
                                entrenamiento, nutrición y recuperación en un plan adaptado a tu punto de
                                partida, tus objetivos y tu vida real.
                            </p>
                            <div className="method-stats-grid">
                                <div className="method-stat-item">
                                    <span className="method-stat-value">FUERZA</span>
                                    <span className="method-stat-label">ENTRENAMIENTO</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">SALUD</span>
                                    <span className="method-stat-label">NUTRICIÓN</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">ENERGÍA</span>
                                    <span className="method-stat-label">RECUPERACIÓN</span>
                                </div>
                            </div>
                            <Link href="/programas" className="method-link">
                                CONOCER EL PROGRAMA <span className="arrow">→</span>
                            </Link>
                        </ScrollReveal>
                    </div>

                    {/* Row 3: Spiritual Domain */}
                    <div className="method-row">
                        <ScrollReveal variant="fade" delay={200} className="method-image-col">
                            <div className="method-image-container">
                                <div className="method-tag">COMUNIDAD & PROPÓSITO</div>
                                <Image
                                    src="/method-spiritual.webp"
                                    alt="Dominio Espiritual"
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="method-image"
                                    style={{ objectFit: 'cover', objectPosition: 'center 45%' }}
                                />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="fade" delay={300} className="method-content-col">
                            <h3 className="method-title-large">DOMINIO ESPIRITUAL<br />Y PROPÓSITO</h3>
                            <p className="method-description">
                                Alinea tus acciones con tus valores y tu propósito vital. Desarrolla una
                                brújula interna que te ayude a decidir con coherencia, sostener tus compromisos
                                y construir una dirección propia.
                            </p>
                            <div className="method-stats-grid">
                                <div className="method-stat-item">
                                    <span className="method-stat-value">VALORES</span>
                                    <span className="method-stat-label">BRÚJULA INTERNA</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">RUMBO</span>
                                    <span className="method-stat-label">PROPÓSITO</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">LEGADO</span>
                                    <span className="method-stat-label">COHERENCIA</span>
                                </div>
                            </div>
                            <Link href="/programas" className="method-link">
                                CONOCER EL PROGRAMA <span className="arrow">→</span>
                            </Link>
                        </ScrollReveal>
                    </div>
                </div>

                {/* Main CTA to Programs Page */}
                <ScrollReveal variant="fade" delay={400}>
                    <div className="method-main-cta">
                        <Link href="/programas" className="btn-method-cta">
                            VER TODOS LOS PROGRAMAS
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
