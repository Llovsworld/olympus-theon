import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const slug = 'como-calmar-la-ansiedad';
const categories = ['Psicología', 'Mentalidad'];
const content = `
<p>¿Alguna vez has sentido ansiedad y has intentado todo lo posible para hacerla desaparecer? ¿Lo conseguiste? ¿Cuánto tiempo llevas anhelando dejar atrás dicha sensación?</p>
<p>Puede que tus respuestas sean parecidas a estas: «Es un infierno vivir con la ansiedad», «Hago todo lo posible para que desaparezca y sigue ahí», «Llevo años intentando quitarme esta sensación y noto que cada vez voy a peor» o «Ni con fármacos me la quito».</p>
<p>Bien, en este artículo voy a enseñarte cómo poder controlar la ansiedad y, sobre todo, cómo empezar a vivir una vida más tranquila y con una mayor fortaleza mental para afrontar la ansiedad y observarla desde otra perspectiva.</p>

<h2>¿Qué es la ansiedad?</h2>
<p>Es una reacción emocional normal y un mecanismo de defensa natural frente al estrés. Hay dos tipos que se diferencian en cuanto a la función y al impacto que pueden ocasionar en la persona: ansiedad adaptativa y ansiedad patológica.</p>

<h3>Ansiedad adaptativa</h3>
<p>Este tipo funciona y actúa como un sistema de alarma a corto plazo. Te prepara para enfrentar una situación importante, desafiante o peligrosa en un momento determinado. En otras palabras, tiene una causa clara, ayuda a reaccionar de manera saludable y desaparece cuando el evento ha pasado.</p>
<p>Esta se puede dar en entornos laborales, como en una entrevista de trabajo. También se puede dar al reaccionar ante la huida de alguna situación desastrosa, por lo que nos ayuda a elevar nuestro estado de alarma para ayudarnos y mejorarnos.</p>

<h3>Ansiedad patológica</h3>
<p>Como comentábamos en el punto anterior, la ansiedad adaptativa es un estado de alarma «natural». Cuando se desregula o desconfigura, ocasiona un trastorno que se activa sin que exista una amenaza o peligro real.</p>
<p>Esta desregulación viene provocada por amenazas imaginarias o exageradas respecto a lo que realmente se está viviendo. Suele generar un gran sufrimiento en la persona que lo está experimentando y llega a interferir en la vida diaria.</p>
<p>Como puedes comprobar, la ansiedad es una emoción totalmente normal y natural del ser humano. La clave no está en hacerla desaparecer o erradicarla totalmente, sino en saber convivir con ella y, con un razonamiento continuado, manejarla y controlarla a través de nuestros pensamientos.</p>
<p>Hablando sobre pensamientos, me refiero a saber dar la importancia justa y necesaria a todos los sucesos que vayan ocurriendo en nuestra vida. Aquí dependemos más de pensar en abundancia que en escasez. Lo trataremos en otro artículo.</p>

<h2>Canalizando la ansiedad</h2>
<p>A diferencia de la depresión, la ansiedad es un sentimiento de agitación. Al tener agitación, tenemos energía y esta se puede canalizar de dos maneras: Orden y Caos.</p>
<p>Antes de explicar qué hábitos se encasillan en cada uno de ellos, me gustaría aclarar que la ansiedad puede llevarse a un estado de crecimiento o de destrucción. Esto se debe a que podemos afrontar y aceptar la ansiedad poco a poco e iremos revitalizando nuestro ser, o podemos huir y no aceptar el sentimiento, provocando una reacción contraria a lo que queremos conseguir.</p>
<p>Querer huir y no aceptar el sentimiento ocasiona un círculo tóxico que cada vez se agranda más. Es decir, al tener esta conducta nos podemos sentir aliviados a corto plazo; sin embargo, nuestro cerebro lo va a interpretar como una situación peligrosa y, por tanto, acrecentará la sensación de miedo y de terror.</p>
<p>Sin embargo, enfrentar la ansiedad y permitir que conviva con nosotros ocasionará un nuevo hábito mental en el cerebro. Nuestro cerebro comenzará a vincular dicha situación con el sentimiento de que no es un peligro real. Esto, por sí solo, nos mantendrá más conscientes, más calmados y, por este motivo, la ansiedad acabará desapareciendo.</p>
<p>Una vez aclarados estos puntos, te estarás preguntando: ¿qué hábitos son los que me hacen tener más orden o más caos en mi vida?</p>
<p>Te los desgloso a continuación:</p>

<h2>Orden</h2>

<h3>Argumentación racional y consciente</h3>
<p>Es importante dejar de terribilizar las situaciones de la vida y saber que todo tiene solución, excepto la muerte. Es una cuestión de actitud que viene acompañada siempre de una renuncia consciente.</p>

<h3>Actividad física</h3>
<p>Practicar deporte o pasear es fundamental para poder canalizar bien la ansiedad. Es importante reeducar nuestro sistema nervioso; por ello, al terminar una actividad física, el cerebro interpreta que «hemos escapado del peligro». Además, nos beneficiamos de la secreción de hormonas como las endorfinas, la serotonina y la dopamina.</p>

<h3>Meditación</h3>
<p>Practicar mindfulness o respiración consciente nos permite saber comunicar a nuestro sistema nervioso que todo está bien.</p>
<p>Primero calma nuestro nervio vago, provocando un sistema de recuperación que nos ayuda a estar en el aquí y ahora. Además, estudios de neurociencia han mostrado cómo la meditación constante reduce físicamente el tamaño y, por tanto, la reactividad de la amígdala —región del cerebro responsable de disparar el miedo y la ansiedad—. Aparte, han demostrado cómo la corteza prefrontal —área del cerebro encargada de la lógica, la concentración y el control de los impulsos— se vuelve más densa, permitiendo una mayor capacidad mental para observar los pensamientos y controlar nuestro comportamiento hacia ellos.</p>

<h2>Caos</h2>
<p>Cuando huimos de la ansiedad, nos adentramos en el círculo tóxico mencionado en párrafos anteriores. Este tipo de conductas o hábitos son a los que habitualmente acudimos porque no soportamos tener la emoción de la ansiedad en nosotros y acudimos a ellos para que nos calmen.</p>
<p>Esto es un error porque, al «calmarnos», solo nos estamos haciendo la ilusión de que algo externo va a aliviar nuestro malestar.</p>
<p>Estos hábitos neuróticos suelen ser los siguientes:</p>

<h3>Drogas</h3>
<p>Todo lo que tenga relación con desinhibirse, como el alcohol, el tabaco, la cocaína u otro tipo de sustancia, nos va a saciar la ansiedad a corto plazo, pero no vamos a conseguir trabajar internamente para poder solucionar los mecanismos interiores a largo plazo.</p>

<h3>Fármacos</h3>
<p>Los ansiolíticos, bajo mi punto de vista, son unos medicamentos trampa que nos venden. Nos dan una sensación de calma en las primeras tomas, pero, a medida que el cuerpo se acaba adaptando, se tiene que subir la dosis o uno acaba desesperado porque no le hacen efecto.</p>
<p>Esto le transmite al cerebro que queremos huir de la sensación y, por ende, acaba viéndola como peligrosa, dejándonos con más ansiedad y, por lo tanto, con más miedo a la sensación por no marcharse. Acabas teniendo miedo al propio miedo.</p>
<p><strong>Cualquier tratamiento farmacológico debe estar indicado y supervisado por un médico. No cambies la dosis ni suspendas la medicación sin consultarlo previamente con un profesional sanitario.</strong></p>

<h3>Masturbación</h3>
<p>Existe la masturbación compulsiva, que funciona como un refugio ilusorio. Pensamos que detrás de la masturbación viene un momento de «desestrés»; sin embargo, es una conducta compulsiva que nos lleva a estar peor de lo que estábamos y, si se utilizan medios externos como el porno, pueden llegar a crear dependencia y cambios conductuales.</p>

<h3>Trabajo</h3>
<p>La obsesión por el trabajo habría que comprenderla para saber si nos estamos ocultando en el trabajo porque nos está aliviando o porque de verdad queremos pasar tiempo en la actividad debido a que nos está resultando satisfactoria.</p>

<p>Lo que me ayuda es escribir y hacer una introspección. Comprendo si realmente estoy acudiendo a cierto tipo de actividades o materias por el hecho de querer evitar la sensación o no en ese momento. Por eso, acabo siendo más consciente de mi interior y de mi exterior. Pienso con perspectiva a corto y a largo plazo; es decir, me pregunto lo siguiente: ¿esto me está haciendo huir o no? ¿Y cómo me voy a sentir después de esto?</p>
<p>Cada uno tiene que reflexionar sobre sus «miedos» e «inseguridades» para estar atento a cómo reacciona ante ellos y cómo los maneja emocionalmente.</p>
`.trim();

const data = {
    title: 'Cómo quitar la ansiedad',
    slug,
    content,
    excerpt: 'Una reflexión personal sobre cómo controlar y canalizar la ansiedad mediante el orden, la actividad física, la meditación y la introspección.',
    metaDescription: 'Cómo quitar la ansiedad: una reflexión personal sobre el orden, el caos y los hábitos que pueden ayudarnos a afrontarla con mayor fortaleza mental.',
    category: categories[0],
    categories,
    featuredImage: '/como-calmar-ansiedad-portada.webp',
    published: true,
};

try {
    const post = await prisma.post.upsert({
        where: { slug },
        update: data,
        create: data,
        select: {
            id: true,
            title: true,
            slug: true,
            categories: true,
            featuredImage: true,
            published: true,
        },
    });

    console.log(JSON.stringify(post));
} finally {
    await prisma.$disconnect();
}
