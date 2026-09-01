import ScrollReveal from '@/components/ScrollReveal';
import ContactForm from '@/components/ContactForm';
import { legalPublic } from '@/lib/legal-public';

export default function ContactPage() {
    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            background: '#000',
            color: '#e0e0e0',
            overflow: 'hidden'
        }}>
            {/* Hero Background Image */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/contact-hero.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1
            }} />

            {/* Gradient Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.95) 100%)',
                zIndex: 2
            }} />

            <style>{`
                [data-contact-reason]:hover {
                    border-left-color: #fff !important;
                    padding-left: 2.5rem !important;
                }

                [data-contact-direct-link]:hover {
                    transform: translateY(-5px);
                }
            `}</style>

            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '7rem 2rem 4rem'
            }}>
                {/* Hero Section */}
                <ScrollReveal variant="fade">
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '5rem'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '0.5rem 1.5rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            marginBottom: '2rem',
                            fontSize: '0.75rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#fff'
                        }}>
                            Contacto
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 6vw, 4rem)',
                            fontWeight: '800',
                            lineHeight: '0.95',
                            marginBottom: '1.5rem',
                            color: '#ffffff',
                            letterSpacing: '-0.04em',
                            textTransform: 'uppercase'
                        }}>
                            Comienza Tu<br />Transformación
                        </h1>
                        <div style={{
                            width: '80px',
                            height: '1px',
                            background: '#fff',
                            margin: '0 auto 2.5rem',
                            opacity: 0.3
                        }} />
                        <p style={{
                            fontSize: '1.05rem',
                            color: '#a0a0a0',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: '1.65',
                            fontWeight: '300'
                        }}>
                            Todo camino hacia la excelencia comienza con un primer paso. Si quieres forjar el tuyo o tienes preguntas sobre nuestra filosofía, estamos aquí para guiarte.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Main Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>
                    {/* Left: Why Contact Us */}
                    <div>
                        <ScrollReveal variant="fade" direction="right">
                            <h2 style={{
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em',
                                color: '#666',
                                marginBottom: '2rem'
                            }}>
                                Por Qué Contactarnos
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                {[
                                    {
                                        title: 'Coaching Personal',
                                        description: 'Orientación personalizada adaptada a tu viaje de transformación'
                                    },
                                    {
                                        title: 'Consultas sobre Libros',
                                        description: 'Conoce más sobre nuestras publicaciones y filosofía'
                                    },
                                    {
                                        title: 'Oportunidades de Colaboración',
                                        description: 'Colabora con nosotros para forjar la excelencia juntos'
                                    }
                                ].map((item, index) => (
                                    <div key={index} data-contact-reason style={{
                                        borderLeft: '1px solid rgba(255,255,255,0.1)',
                                        paddingLeft: '2rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                    >
                                        <h3 style={{
                                            fontSize: '1.4rem',
                                            fontWeight: '600',
                                            color: '#fff',
                                            marginBottom: '0.75rem',
                                            letterSpacing: '-0.01em'
                                        }}>
                                            {item.title}
                                        </h3>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: '#888',
                                            lineHeight: '1.6'
                                        }}>
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right: Contact Form */}
                    <ScrollReveal variant="fade" direction="left">
                        <ContactForm />
                    </ScrollReveal>
                </div>

                {/* Direct Contact Section */}
                <ScrollReveal variant="fade">
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        paddingTop: '5rem',
                        textAlign: 'center'
                    }}>
                        <h3 style={{
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: '#666',
                            marginBottom: '3rem'
                        }}>
                            O Contáctanos Directamente
                        </h3>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '4rem',
                            flexWrap: 'wrap'
                        }}>
                            {/* WhatsApp */}
                            <a
                                data-contact-direct-link
                                href="https://wa.me/34608961701"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    textDecoration: 'none',
                                    transition: 'transform 0.3s ease'
                                }}
                            >
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.02)'
                                }}>
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.698c.968.585 1.903.896 2.79.897h.001c3.181 0 5.768-2.586 5.769-5.766 0-1.545-.601-2.997-1.694-4.089-1.094-1.092-2.546-1.694-4.075-1.695zm6.316 9.854c-1.03 1.033-2.406 1.602-3.869 1.603-1.066 0-2.075-.344-3.032-.912l-.218-.128-2.25.59.602-2.193-.142-.226c-.615-.978-1.004-2.004-1.004-3.35 0-3.009 2.448-5.458 5.457-5.458 1.458 0 2.83.568 3.861 1.601 1.032 1.031 1.6 2.404 1.6 3.862 0 1.458-.568 2.83-1.605 3.861l-.001.05zm-8.554-3.558c-.172-.086-1.015-.502-1.172-.559-.157-.058-.272-.086-.386.086-.115.172-.444.559-.544.673-.1.115-.201.129-.372.043-.172-.086-.725-.268-1.382-.852-.514-.458-.861-1.023-.961-1.195-.101-.172-.011-.266.075-.351.078-.078.172-.201.258-.301.086-.101.115-.172.172-.287.058-.115.029-.215-.014-.301-.043-.086-.386-.931-.53-1.275-.14-.334-.282-.289-.386-.294-.1-.005-.215-.005-.329-.005-.115 0-.301.043-.459.215-.157.172-.602.588-.602 1.433 0 .845.616 1.662.702 1.777.086.115 1.211 1.85 2.935 2.594 1.724.744 1.724.496 2.039.466.315-.029 1.015-.415 1.158-.816.143-.401.143-.745.1-.816-.043-.072-.157-.115-.329-.201z" />
                                    </svg>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>WhatsApp</div>
                                    <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '500' }}>+34 608 961 701</div>
                                </div>
                            </a>

                            {/* Email */}
                            <a
                                data-contact-direct-link
                                href={`mailto:${legalPublic.email}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    textDecoration: 'none',
                                    transition: 'transform 0.3s ease'
                                }}
                            >
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.02)'
                                }}>
                                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="1.5">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Correo</div>
                                    <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '500' }}>{legalPublic.email}</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
