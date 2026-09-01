import Link from 'next/link';
import FooterNewsletterForm from './FooterNewsletterForm';
import { legalPublic } from '@/lib/legal-public';

export default function Footer() {
    return (
        <footer className="footer-compact">
            <div className="container">
                <div className="footer-main">
                    {/* Column 1: Logo + Description + Social Icons */}
                    <div className="footer-brand-col">
                        <div className="footer-logo">OLYMPUS THEON</div>
                        <p className="footer-tagline">
                            Metodología para convertir visión en disciplina, claridad y acción.
                            Desarrollo integral mediante un sistema estructurado.
                        </p>
                        <div className="footer-social-icons">
                            <a href="https://www.instagram.com/llovsworld/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="https://x.com/OlympusTheon" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X (Twitter)">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://substack.com/@olympustheon" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Substack">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@OlympusTheon" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="YouTube">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a href={`mailto:${legalPublic.email}`} className="footer-social-link" aria-label="Email">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </a>
                            <a href="https://wa.me/34608961701" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="WhatsApp">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="footer-links-col">
                        <h4 className="footer-col-title">NAVEGACIÓN</h4>
                        <nav className="footer-nav-list">
                            <Link href="/blog">Blog</Link>
                            <Link href="/books">Libros</Link>
                            <Link href="/programas">Programas</Link>
                            <Link href="/contact">Contacto</Link>
                        </nav>
                    </div>

                    {/* Column 3: Contenido */}
                    <div className="footer-links-col">
                        <h4 className="footer-col-title">CONTENIDO</h4>
                        <nav className="footer-nav-list">
                            <Link href="/#method">Metodología</Link>
                            <Link href="/#story">Sobre el CEO</Link>
                            <Link href="/#testimonials">Principios</Link>
                            <Link href="#newsletter">Newsletter</Link>
                        </nav>
                    </div>

                    {/* Column 4: Legal */}
                    <div className="footer-links-col">
                        <h4 className="footer-col-title">LEGAL</h4>
                        <nav className="footer-nav-list">
                            <Link href="/aviso-legal">Aviso legal</Link>
                            <Link href="/privacidad">Privacidad</Link>
                            <Link href="/cookies">Cookies</Link>
                            <Link href="/terminos">Condiciones de uso</Link>
                            <Link href="/accesibilidad">Accesibilidad</Link>
                        </nav>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="footer-newsletter" id="newsletter">
                    <div className="footer-newsletter-content">
                        <div className="footer-newsletter-text">
                            <h4 className="footer-newsletter-title">Únete a la Élite</h4>
                            <p className="footer-newsletter-subtitle">Protocolos mentales y físicos. Sin spam.</p>
                        </div>
                        <FooterNewsletterForm />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="footer-bottom-compact">
                    <p className="footer-copyright">© {new Date().getFullYear()} Olympus Theon. Todos los derechos reservados.</p>
                    <div className="footer-contact-info">
                        <a href={`mailto:${legalPublic.email}`} className="footer-contact-link">{legalPublic.email}</a>
                        <a href={`tel:${legalPublic.phoneHref}`} className="footer-contact-link">{legalPublic.phoneDisplay}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
