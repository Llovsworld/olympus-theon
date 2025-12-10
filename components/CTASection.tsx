import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-content-wrapper">
                    <ScrollReveal variant="fade">
                        <h2 className="cta-main-title">
                            ¿LISTO PARA LA<br />TRANSFORMACIÓN?
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal variant="fade" delay={200}>
                        <p className="cta-main-description">
                            Cada gran proyecto comienza con una conversación. Descubre cómo
                            nuestra metodología puede transformar tu visión en resultados
                            medibles y sostenibles.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal variant="slideScale" direction="up" delay={300}>
                        <div className="cta-buttons-primary">
                            <a
                                href="https://wa.me/34608961701"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-cta-consultation"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z" />
                                </svg>
                                AGENDAR CONSULTORÍA GRATUITA
                            </a>
                            <Link href="/contact" className="btn-cta-email">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                                ENVIAR EMAIL
                            </Link>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fade" delay={400}>
                        <div className="cta-whatsapp-container">
                            <a
                                href="https://wa.me/34608961701"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-cta-whatsapp"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.698c.968.585 1.903.896 2.79.897h.001c3.181 0 5.768-2.586 5.769-5.766 0-1.545-.601-2.997-1.694-4.089-1.094-1.092-2.546-1.694-4.075-1.695zm6.316 9.854c-1.03 1.033-2.406 1.602-3.869 1.603-1.066 0-2.075-.344-3.032-.912l-.218-.128-2.25.59.602-2.193-.142-.226c-.615-.978-1.004-2.004-1.004-3.35 0-3.009 2.448-5.458 5.457-5.458 1.458 0 2.83.568 3.861 1.601 1.032 1.031 1.6 2.404 1.6 3.862 0 1.458-.568 2.83-1.605 3.861l-.001.05zm-8.554-3.558c-.172-.086-1.015-.502-1.172-.559-.157-.058-.272-.086-.386.086-.115.172-.444.559-.544.673-.1.115-.201.129-.372.043-.172-.086-.725-.268-1.382-.852-.514-.458-.861-1.023-.961-1.195-.101-.172-.011-.266.075-.351.078-.078.172-.201.258-.301.086-.101.115-.172.172-.287.058-.115.029-.215-.014-.301-.043-.086-.386-.931-.53-1.275-.14-.334-.282-.289-.386-.294-.1-.005-.215-.005-.329-.005-.115 0-.301.043-.459.215-.157.172-.602.588-.602 1.433 0 .845.616 1.662.702 1.777.086.115 1.211 1.85 2.935 2.594 1.724.744 1.724.496 2.039.466.315-.029 1.015-.415 1.158-.816.143-.401.143-.745.1-.816-.043-.072-.157-.115-.329-.201z" />
                                </svg>
                                CONTACTAR POR WHATSAPP
                            </a>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fade" delay={500}>
                        <div className="cta-benefits">
                            <div className="cta-benefit-item">
                                <div className="cta-benefit-icon">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v6l4 2" />
                                    </svg>
                                </div>
                                <h3 className="cta-benefit-title">RESPUESTA EN 24H</h3>
                                <p className="cta-benefit-text">
                                    Garantizamos respuesta profesional en menos de un día hábil
                                </p>
                            </div>

                            <div className="cta-benefit-item">
                                <div className="cta-benefit-icon">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <h3 className="cta-benefit-title">CONFIDENCIALIDAD TOTAL</h3>
                                <p className="cta-benefit-text">
                                    Tu información y proyectos están protegidos con máxima seguridad
                                </p>
                            </div>

                            <div className="cta-benefit-item">
                                <div className="cta-benefit-icon">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <h3 className="cta-benefit-title">SIN COMPROMISO</h3>
                                <p className="cta-benefit-text">
                                    Consultoría inicial gratuita sin obligación de contratación
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
