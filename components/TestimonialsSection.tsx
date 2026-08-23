'use client';

import { useEffect, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';

const testimonials = [
    {
        featuredQuote: "La disciplina precede a la motivación.",
        quote: "Construimos sistemas que siguen funcionando incluso cuando las ganas desaparecen.",
        name: "Principio I",
        role: "DISCIPLINA",
        image: "/images/testimonials/avatar1.jpg"
    },
    {
        featuredQuote: "Primero claridad. Después, acción.",
        quote: "Definimos qué importa, eliminamos el ruido y convertimos objetivos en decisiones concretas.",
        name: "Principio II",
        role: "CLARIDAD",
        image: "/images/testimonials/avatar2.jpg"
    },
    {
        featuredQuote: "El cuerpo es la base del rendimiento.",
        quote: "Entrenamiento, nutrición y recuperación sostienen la energía necesaria para liderar tu vida.",
        name: "Principio III",
        role: "CUERPO",
        image: "/images/testimonials/avatar3.jpg"
    },
    {
        featuredQuote: "El carácter vale más que la apariencia.",
        quote: "La verdadera transformación se demuestra en la responsabilidad, la palabra y la conducta diaria.",
        name: "Principio IV",
        role: "CARÁCTER",
        image: "/images/testimonials/avatar4.jpg"
    },
    {
        featuredQuote: "La consistencia supera a la intensidad.",
        quote: "No buscamos impulsos breves, sino hábitos sostenibles que acumulen progreso real.",
        name: "Principio V",
        role: "CONSTANCIA",
        image: "/images/testimonials/avatar5.jpg"
    },
    {
        featuredQuote: "El esfuerzo necesita una dirección.",
        quote: "Alineamos cuerpo, mente y valores para avanzar con intención y construir una vida coherente.",
        name: "Principio VI",
        role: "PROPÓSITO",
        image: "/images/testimonials/avatar6.jpg"
    }
];
const displayTestimonials = [...testimonials, ...testimonials];
const testimonialCardWidth = 900 + 32;

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
        let animationFrame = 0;

        const updateActiveTestimonial = () => {
            animationFrame = 0;
            const scrollLeft = container.scrollLeft;
            const index = Math.round(scrollLeft / testimonialCardWidth) % testimonials.length;
            setActiveIndex((currentIndex) => currentIndex === index ? currentIndex : index);

            // Implement circular scroll
            const maxScroll = container.scrollWidth - container.clientWidth;
            const threshold = 50;

            if (scrollLeft >= maxScroll - threshold) {
                container.scrollTo({ left: 0, behavior: 'auto' });
            }
        };

        const handleScroll = () => {
            if (!animationFrame) {
                animationFrame = window.requestAnimationFrame(updateActiveTestimonial);
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
        };
    }, []);

    const scrollToIndex = (index: number) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.scrollTo({
            left: index * testimonialCardWidth,
            behavior: 'smooth'
        });
    };

    return (
        <section className="testimonials-section-scroll">
            <div className="container">
                <ScrollReveal variant="fade" delay={0}>
                    <div className="testimonials-header">
                        <p className="testimonials-label">PRINCIPIOS</p>
                        <h2 className="testimonials-main-title">EL CÓDIGO OLYMPUS</h2>
                        <p className="testimonials-subtitle">
                            Los estándares que sostienen cada proceso. <br />
                            Disciplina, claridad y propósito aplicados al día a día.
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
                                    {/* Header with principle number, name, and marks */}
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
                                                    <path d="M12 3 21 12 12 21 3 12 12 3Z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quote */}
                                    <blockquote className="testimonial-quote-scroll">
                                        &quot;{testimonial.featuredQuote} {testimonial.quote}&quot;
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
                            aria-label={`Ver principio ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Statistics */}
                <ScrollReveal variant="fade" delay={400}>
                    <div className="testimonials-stats">
                        <p className="testimonials-stats-label">Un método integral para construir disciplina, claridad y propósito</p>
                        <div className="testimonials-stats-grid">
                            <div className="testimonials-stat">
                                <div className="testimonials-stat-value">1:1</div>
                                <div className="testimonials-stat-label">ACOMPAÑAMIENTO PERSONALIZADO</div>
                            </div>
                            <div className="testimonials-stat">
                                <div className="testimonials-stat-value">3</div>
                                <div className="testimonials-stat-label">PILARES DEL MÉTODO</div>
                            </div>
                            <div className="testimonials-stat">
                                <div className="testimonials-stat-value">360°</div>
                                <div className="testimonials-stat-label">ENFOQUE INTEGRAL</div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
