import ScrollReveal from './ScrollReveal';
import { Link } from '@/i18n/navigation';

export default function CTASection() {
    return (
        <section className="cta-section section-anchor">
            <div className="container">
                <div className="cta-content-wrapper">
                    <ScrollReveal variant="fade">
                        <h2 className="cta-main-title">
                            TU SIGUIENTE NIVEL<br />EMPIEZA CON UNA DECISIÓN
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal variant="fade" delay={200}>
                        <p className="cta-main-description">
                            Cuéntanos dónde estás, qué quieres cambiar y qué te está frenando.
                            Tendrás una conversación directa para decidir si el método encaja contigo.
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
                                HABLAR POR WHATSAPP
                            </a>
                            <Link href="/contact" className="btn-cta-email">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                                ENVIAR UNA CONSULTA
                            </Link>
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
                                <h3 className="cta-benefit-title">PRIMERA CONVERSACIÓN</h3>
                                <p className="cta-benefit-text">
                                    Entendemos tu situación antes de proponerte un camino
                                </p>
                            </div>

                            <div className="cta-benefit-item">
                                <div className="cta-benefit-icon">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <h3 className="cta-benefit-title">TRATO DIRECTO</h3>
                                <p className="cta-benefit-text">
                                    Sin automatismos ni discursos genéricos: hablamos de tu caso
                                </p>
                            </div>

                            <div className="cta-benefit-item">
                                <div className="cta-benefit-icon">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <h3 className="cta-benefit-title">DECISIÓN INFORMADA</h3>
                                <p className="cta-benefit-text">
                                    Sabrás qué programa encaja y qué nivel de compromiso requiere
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
