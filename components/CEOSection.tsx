import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

export default function CEOSection() {
    return (
        <section className="ceo-section">
            <div className="container">
                <div className="ceo-content">
                    <ScrollReveal direction="left" variant="slideScale" duration={1000}>
                        <div className="ceo-image-wrapper">
                            <Image
                                src="/ceo_portrait.jpg?v=2"
                                alt="Alejandro Lloveras Sauras"
                                fill
                                className="ceo-image"
                                unoptimized
                            />
                        </div>
                    </ScrollReveal>
                    <div className="ceo-info">
                        <ScrollReveal direction="right" variant="slide" delay={200}>
                            <h2 className="ceo-name">Alejandro Lloveras Sauras</h2>
                            <p className="ceo-role">Fundador y CEO</p>
                        </ScrollReveal>
                        <ScrollReveal direction="right" variant="fade" delay={400}>
                            <div className="ceo-bio">
                                <p>
                                    Visionario. Líder. Estoico. Alejandro fundó Olympus Theon con una misión singular: forjar la próxima generación de hombres de élite. Con experiencia en atletismo de alto rendimiento y un profundo estudio de la filosofía clásica, combina disciplina física con fortaleza mental.
                                </p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal direction="right" variant="slideScale" delay={600}>
                            <blockquote className="ceo-quote">
                                "No solo construimos cuerpos; construimos carácter. El mundo moderno necesita hombres fuertes: capaces, responsables y virtuosos. Ese es el estándar que establecemos aquí."
                            </blockquote>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
