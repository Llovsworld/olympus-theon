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
        answer: "El alcance exacto depende del formato elegido. Puede incluir protocolos de entrenamiento, guía nutricional, sesiones en vivo, materiales de trabajo, comunidad y revisión periódica del progreso. Antes de empezar dejamos por escrito qué incluye tu programa."
    },
    {
        question: "¿Qué resultados puedo esperar?",
        answer: "Los resultados dependen de tu punto de partida, salud, contexto y nivel de cumplimiento. El programa aporta estructura, seguimiento y herramientas; no promete resultados idénticos para todos. Definiremos indicadores realistas antes de comenzar."
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
                                    aria-expanded={openIndex === index}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span>{item.question}</span>
                                    <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                                </button>
                                <div
                                    id={`faq-answer-${index}`}
                                    className={`faq-answer ${openIndex === index ? 'open' : ''}`}
                                    role="region"
                                    aria-hidden={openIndex !== index}
                                >
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
