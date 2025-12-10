import ScrollReveal from '@/components/ScrollReveal';
import ProgramsFAQ from '@/components/ProgramsFAQ';
import Link from 'next/link';

export default function ProgramasPage() {
    return (
        <main>
            {/* Hero Section */}
            <section className="programs-hero">
                <div className="container">
                    <ScrollReveal variant="fade">
                        <h1 className="programs-hero-title">ARSENAL DE DESARROLLO</h1>
                    </ScrollReveal>
                    <ScrollReveal variant="fade" delay={200}>
                        <p className="programs-hero-subtitle">Elige tu camino hacia la excelencia</p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="programs-grid-section">
                <div className="container">
                    <div className="programs-grid">
                        {/* Program 1: The Spartan Protocol */}
                        <ScrollReveal variant="slideScale" direction="up" delay={0}>
                            <div className="program-card">
                                <div className="program-badge">PROGRAMA PRINCIPAL</div>
                                <div className="program-image-placeholder">
                                    <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="program-title">THE SPARTAN PROTOCOL</h3>
                                <p className="program-description">
                                    Transformación completa de 12 semanas. Reprogramación mental, optimización física y dominio espiritual en un solo sistema integrado.
                                </p>
                                <ul className="program-benefits">
                                    <li>✓ Protocolos de entrenamiento personalizados</li>
                                    <li>✓ Plan de nutrición de alto rendimiento</li>
                                    <li>✓ Sesiones de coaching semanal en vivo</li>
                                    <li>✓ Acceso a comunidad privada de élite</li>
                                    <li>✓ Biblioteca completa de recursos estoicos</li>
                                </ul>
                                <div className="program-price">12 semanas  •  Inversión bajo consulta</div>
                                <a href="https://wa.me/34608961701?text=Quiero%20información%20sobre%20The%20Spartan%20Protocol" target="_blank" rel="noopener noreferrer" className="program-btn">
                                    APLICAR AHORA
                                </a>
                            </div>
                        </ScrollReveal>

                        {/* Program 2: Consultoría 1-a-1 */}
                        <ScrollReveal variant="slideScale" direction="up" delay={200}>
                            <div className="program-card featured">
                                <div className="program-badge premium">ÉLITE</div>
                                <div className="program-image-placeholder">
                                    <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 12v9M15 18l-3 3-3-3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="program-title">CONSULTORÍA 1-A-1</h3>
                                <p className="program-description">
                                    Mentoría personal con Alejandro. Estrategia individualizada, accountability total y acceso directo al método más exclusivo.
                                </p>
                                <ul className="program-benefits">
                                    <li>✓ Sesiones privadas semanales con Alejandro</li>
                                    <li>✓ Protocolo completamente personalizado</li>
                                    <li>✓ Análisis profundo de mindset y bloqueos</li>
                                    <li>✓ Soporte 24/7 vía WhatsApp</li>
                                    <li>✓ Revisión y ajuste continuo del plan</li>
                                </ul>
                                <div className="program-price premium-price">
                                    <span className="limited-badge">PLAZAS LIMITADAS</span>
                                </div>
                                <a href="https://wa.me/34608961701?text=Solicito%20entrevista%20de%20admisión%20para%20consultoría%201-a-1" target="_blank" rel="noopener noreferrer" className="program-btn premium-btn">
                                    ENTREVISTA DE ADMISIÓN
                                </a>
                            </div>
                        </ScrollReveal>

                        {/* Program 3: Elite Brotherhood (Optional Community) */}
                        <ScrollReveal variant="slideScale" direction="up" delay={400}>
                            <div className="program-card">
                                <div className="program-badge">COMUNIDAD</div>
                                <div className="program-image-placeholder">
                                    <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="program-title">ELITE BROTHERHOOD</h3>
                                <p className="program-description">
                                    Membresía mensual a la hermandad de hombres de alto rendimiento. Networking, recursos premium y eventos exclusivos.
                                </p>
                                <ul className="program-benefits">
                                    <li>✓ Acceso a comunidad privada de élite</li>
                                    <li>✓ Masterclasses mensuales exclusivas</li>
                                    <li>✓ Biblioteca de recursos en expansión</li>
                                    <li>✓ Networking con hombres de alto nivel</li>
                                    <li>✓ Descuentos en otros programas</li>
                                </ul>
                                <div className="program-price">Mensual  •  Consultar inversión</div>
                                <a href="https://wa.me/34608961701?text=Quiero%20información%20sobre%20Elite%20Brotherhood" target="_blank" rel="noopener noreferrer" className="program-btn">
                                    MÁS INFORMACIÓN
                                </a>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <ProgramsFAQ />

            {/* Final CTA */}
            <section className="cta-section">
                <div className="container">
                    <ScrollReveal variant="scale">
                        <div className="cta-content-wrapper">
                            <h2 className="cta-main-title">¿LISTO PARA LA TRANSFORMACIÓN?</h2>
                            <p className="cta-main-description">
                                No aceptamos a todos. Si estás preparado para comprometerte completamente con tu transformación, da el primer paso.
                            </p>
                            <div className="cta-whatsapp-container" style={{ marginBottom: 0 }}>
                                <a href="https://wa.me/34608961701?text=Quiero%20comenzar%20mi%20transformación%20con%20Olympus%20Theon" target="_blank" rel="noopener noreferrer" className="btn-cta-whatsapp">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.698c.968.585 1.903.896 2.79.897h.001c3.181 0 5.768-2.586 5.769-5.766 0-1.545-.601-2.997-1.694-4.089-1.094-1.092-2.546-1.694-4.075-1.695zm6.316 9.854c-1.03 1.033-2.406 1.602-3.869 1.603-1.066 0-2.075-.344-3.032-.912l-.218-.128-2.25.59.602-2.193-.142-.226c-.615-.978-1.004-2.004-1.004-3.35 0-3.009 2.448-5.458 5.457-5.458 1.458 0 2.83.568 3.861 1.601 1.032 1.031 1.6 2.404 1.6 3.862 0 1.458-.568 2.83-1.605 3.861l-.001.05zm-8.554-3.558c-.172-.086-1.015-.502-1.172-.559-.157-.058-.272-.086-.386.086-.115.172-.444.559-.544.673-.1.115-.201.129-.372.043-.172-.086-.725-.268-1.382-.852-.514-.458-.861-1.023-.961-1.195-.101-.172-.011-.266.075-.351.078-.078.172-.201.258-.301.086-.101.115-.172.172-.287.058-.115.029-.215-.014-.301-.043-.086-.386-.931-.53-1.275-.14-.334-.282-.289-.386-.294-.1-.005-.215-.005-.329-.005-.115 0-.301.043-.459.215-.157.172-.602.588-.602 1.433 0 .845.616 1.662.702 1.777.086.115 1.211 1.85 2.935 2.594 1.724.744 1.724.496 2.039.466.315-.029 1.015-.415 1.158-.816.143-.401.143-.745.1-.816-.043-.072-.157-.115-.329-.201z" />
                                    </svg>
                                    INICIAR CONVERSACIÓN
                                </a>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </main>
    );
}
