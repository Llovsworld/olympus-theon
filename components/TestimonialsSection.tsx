'use client';

import { useEffect, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';

const testimonials = [
    {
        featuredQuote: "Olympus Theon cambió mi vida.",
        quote: "Pasé de estar estancado en mi negocio y con sobrepeso a liderar mi sector con una claridad mental absoluta. La disciplina que enseñan es otro nivel.",
        name: "Carlos R.",
        role: "CEO y Emprendedor",
        image: "/images/testimonials/avatar1.jpg"
    },
    {
        featuredQuote: "Más que un programa de coaching, es una hermandad.",
        quote: "Te exige tu máximo estándar. Alejandro no te deja caer en la mediocridad. Resultados físicos y mentales desde el primer mes.",
        name: "Javier M.",
        role: "Arquitecto",
        image: "/images/testimonials/avatar2.jpg"
    },
    {
        featuredQuote: "Entré buscando mejorar mi físico y salí con una transformación completa.",
        quote: "He ganado músculo, perdí grasa y sobre todo, encontré un propósito claro. Esto es lo que todo hombre necesita.",
        name: "Miguel Á.",
        role: "Ingeniero de Software",
        image: "/images/testimonials/avatar3.jpg"
    },
    {
        featuredQuote: "La mentoría de Alejandro es implacable pero efectiva.",
        quote: "En 3 meses conseguí más que en los últimos 5 años. El enfoque en disciplina, nutrición y mentalidad es brutal.",
        name: "David L.",
        role: "Consultor Financiero",
        image: "/images/testimonials/avatar4.jpg"
    },
    {
        featuredQuote: "Si buscas motivación barata, esto no es para ti.",
        quote: "Si quieres resultados reales y una comunidad de hombres comprometidos, este es tu lugar. Mejores decisiones, mejor cuerpo, mejor vida.",
        name: "Roberto F.",
        role: "Abogado",
        image: "/images/testimonials/avatar5.jpg"
    },
    {
        featuredQuote: "Olympus Theon no solo transformó mi físico, sino mi manera de pensar.",
        quote: "Ahora tomo decisiones con confianza y ejecuto sin dudar. La inversión más rentable que he hecho.",
        name: "Antonio S.",
        role: "Director de Marketing",
        image: "/images/testimonials/avatar6.jpg"
    }
];

// Helper to get initials
const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
};

export default function TestimonialsSection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const cardWidth = 900 + 32; // card width + gap
            const index = Math.round(scrollLeft / cardWidth);
            setActiveIndex(index % testimonials.length);

            // Implement circular scroll
            const maxScroll = container.scrollWidth - container.clientWidth;
            const threshold = 50;

            if (scrollLeft >= maxScroll - threshold) {
                container.scrollTo({ left: 0, behavior: 'auto' });
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToIndex = (index: number) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const cardWidth = 900 + 32;
        container.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
    };

    // Duplicate testimonials for seamless circular scroll
    const displayTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="testimonials-section-scroll">
            <div className="container">
                <ScrollReveal variant="fade" delay={0}>
                    <div className="testimonials-header">
                        <p className="testimonials-label">TESTIMONIOS</p>
                        <h2 className="testimonials-main-title">LO QUE DICEN LOS INICIADOS</h2>
                        <p className="testimonials-subtitle">
                            Las palabras de nuestros clientes hablan más fuerte que cualquier promesa.<br />
                            Resultados reales, transformaciones medibles.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Horizontal Scroll Container */}
                <div className="testimonials-scroll-container" ref={scrollContainerRef}>
                    <div className="testimonials-scroll-wrapper-horizontal">
                        {displayTestimonials.map((testimonial, index) => {
                            const actualIndex = index % testimonials.length;

                            return (
                                <div
                                    key={index}
                                    className="testimonial-card-scroll"
                                >
                                    {/* Header with avatar, name, and stars */}
                                    <div className="testimonial-card-header-scroll">
                                        <div className="testimonial-author-section-scroll">
                                            <div className="testimonial-avatar-scroll">
                                                {getInitials(testimonial.name)}
                                            </div>
                                            <div className="testimonial-author-details-scroll">
                                                <h3 className="testimonial-author-name-scroll">{testimonial.name}</h3>
                                                <p className="testimonial-author-role-scroll">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        <div className="testimonial-rating-scroll">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quote */}
                                    <blockquote className="testimonial-quote-scroll">
                                        "{testimonial.featuredQuote} {testimonial.quote}"
                                    </blockquote>

                                    {/* Navigation Arrows in card */}
                                    <div className="testimonial-arrows-inline">
                                        <button
                                            className="testimonial-arrow-inline"
                                            onClick={() => {
                                                const prevIndex = (actualIndex - 1 + testimonials.length) % testimonials.length;
                                                scrollToIndex(prevIndex);
                                            }}
                                            aria-label="Anterior"
                                        >
                                            <svg viewBox="0 0 24 24">
                                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="testimonial-arrow-inline"
                                            onClick={() => {
                                                const nextIndex = (actualIndex + 1) % testimonials.length;
                                                scrollToIndex(nextIndex);
                                            }}
                                            aria-label="Siguiente"
                                        >
                                            <svg viewBox="0 0 24 24">
                                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Dots below */}
                <div className="testimonials-dots-below">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`testimonial-dot-below ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => scrollToIndex(index)}
                            aria-label={`Ver testimonio ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Statistics */}
                <ScrollReveal variant="fade" delay={400}>
                    <div className="testimonials-stats">
                        <p className="testimonials-stats-label">Más de 150 clientes transformados en 3 años</p>
                        <div className="testimonials-stats-grid">
                            <div className="testimonials-stat">
                                <div className="testimonials-stat-value">4.9/5</div>
                                <div className="testimonials-stat-label">CALIFICACIÓN PROMEDIO</div>
                            </div>
                            <div className="testimonials-stat">
                                <div className="testimonials-stat-value">95%</div>
                                <div className="testimonials-stat-label">TASA DE RETENCIÓN</div>
                            </div>
                            <div className="testimonials-stat">
                                <div className="testimonials-stat-value">100%</div>
                                <div className="testimonials-stat-label">RECOMENDARÍAN</div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
