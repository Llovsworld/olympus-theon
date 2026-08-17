import ScrollReveal from './ScrollReveal';

const principles = [
    {
        number: '01',
        title: 'Verdad antes que comodidad',
        description: 'Partimos de un diagnóstico honesto. No puedes cambiar lo que aún intentas justificar.',
    },
    {
        number: '02',
        title: 'Sistemas antes que motivación',
        description: 'Diseñamos estructuras simples para actuar también en los días en los que no apetece.',
    },
    {
        number: '03',
        title: 'Progreso que se puede medir',
        description: 'Revisamos conductas, rendimiento y resultados. Lo que no se observa termina diluyéndose.',
    },
];

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="principles-section section-anchor" aria-labelledby="principles-title">
            <div className="container">
                <ScrollReveal variant="fade">
                    <div className="principles-heading">
                        <p className="section-kicker">NUESTRO ESTÁNDAR</p>
                        <h2 id="principles-title">NO VENDEMOS MOTIVACIÓN.<br />CONSTRUIMOS CAPACIDAD.</h2>
                        <p>
                            Cada programa se apoya en tres principios de trabajo. Son sencillos de entender,
                            incómodos de practicar y decisivos cuando se sostienen en el tiempo.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="principles-grid">
                    {principles.map((principle, index) => (
                        <ScrollReveal key={principle.number} variant="fade" delay={index * 100}>
                            <article className="principle-card">
                                <span className="principle-number" aria-hidden="true">{principle.number}</span>
                                <h3>{principle.title}</h3>
                                <p>{principle.description}</p>
                            </article>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
