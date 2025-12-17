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
                            <div className="method-image-container">
                                <div className="method-tag">ESTRATEGIA MENTAL</div>
                                <Image
                                    src="/hero-car.png"
                                    alt="Reprogramación Mental"
                                    fill
                                    priority
                                    className="method-image"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="fade" delay={300} className="method-content-col">
                            <h3 className="method-title-large">REPROGRAMACIÓN<br />MENTAL</h3>
                            <p className="method-description">
                                Eliminamos creencias limitantes e instalamos modelos mentales de alto rendimiento.
                                Adopta la estoicidad operativa para la toma de decisiones bajo presión y
                                rediseña tu arquitectura cognitiva para el éxito.
                            </p>
                            <div className="method-stats-grid">
                                <div className="method-stat-item">
                                    <span className="method-stat-value">+300%</span>
                                    <span className="method-stat-label">FOCO</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">24/7</span>
                                    <span className="method-stat-label">CLARIDAD</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">100%</span>
                                    <span className="method-stat-label">CONTROL</span>
                                </div>
                            </div>
                            <Link href="/programas" className="method-link">
                                VER CASO DE ESTUDIO <span className="arrow">→</span>
                            </Link>
                        </ScrollReveal>
                    </div>

                    {/* Row 2: Physical Optimization (Reversed) */}
                    <div className="method-row reverse">
                        <ScrollReveal variant="fade" delay={200} className="method-image-col">
                            <div className="method-image-container">
                                <div className="method-tag">ALTO RENDIMIENTO</div>
                                <Image
                                    src="/hero-gym.png"
                                    alt="Optimización Física"
                                    fill
                                    loading="lazy"
                                    className="method-image"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="fade" delay={300} className="method-content-col">
                            <h3 className="method-title-large">OPTIMIZACIÓN<br />FÍSICA</h3>
                            <p className="method-description">
                                No es solo fitness, es ingeniería corporal. Protocolos de entrenamiento y
                                nutrición diseñados científicamente para construir una presencia imponente,
                                una estética superior y una energía inagotable.
                            </p>
                            <div className="method-stats-grid">
                                <div className="method-stat-item">
                                    <span className="method-stat-value">+5kg</span>
                                    <span className="method-stat-label">MÚSCULO</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">-10%</span>
                                    <span className="method-stat-label">GRASA</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">MAX</span>
                                    <span className="method-stat-label">ENERGÍA</span>
                                </div>
                            </div>
                            <Link href="/programas" className="method-link">
                                VER CASO DE ESTUDIO <span className="arrow">→</span>
                            </Link>
                        </ScrollReveal>
                    </div>

                    {/* Row 3: Spiritual Domain */}
                    <div className="method-row">
                        <ScrollReveal variant="fade" delay={200} className="method-image-col">
                            <div className="method-image-container">
                                <div className="method-tag">COMUNIDAD & PROPÓSITO</div>
                                <Image
                                    src="/story_background.png"
                                    alt="Dominio Espiritual"
                                    fill
                                    loading="lazy"
                                    className="method-image"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="fade" delay={300} className="method-content-col">
                            <h3 className="method-title-large">DOMINIO ESPIRITUAL<br />Y PROPÓSITO</h3>
                            <p className="method-description">
                                Alinea tus acciones con tu propósito vital. Desarrolla una brújula interna
                                inquebrantable que te guíe más allá del éxito material y conecta con una
                                hermandad global de hombres de alto valor.
                            </p>
                            <div className="method-stats-grid">
                                <div className="method-stat-item">
                                    <span className="method-stat-value">150+</span>
                                    <span className="method-stat-label">MIEMBROS</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">∞</span>
                                    <span className="method-stat-label">NETWORKING</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">1</span>
                                    <span className="method-stat-label">LEGADO</span>
                                </div>
                            </div>
                            <Link href="/programas" className="method-link">
                                VER CASO DE ESTUDIO <span className="arrow">→</span>
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
