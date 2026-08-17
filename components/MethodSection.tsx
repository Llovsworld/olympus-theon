import ScrollReveal from './ScrollReveal';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export default function MethodSection() {
    return (
        <section className="method-section-alt">
            <div className="container">
                <ScrollReveal variant="fade" delay={0}>
                    <p className="section-kicker">UN SISTEMA, TRES FRENTES</p>
                    <h2 className="method-title-main">LA TRÍADA DEL RENDIMIENTO</h2>
                </ScrollReveal>

                <div className="method-rows">
                    {/* Row 1: Mental Reprogramming */}
                    <div className="method-row">
                        <ScrollReveal variant="fade" delay={200} className="method-image-col">
                            <div className="method-image-container">
                                <div className="method-tag">ESTRATEGIA MENTAL</div>
                                <Image
                                    src="/hero-car.png"
                                    alt="Entorno de trabajo enfocado en estrategia y precisión"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 55vw"
                                    className="method-image"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="fade" delay={300} className="method-content-col">
                            <h3 className="method-title-large">CLARIDAD<br />MENTAL</h3>
                            <p className="method-description">
                                Identifica el ruido, define prioridades y convierte tus objetivos en decisiones
                                ejecutables. Menos impulso del momento; más criterio bajo presión.
                            </p>
                            <div className="method-stats-grid">
                                <div className="method-stat-item">
                                    <span className="method-stat-value">01</span>
                                    <span className="method-stat-label">DIAGNÓSTICO</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">02</span>
                                    <span className="method-stat-label">ESTRATEGIA</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">03</span>
                                    <span className="method-stat-label">EJECUCIÓN</span>
                                </div>
                            </div>
                            <Link href="/programas" className="method-link">
                                EXPLORAR PROGRAMAS <span className="arrow">→</span>
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
                                    sizes="(max-width: 1024px) 100vw, 55vw"
                                    className="method-image"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="fade" delay={300} className="method-content-col">
                            <h3 className="method-title-large">OPTIMIZACIÓN<br />FÍSICA</h3>
                            <p className="method-description">
                                Entrenamiento, recuperación y nutrición convertidos en un plan que puedas
                                sostener. El objetivo es un cuerpo fuerte, capaz y coherente con tu estilo de vida.
                            </p>
                            <div className="method-stats-grid">
                                <div className="method-stat-item">
                                    <span className="method-stat-value">FUERZA</span>
                                    <span className="method-stat-label">PROGRESIVA</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">ENERGÍA</span>
                                    <span className="method-stat-label">ESTABLE</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">SALUD</span>
                                    <span className="method-stat-label">SOSTENIBLE</span>
                                </div>
                            </div>
                            <Link href="/programas" className="method-link">
                                EXPLORAR PROGRAMAS <span className="arrow">→</span>
                            </Link>
                        </ScrollReveal>
                    </div>

                    {/* Row 3: Spiritual Domain */}
                    <div className="method-row">
                        <ScrollReveal variant="fade" delay={200} className="method-image-col">
                            <div className="method-image-container">
                                <div className="method-tag">DIRECCIÓN PERSONAL</div>
                                <Image
                                    src="/story_background.png"
                                    alt="Escultura clásica como símbolo de propósito y carácter"
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 1024px) 100vw, 55vw"
                                    className="method-image"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="fade" delay={300} className="method-content-col">
                            <h3 className="method-title-large">PROPÓSITO<br />Y CARÁCTER</h3>
                            <p className="method-description">
                                Alinea agenda, relaciones y trabajo con principios que puedas defender.
                                Construye una dirección propia y un entorno que eleve tu estándar.
                            </p>
                            <div className="method-stats-grid">
                                <div className="method-stat-item">
                                    <span className="method-stat-value">NORTE</span>
                                    <span className="method-stat-label">DEFINIDO</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">HÁBITOS</span>
                                    <span className="method-stat-label">COHERENTES</span>
                                </div>
                                <div className="method-stat-item">
                                    <span className="method-stat-value">ENTORNO</span>
                                    <span className="method-stat-label">EXIGENTE</span>
                                </div>
                            </div>
                            <Link href="/programas" className="method-link">
                                EXPLORAR PROGRAMAS <span className="arrow">→</span>
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
