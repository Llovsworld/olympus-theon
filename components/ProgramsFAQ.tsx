'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "¿Puedo empezar desde cero?",
        answer: "Nuestros programas están diseñados tanto para personas que empiezan desde cero como para quienes ya han iniciado su transformación y quieren llevarla al siguiente nivel. Adaptamos la intensidad al punto de partida de cada participante, manteniendo los mismos principios de excelencia."
    },
    {
        question: "¿Cuánto tiempo requiere?",
        answer: "El compromiso mínimo es de 12 semanas para The Spartan Protocol. Esperamos dedicación de 6-8 horas semanales entre entrenamiento, estudio y prácticas de mindset. La transformación real no tiene atajos."
    },
    {
        question: "¿Qué incluye el programa?",
        answer: "Acceso a entrenamiento adaptado, educación general sobre hábitos y nutrición no clínica, sesiones de coaching en vivo, biblioteca de recursos sobre estoicismo y desarrollo personal, comunidad privada y seguimiento semanal del progreso."
    },
    {
        question: "¿Hay garantía de resultados?",
        answer: "Los resultados dependen del punto de partida, la constancia y el cumplimiento del plan; no existen resultados automáticos. Sí ofrecemos una metodología estructurada, seguimiento y ajustes durante todo el proceso."
    },
    {
        question: "¿Cómo es el proceso de aplicación?",
        answer: "Iniciamos con una entrevista donde conocemos tu situación actual, objetivos y nivel de compromiso. Buscamos personas dispuestas a realizar el trabajo necesario. Si el programa encaja contigo, definimos el punto de partida y comenzamos el proceso."
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
