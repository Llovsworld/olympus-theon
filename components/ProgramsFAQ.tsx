'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "¿Es para principiantes?",
        answer: "Nuestros programas están diseñados tanto para principiantes ambiciosos como para hombres que ya han comenzado su transformación pero buscan llevarla al siguiente nivel. Adaptamos la intensidad según tu punto de partida, pero todos siguen los mismos principios de excelencia."
    },
    {
        question: "¿Cuánto tiempo requiere?",
        answer: "El compromiso mínimo es de 12 semanas para The Spartan Protocol. Esperamos dedicación de 6-8 horas semanales entre entrenamiento, estudio y prácticas de mindset. La transformación real no tiene atajos."
    },
    {
        question: "¿Qué incluye el programa?",
        answer: "Acceso completo a protocolos de entrenamiento, planes de nutrición personalizados, sesiones de coaching en vivo, biblioteca de recursos sobre estoicismo y desarrollo masculino, comunidad privada de élite, y seguimiento semanal de progreso."
    },
    {
        question: "¿Hay garantía de resultados?",
        answer: "Garantizamos resultados solo para aquellos que se comprometen completamente. Si sigues el protocolo al 100% durante 12 semanas y no ves transformación medible (física, mental, espiritual), trabajamos contigo hasta que la alcances. La mediocridad no es una opción."
    },
    {
        question: "¿Cómo es el proceso de aplicación?",
        answer: "Iniciamos con una entrevista de admisión donde evaluamos tu compromiso, situación actual y objetivos. No aceptamos a todos. Buscamos hombres dispuestos a hacer el trabajo duro. Tras la aprobación, recibes acceso inmediato y comenzamos tu transformación."
    }
];

export default function ProgramsFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="container">
                <ScrollReveal variant="fade">
                    <h2 className="faq-title">PREGUNTAS FRECUENTES</h2>
                </ScrollReveal>

                <div className="faq-list">
                    {faqData.map((item, index) => (
                        <ScrollReveal key={index} variant="slideScale" direction="up" delay={index * 100}>
                            <div className="faq-item">
                                <button
                                    className={`faq-question ${openIndex === index ? 'active' : ''}`}
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span>{item.question}</span>
                                    <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                                </button>
                                <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
