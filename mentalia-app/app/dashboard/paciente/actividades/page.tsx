"use client";

import { useState, useEffect } from "react";

type Activity = {
  id: string;
  category: string;
  title: string;
  desc: string;
  duration: string;
  difficulty: "Fácil" | "Media" | "Profunda";
  benefit: string;
  steps: string[];
  tip: string;
};

const activities: Activity[] = [
  // ── MINDFULNESS ──────────────────────────────────────────────────────────
  {
    id: "m1",
    category: "Mindfulness",
    title: "Respiración 4-7-8",
    desc: "Técnica de respiración que activa el sistema nervioso parasimpático y reduce la ansiedad en minutos.",
    duration: "5 min",
    difficulty: "Fácil",
    benefit: "Reduce ansiedad y activa la calma",
    steps: [
      "Sentate cómodo con la espalda recta. Podés cerrar los ojos.",
      "Colocá la punta de la lengua detrás de los dientes superiores y mantela ahí durante todo el ejercicio.",
      "Exhalá completamente por la boca haciendo un sonido suave.",
      "Cerrá la boca e inhalá por la nariz contando mentalmente hasta 4.",
      "Sostené la respiración contando hasta 7.",
      "Exhalá completamente por la boca contando hasta 8.",
      "Eso es un ciclo. Repetí 4 veces en total.",
      "Al terminar, respirá normalmente y notá cómo se siente tu cuerpo.",
    ],
    tip: "Esta técnica fue desarrollada por el Dr. Andrew Weil. Es especialmente útil antes de dormir, antes de situaciones estresantes o cuando sentís un ataque de pánico comenzar.",
  },
  {
    id: "m2",
    category: "Mindfulness",
    title: "Escaneo corporal",
    desc: "Recorrido de atención por todo el cuerpo para liberar tensiones acumuladas sin darte cuenta.",
    duration: "12 min",
    difficulty: "Fácil",
    benefit: "Libera tensión física y conecta mente-cuerpo",
    steps: [
      "Acostarte boca arriba en un lugar cómodo. Cerrá los ojos.",
      "Respirá profundo tres veces, soltando el cuerpo con cada exhalación.",
      "Llevá tu atención a los pies. Notá cualquier sensación: calor, frío, tensión, hormigueo. Sin juzgar.",
      "Lentamente subí con la atención: pantorrillas, rodillas, muslos. En cada zona, si notás tensión, inhalá y al exhalar imaginá que esa zona se afloja.",
      "Continuá con la pelvis, abdomen y pecho. Notá cómo sube y baja con tu respiración.",
      "Recorré los brazos desde los hombros hasta los dedos.",
      "Subí por el cuello, la mandíbula (zona de mucha tensión), los ojos y el cuero cabelludo.",
      "Finalmente, sentí todo el cuerpo como un conjunto integrado.",
      "Respirá profundo y, cuando estés listo, mové suavemente los dedos y abrí los ojos.",
    ],
    tip: "Si te quedás dormido durante el ejercicio, está bien. Significa que tu cuerpo lo necesitaba. Para practicarlo despierto, hacelo sentado.",
  },
  {
    id: "m3",
    category: "Mindfulness",
    title: "5-4-3-2-1 Grounding",
    desc: "Técnica de anclaje sensorial para salir de la ansiedad y volver al momento presente.",
    duration: "5 min",
    difficulty: "Fácil",
    benefit: "Ancla al presente, corta espirales de ansiedad",
    steps: [
      "Cuando sientas que la ansiedad sube, detente donde estés.",
      "CINCO: Nombrá 5 cosas que podés VER a tu alrededor. Describílas en detalle (color, forma, tamaño).",
      "CUATRO: Nombrá 4 cosas que podés TOCAR. Tocalas y describí su textura: liso, rugoso, suave, frío.",
      "TRES: Nombrá 3 cosas que podés ESCUCHAR ahora mismo, incluyendo sonidos lejanos.",
      "DOS: Nombrá 2 cosas que podés OLER (o que te gustan oler, si no hay aromas presentes).",
      "UNO: Nombrá 1 cosa que podés SABOREAR o el último sabor que recordás.",
      "Respirá profundo. Notá cómo tu atención está ahora en el presente, no en los pensamientos que te generaban ansiedad.",
    ],
    tip: "Esta técnica es especialmente efectiva para el trastorno de estrés postraumático y crisis de pánico. Podés hacerla en cualquier lugar sin que nadie lo note.",
  },
  {
    id: "m4",
    category: "Mindfulness",
    title: "Meditación de nubes",
    desc: "Aprendé a observar tus pensamientos sin identificarte con ellos, como si fueran nubes que pasan.",
    duration: "10 min",
    difficulty: "Media",
    benefit: "Distancia cognitiva y reducción de rumiación",
    steps: [
      "Sentate cómodo y cerrá los ojos. Respirá profundo tres veces.",
      "Imaginá que estás acostado en un campo de pasto verde, mirando el cielo azul.",
      "Cada vez que aparezca un pensamiento —cualquiera— visualizalo como una nube que cruza el cielo.",
      "No importa si es una nube oscura (pensamiento negativo) o blanca (positivo). Solo observala pasar.",
      "Si te engancha una nube y empezás a pensar en ella, simplemente notá 'me enganché' y volvé al pasto mirando el cielo.",
      "No hay que vaciar la mente: el objetivo es notar los pensamientos sin seguirlos.",
      "Continuá por 7-10 minutos. Después abrí los ojos lentamente.",
    ],
    tip: "La mente va a divagar, eso es completamente normal. Cada vez que notás que te fuiste y volvés, estás haciendo exactamente el ejercicio. No es un fracaso, es el entrenamiento.",
  },

  // ── MOVIMIENTO ───────────────────────────────────────────────────────────
  {
    id: "mo1",
    category: "Movimiento",
    title: "Caminata consciente",
    desc: "Transformá una caminata común en una práctica de presencia plena que calma el sistema nervioso.",
    duration: "20 min",
    difficulty: "Fácil",
    benefit: "Reduce cortisol, mejora el humor",
    steps: [
      "Salí a caminar sin destino fijo. Dejá el teléfono en silencio o en casa.",
      "Empezá a ritmo normal y, después de dos minutos, ralentizá un poco el paso.",
      "Llevá la atención a tus pies: sentí cómo el talón toca el suelo, luego la planta, luego los dedos.",
      "Notá el movimiento de tus brazos y cómo tu peso se transfiere de un pie al otro.",
      "Expandí la atención hacia afuera: ¿Qué ves? ¿Qué escuchás? ¿Cómo está el aire?",
      "Si tu mente empieza a planear, recordar o preocuparse, suavemente volvé a la sensación de caminar.",
      "En los últimos 5 minutos, llevá la atención a tu respiración mientras seguís caminando.",
      "Al llegar, detente un momento y notá cómo se siente tu cuerpo.",
    ],
    tip: "Estudios muestran que 20 minutos de caminata en la naturaleza reducen la actividad de la región del cerebro asociada a la rumiación. No hace falta un parque: cualquier espacio al aire libre sirve.",
  },
  {
    id: "mo2",
    category: "Movimiento",
    title: "Estiramiento para liberar tensión",
    desc: "Secuencia de estiramientos enfocada en las zonas donde guardamos el estrés emocional.",
    duration: "10 min",
    difficulty: "Fácil",
    benefit: "Libera tensión acumulada en cuello, hombros y cadera",
    steps: [
      "CUELLO (2 min): Lentamente bajá la oreja derecha al hombro. Sostené 30 segundos. Luego el otro lado. Después, llevá el mentón al pecho y sostené.",
      "HOMBROS (2 min): Entrelazá los dedos detrás de la espalda. Abrí el pecho y elevá los brazos suavemente. Sostené 30 segundos. Después, cruzá un brazo por delante del pecho y presioná con el otro codo.",
      "ESPALDA (2 min): Sentado en el borde de la silla, cruzá una pierna sobre la otra y girá el torso hacia el lado de la pierna elevada. Sostené 30 seg por lado.",
      "CADERA (2 min): Acostado boca arriba, llevá una rodilla al pecho y abrazala. Sostené 30 segundos. Luego cruzá esa rodilla al lado opuesto manteniendo la espalda plana.",
      "CIERRE (2 min): Parado, estirá los brazos arriba, respirá profundo. Al exhalar, doblate hacia adelante con las rodillas ligeramente flexionadas. Colgá suelto por 1 minuto.",
    ],
    tip: "La cadera y los hombros son las zonas donde el cuerpo almacena más tensión emocional. Si sentís una emoción durante un estiramiento de cadera, es completamente normal: dejala pasar.",
  },
  {
    id: "mo3",
    category: "Movimiento",
    title: "Sacudir el cuerpo",
    desc: "Técnica somática inspirada en el TRE (Trauma Release Exercises) para soltar tensión acumulada.",
    duration: "7 min",
    difficulty: "Fácil",
    benefit: "Libera tensión nerviosa acumulada, energiza",
    steps: [
      "Parate con los pies al ancho de los hombros.",
      "Empezá a sacudir suavemente las muñecas, como si quisieras soltar agua de las manos.",
      "Subí el movimiento a los codos y luego a los hombros. Dejá que los brazos se muevan solos.",
      "Sumá el torso: dejá que el pecho y la espalda se muevan libremente.",
      "Ahora incluí las rodillas: flexionalas levemente y dejá que las piernas también vibren.",
      "Por 3-4 minutos, sacudite todo el cuerpo libremente. Podés emitir sonidos si querés.",
      "Lentamente, frenate. Quedá quieto y sentí la diferencia en tu cuerpo.",
    ],
    tip: "Los animales en la naturaleza sacuden su cuerpo después de situaciones de estrés para liberar el exceso de adrenalina. Los humanos inhibimos esta respuesta natural. Este ejercicio la restaura.",
  },

  // ── EMOCIONES ────────────────────────────────────────────────────────────
  {
    id: "e1",
    category: "Emociones",
    title: "Registro de emociones",
    desc: "Técnica cognitivo-conductual para identificar emociones, pensamientos y situaciones que los desencadenan.",
    duration: "10 min",
    difficulty: "Media",
    benefit: "Autoconocimiento emocional y regulación",
    steps: [
      "Agarrá un papel o abrí las notas del teléfono.",
      "SITUACIÓN: Describí brevemente qué pasó. Solo los hechos, sin interpretaciones ('mi jefe me llamó al despacho').",
      "PENSAMIENTO AUTOMÁTICO: ¿Qué pensaste en ese momento? ('Algo hice mal', 'Me van a echar').",
      "EMOCIÓN: ¿Qué sentiste? Intentá ser específico. No solo 'mal' sino: miedo, vergüenza, enojo, tristeza. Calificá la intensidad del 1 al 10.",
      "REACCIÓN: ¿Qué hiciste o quisiste hacer? (Evitar, confrontar, escapar, llorar).",
      "PENSAMIENTO ALTERNATIVO: ¿Hay otra manera de interpretar la situación? ¿Qué le dirías a un amigo en tu lugar?",
      "RESULTADO: ¿Cambió algo en cómo te sentís al ver la situación desde esta otra perspectiva?",
    ],
    tip: "No siempre el pensamiento alternativo hace que te sientas mejor de inmediato. El objetivo es ampliar la perspectiva, no forzar el optimismo. Traé este registro a tu próxima sesión.",
  },
  {
    id: "e2",
    category: "Emociones",
    title: "Carta a tu yo del futuro",
    desc: "Escribile una carta a quien vas a ser dentro de un año. Poderosa técnica de proyección y motivación.",
    duration: "20 min",
    difficulty: "Media",
    benefit: "Perspectiva temporal, esperanza y propósito",
    steps: [
      "Buscá un lugar tranquilo con papel y lapicera (o notas en el teléfono).",
      "Cerrá los ojos un momento e imaginá cómo te gustaría estar dentro de un año. No en términos de logros, sino emocionalmente: ¿Cómo querés sentirte?",
      "Empezá la carta con: 'Querido/a [tu nombre]: Escribo esto el [fecha de hoy]...'",
      "Contale a tu yo futuro qué está pasando ahora en tu vida y cómo te sentís.",
      "Explicale qué estás trabajando en terapia y qué esperás haber cambiado para entonces.",
      "Incluí algo que ya valorás de vos mismo/a hoy.",
      "Cerrá con algo esperanzador o con lo que le desearías a esa versión futura.",
      "Guardá la carta en algún lugar. Podés abrirla en un año.",
    ],
    tip: "Esta técnica se usa en terapia de aceptación y compromiso (ACT). Nos ayuda a conectar con nuestros valores y la dirección que queremos darle a nuestra vida, más allá de las dificultades actuales.",
  },
  {
    id: "e3",
    category: "Emociones",
    title: "3 cosas positivas del día",
    desc: "Práctica diaria de gratitud basada en neurociencia que entrena al cerebro a notar lo bueno.",
    duration: "5 min",
    difficulty: "Fácil",
    benefit: "Aumenta el bienestar y reduce el sesgo negativo",
    steps: [
      "Elegí un momento fijo del día —idealmente antes de dormir— para hacer este ejercicio.",
      "Tomá papel o un cuaderno exclusivo para esto (el 'diario de gratitud').",
      "Escribí 3 cosas buenas que pasaron hoy. No tienen que ser grandes: 'tuve un café rico', 'me llamó mi amiga', 'llegué a tiempo'.",
      "Para cada cosa, escribí una respuesta a: ¿Por qué pasó esto? ¿Qué dice de vos, de otros o de tu vida?",
      "Permitite sentir la emoción positiva por un momento. No la apures.",
      "Hacelo durante 21 días consecutivos para que se vuelva hábito.",
    ],
    tip: "Esta práctica fue validada por Martin Seligman (Psicología Positiva) y demostró reducir síntomas depresivos en estudios clínicos. Lo clave es escribirlo y reflexionar el por qué, no solo listar.",
  },
  {
    id: "e4",
    category: "Emociones",
    title: "Diálogo con una emoción difícil",
    desc: "En vez de huir de una emoción incómoda, aprendé a sentarla frente a vos y hablar con ella.",
    duration: "15 min",
    difficulty: "Profunda",
    benefit: "Integración emocional y reducción del miedo a emociones",
    steps: [
      "Identificá una emoción que estés evitando o que te molesta (miedo, rabia, tristeza, vergüenza).",
      "Sentate cómodo y cerrá los ojos. Respirá profundo.",
      "Imaginá que esa emoción toma una forma: ¿Qué tamaño tiene? ¿Qué color? ¿Qué textura? ¿Está dentro o fuera del cuerpo?",
      "Imaginate que la sentás frente a vos. Mirala sin huir.",
      "Preguntale: '¿Para qué estás acá? ¿Qué me querés decir? ¿Qué necesitás de mí?'",
      "Escuchá lo que surge. Puede ser una imagen, una sensación, palabras o nada. Todo está bien.",
      "Respondele desde un lugar tranquilo: '¿Hay algo que pueda hacer por vos?'",
      "Antes de terminar, agradecele por intentar protegerte, aunque su forma no siempre funcione.",
      "Abrí los ojos y anotá lo que surgió.",
    ],
    tip: "Este ejercicio está basado en la Terapia Focalizada en Emociones (EFT). Las emociones difíciles no son enemigas: son mensajes. Cuanto más las evitamos, más poder tienen. Traé lo que surgió a tu próxima sesión.",
  },

  // ── PENSAMIENTO ──────────────────────────────────────────────────────────
  {
    id: "p1",
    category: "Pensamiento",
    title: "Identificar distorsiones cognitivas",
    desc: "Aprendé a reconocer los patrones de pensamiento que aumentan el malestar sin base real.",
    duration: "15 min",
    difficulty: "Media",
    benefit: "Claridad mental y reducción de pensamientos negativos automáticos",
    steps: [
      "Anotá un pensamiento que te esté generando malestar. Ej: 'Siempre la cago en todo'.",
      "Ahora revisá si cae en alguna de estas distorsiones cognitivas:",
      "→ TODO O NADA: ¿Estás pensando en blanco y negro? ('siempre', 'nunca', 'todo', 'nada')",
      "→ CATASTROFISMO: ¿Estás asumiendo el peor escenario posible?",
      "→ LECTURA MENTAL: ¿Estás asumiendo lo que otros piensan sin evidencia?",
      "→ PERSONALIZACIÓN: ¿Estás tomando como personal algo que no lo es?",
      "→ FILTRO NEGATIVO: ¿Estás ignorando lo positivo y enfocándote solo en lo negativo?",
      "→ 'DEBERÍA': ¿Estás usando reglas rígidas sobre cómo vos o los demás deberían ser?",
      "Una vez que identificás la distorsión, reformulá el pensamiento de manera más equilibrada.",
      "Ej: 'Siempre la cago' → 'Esta vez cometí un error. A veces me sale bien y a veces no.'",
    ],
    tip: "No se trata de pensar positivo forzado. Se trata de pensar con más precisión y menos crueldad hacia uno mismo. Aaron Beck desarrolló esta técnica, que es el corazón de la Terapia Cognitivo-Conductual.",
  },
  {
    id: "p2",
    category: "Pensamiento",
    title: "Técnica del abogado defensor",
    desc: "Poné tus pensamientos negativos en un juicio y construí un caso en tu defensa.",
    duration: "15 min",
    difficulty: "Media",
    benefit: "Autocompasión y pensamiento más equilibrado",
    steps: [
      "Escribí el pensamiento negativo que tenés sobre vos mismo. Ej: 'Soy un fracaso'.",
      "Imaginá que ese pensamiento es una acusación en un juicio. Vos sos el acusado.",
      "EVIDENCIA A FAVOR de la acusación: Anota las evidencias que parecen apoyar ese pensamiento.",
      "EVIDENCIA EN CONTRA: Ahora sos tu abogado defensor. Buscá activamente evidencias que contradigan esa acusación. Hechos, logros, momentos en que no fue así.",
      "Considerá también: ¿Sería tan duro con un amigo en tu lugar?",
      "Redactá un veredicto más equilibrado basado en TODAS las evidencias, no solo en las negativas.",
      "Ej: 'He tenido fracasos, pero también logros. No soy un fracaso como persona porque haya fallado en esto.'",
    ],
    tip: "Este ejercicio entrena la autocompasión sin negar la responsabilidad. La autocrítica excesiva activa las mismas respuestas de amenaza que el peligro externo. Tu cerebro no distingue la diferencia.",
  },
  {
    id: "p3",
    category: "Pensamiento",
    title: "Preocupación programada",
    desc: "En vez de pelear contra los pensamientos intrusivos todo el día, dales un horario fijo.",
    duration: "20 min/día",
    difficulty: "Media",
    benefit: "Reduce la rumiación y el ciclo de preocupación crónica",
    steps: [
      "Elegí un horario fijo de 20 minutos al día como 'momento de preocupación'. Ej: 18:00hs.",
      "Durante el día, cada vez que aparezca una preocupación, anotala brevemente y decite: 'Eso va para las 18:00'.",
      "Al llegar al horario pactado, sentate con tus anotaciones.",
      "Por cada preocupación, evaluá: ¿Es un problema que puedo resolver ahora? Si sí, hacé UN paso concreto. Si no, practicá aceptación.",
      "Para las preocupaciones sobre cosas fuera de tu control: respirá, reconocé la incertidumbre y dejala estar.",
      "Cuando suene el tiempo, terminó. Cualquier preocupación nueva va para mañana.",
      "Hacelo durante 2 semanas. Los patrones de rumiación se reducen significativamente.",
    ],
    tip: "Esta técnica proviene de la Terapia Cognitiva Basada en Mindfulness (MBCT). Al ponerle horario a la preocupación, le quitás el control que tiene sobre el resto del día.",
  },

  // ── CONEXIÓN ─────────────────────────────────────────────────────────────
  {
    id: "c1",
    category: "Conexión",
    title: "Mensaje de agradecimiento real",
    desc: "Escribí y mandá un mensaje auténtico de agradecimiento a alguien que importa en tu vida.",
    duration: "10 min",
    difficulty: "Fácil",
    benefit: "Fortalece vínculos y aumenta el bienestar propio",
    steps: [
      "Pensá en alguien que haya tenido un impacto positivo en tu vida: un amigo, familiar, conocido.",
      "Abrí un mensaje (texto, email, carta en papel) y empezá con su nombre.",
      "Contale específicamente qué hizo o hace que valorás. No algo genérico: algo concreto.",
      "Explicale cómo eso impactó en vos o en tu vida.",
      "No pongas condicionales ni minimices: no 'no sé si te lo dije antes', solo el mensaje.",
      "Envialo. Si es una carta en papel, ponela en un sobre y dejala en algún lugar donde la vea.",
      "Notá cómo te sentís después de mandarlo.",
    ],
    tip: "Estudios de Psicología Positiva muestran que escribir y enviar cartas de gratitud es una de las intervenciones con mayor impacto en el bienestar subjetivo. Tanto quien da como quien recibe se beneficia.",
  },
  {
    id: "c2",
    category: "Conexión",
    title: "Escucha activa consciente",
    desc: "Practicá estar completamente presente en una conversación, sin distracciones ni respuestas automáticas.",
    duration: "Una conversación",
    difficulty: "Media",
    benefit: "Mejora vínculos y reduce sensación de soledad",
    steps: [
      "Elegí una conversación del día (en persona o por teléfono) para practicar.",
      "Antes de empezar, dejá el teléfono boca abajo o en el bolsillo.",
      "Mientras la otra persona habla, no prepares tu respuesta. Solo escuchá.",
      "Prestá atención no solo a las palabras sino al tono, las pausas y las emociones detrás.",
      "Hacé preguntas que muestren que escuchaste: '¿Y cómo te sentiste cuando eso pasó?'",
      "Evitá interrumpir, aconsejar sin que te lo pidan, o comparar con tu experiencia.",
      "Antes de responder, hacé una breve pausa de 2-3 segundos.",
      "Al final, resumí brevemente lo que entendiste para confirmar.",
    ],
    tip: "La mayor parte del tiempo escuchamos para responder, no para entender. Esta práctica no solo mejora tus relaciones: también reduce tu propia sensación de desconexión y soledad.",
  },
  {
    id: "c3",
    category: "Conexión",
    title: "Hora de desconexión digital",
    desc: "Una hora al día sin pantallas para reconectar con vos mismo y con quienes te rodean.",
    duration: "60 min",
    difficulty: "Fácil",
    benefit: "Reduce ansiedad, mejora presencia y calidad de sueño",
    steps: [
      "Elegí una hora fija del día para desconectarte completamente. La hora antes de dormir es ideal.",
      "Avisale a alguien cercano si es necesario ('entre las 21 y las 22 no estoy disponible').",
      "Dejá el teléfono en otra habitación o en silencio total.",
      "Elegí una actividad analógica: leer un libro físico, cocinar, dibujar, armar un rompecabezas, conversar cara a cara.",
      "Si sentís el impulso de agarrar el teléfono, nombralo: 'Tengo ganas de revisar el teléfono'. Y continuá con lo que estabas haciendo.",
      "Al terminar, notá cómo te sentís comparado con cuando empezaste.",
    ],
    tip: "La luz azul de las pantallas interfiere con la melatonina y dificulta el sueño. Pero más allá del sueño, el scroll constante entrena al cerebro a buscar estimulación continua, generando dificultad para tolerar el aburrimiento.",
  },

  // ── AUTOCUIDADO ──────────────────────────────────────────────────────────
  {
    id: "au1",
    category: "Autocuidado",
    title: "Diseñá tu rutina matutina",
    desc: "Creá una rutina de mañana que le dé estructura y propósito a tu día desde el primer minuto.",
    duration: "20-30 min",
    difficulty: "Fácil",
    benefit: "Reduce ansiedad, aumenta sensación de control",
    steps: [
      "Por los próximos 7 días, poné el despertador 20 minutos antes de lo habitual.",
      "PRIMER MOVIMIENTO (1 min): Antes de agarrar el teléfono, respirá profundo 5 veces.",
      "HIDRATACIÓN (2 min): Tomá un vaso de agua al levantarte. El cuerpo lleva horas sin agua.",
      "MOVIMIENTO (5 min): Estirá, hacé algunos movimientos suaves o simplemente caminá por la casa.",
      "INTENCIÓN DEL DÍA (2 min): Anotá UNA cosa que querés hacer o sentir hoy. Solo una.",
      "TELÉFONO: Solo después de los pasos anteriores, mirá el teléfono.",
      "Repetí esto durante 7 días y notá qué cambia en tu humor y energía durante la mañana.",
    ],
    tip: "No tiene que ser perfecta. Una rutina imperfecta que se hace todos los días vale más que una perfecta que se abandona. Empezá pequeño y expandí cuando se vuelva automática.",
  },
  {
    id: "au2",
    category: "Autocuidado",
    title: "Límites saludables",
    desc: "Aprendé a identificar dónde necesitás poner límites y cómo comunicarlos de manera clara y respetuosa.",
    duration: "20 min",
    difficulty: "Profunda",
    benefit: "Reduce resentimiento, mejora autorespeto y relaciones",
    steps: [
      "Pensá en una situación donde regularmente hacés algo que no querés hacer o te sentís mal después.",
      "Preguntate: ¿Qué es lo que realmente no quiero o no puedo hacer acá?",
      "Identificá qué te impide decir que no: ¿miedo al rechazo? ¿culpa? ¿costumbre? ¿no saber cómo?",
      "Practicá esta fórmula de límite: 'Cuando [situación], yo necesito [lo que necesitás]. Por eso [el límite].'",
      "Ejemplo: 'Cuando me llaman después de las 22, necesito descansar. Por eso no voy a atender el teléfono después de esa hora.'",
      "Notá que no necesitás dar una justificación larga. Un límite no se negocia con argumentos.",
      "Ensayá decirlo en voz alta, solo. La primera vez suele sentirse raro: eso es normal.",
      "Elegí una situación pequeña donde aplicarlo esta semana.",
    ],
    tip: "Los límites no son muros para alejar a las personas: son la condición para que las relaciones sean sostenibles. Sin límites, llega el resentimiento. Poner límites es un acto de honestidad y cuidado mutuo.",
  },
  {
    id: "au3",
    category: "Autocuidado",
    title: "Higiene del sueño",
    desc: "Mejorá la calidad de tu sueño con hábitos simples que hacen una diferencia real.",
    duration: "Diario",
    difficulty: "Fácil",
    benefit: "Mejora el estado de ánimo, energía y regulación emocional",
    steps: [
      "HORARIO FIJO: Intentá acostarte y levantarte a la misma hora todos los días, incluso fines de semana.",
      "RUTINA DE CIERRE (30 min antes): Bajá las luces, dejá el teléfono, hacé algo relajante.",
      "TEMPERATURA: El cuarto fresco (18-20°C) favorece el sueño. Si no podés controlar la temperatura, usá ventilador.",
      "OSCURIDAD: El cuerpo necesita oscuridad para producir melatonina. Bloqueá la luz que entra por la ventana.",
      "EVITAR: Cafeína después de las 14hs, alcohol (altera las fases del sueño), pantallas brillantes antes de dormir.",
      "Si no podés dormirte en 20 minutos: levantate, hacé algo tranquilo en penumbra y volvé cuando tengas sueño.",
      "No te quedes en la cama mirando el techo: el cerebro asocia la cama con vigilia.",
    ],
    tip: "El sueño insuficiente aumenta la reactividad emocional hasta un 60% y reduce la capacidad de tolerar frustraciones. Muchos síntomas de ansiedad y mal humor mejoran significativamente con mejor calidad de sueño.",
  },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Mindfulness:  { bg: "#D8F3DC", text: "#2D6A4F", border: "#52B788" },
  Movimiento:   { bg: "#dbeafe", text: "#1d4ed8", border: "#60a5fa" },
  Emociones:    { bg: "#fce7f3", text: "#9d174d", border: "#f472b6" },
  Pensamiento:  { bg: "#ede9fe", text: "#6d28d9", border: "#a78bfa" },
  Conexión:     { bg: "#fef3c7", text: "#92400e", border: "#fbbf24" },
  Autocuidado:  { bg: "#f0fdf4", text: "#166534", border: "#86efac" },
};

const difficultyColor: Record<string, string> = {
  Fácil:    "#2D6A4F",
  Media:    "#d97706",
  Profunda: "#9d174d",
};

export default function ActividadesPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [openActivity, setOpenActivity] = useState<Activity | null>(null);

  useEffect(() => {
    try {
      setCompleted(JSON.parse(localStorage.getItem("mentalia-actividades") ?? "[]"));
    } catch { /* ignore */ }
  }, []);

  function toggleCompleted(id: string) {
    const updated = completed.includes(id)
      ? completed.filter(x => x !== id)
      : [...completed, id];
    setCompleted(updated);
    localStorage.setItem("mentalia-actividades", JSON.stringify(updated));
  }

  const categories = ["Todas", ...Array.from(new Set(activities.map(a => a.category)))];
  const filtered = selectedCategory === "Todas" ? activities : activities.filter(a => a.category === selectedCategory);
  const doneCount = completed.length;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis actividades</h1>
          <p className="text-gris text-sm mt-1">Ejercicios terapéuticos para trabajar entre sesiones</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 text-center">
          <div className="text-2xl font-bold" style={{ color: "#2D6A4F" }}>{doneCount}/{activities.length}</div>
          <div className="text-xs text-gris">completadas</div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso general</span>
          <span className="text-sm font-bold" style={{ color: "#2D6A4F" }}>
            {Math.round((doneCount / activities.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(doneCount / activities.length) * 100}%`, background: "#2D6A4F" }}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map(cat => {
          const style = cat !== "Todas" ? categoryColors[cat] : null;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border-2"
              style={{
                background: isActive ? (style?.bg ?? "#2D6A4F") : "white",
                color: isActive ? (style?.text ?? "white") : "#6B7280",
                borderColor: isActive ? (style?.border ?? "#2D6A4F") : "#e5e7eb",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(act => {
          const done = completed.includes(act.id);
          const cat = categoryColors[act.category] ?? { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" };
          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
              style={{ opacity: done ? 0.75 : 1 }}
            >
              {/* Top */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: cat.bg, color: cat.text }}>
                      {act.category}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100" style={{ color: difficultyColor[act.difficulty] }}>
                      {act.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleCompleted(act.id)}
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ borderColor: done ? "#2D6A4F" : "#d1d5db", background: done ? "#2D6A4F" : "white" }}
                    title={done ? "Marcar como pendiente" : "Marcar como completada"}
                  >
                    {done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                        <path d="M2 6 L5 9 L10 3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>

                <h3 className="font-bold text-gray-900 mb-1" style={{ textDecoration: done ? "line-through" : "none" }}>
                  {act.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{act.desc}</p>

                <div className="flex items-center gap-3 text-xs text-gris">
                  <span>⏱ {act.duration}</span>
                  <span>·</span>
                  <span style={{ color: cat.text }}>✓ {act.benefit}</span>
                </div>
              </div>

              {/* Ver ejercicio */}
              <div className="border-t border-gray-100 px-5 py-3">
                <button
                  onClick={() => setOpenActivity(act)}
                  className="text-sm font-semibold transition-colors"
                  style={{ color: "#2D6A4F" }}
                >
                  Ver ejercicio completo →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de ejercicio */}
      {openActivity && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={e => { if (e.target === e.currentTarget) setOpenActivity(null); }}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4 rounded-t-3xl">
              <div>
                <div className="flex gap-2 mb-1 flex-wrap">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: categoryColors[openActivity.category]?.bg, color: categoryColors[openActivity.category]?.text }}
                  >
                    {openActivity.category}
                  </span>
                  <span className="text-xs text-gris px-2.5 py-1 rounded-full bg-gray-100">⏱ {openActivity.duration}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100" style={{ color: difficultyColor[openActivity.difficulty] }}>
                    {openActivity.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{openActivity.title}</h2>
              </div>
              <button onClick={() => setOpenActivity(null)} className="text-gris hover:text-gray-800 flex-shrink-0 text-xl leading-none">
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">
              <p className="text-sm text-gray-600 leading-relaxed">{openActivity.desc}</p>

              {/* Steps */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Pasos del ejercicio</h3>
                <ol className="space-y-3">
                  {openActivity.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                        style={{ background: step.startsWith("→") ? "transparent" : "#2D6A4F", color: step.startsWith("→") ? "#6B7280" : "white", minWidth: 24 }}
                      >
                        {step.startsWith("→") ? "" : i + 1}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tip clínico */}
              <div className="rounded-2xl p-4" style={{ background: "#f0faf5" }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#2D6A4F" }}>Nota clínica</p>
                <p className="text-sm text-gray-700 leading-relaxed">{openActivity.tip}</p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { toggleCompleted(openActivity.id); setOpenActivity(null); }}
                  className="flex-1 py-3 font-semibold rounded-xl text-sm transition-all"
                  style={{
                    background: completed.includes(openActivity.id) ? "white" : "#2D6A4F",
                    color: completed.includes(openActivity.id) ? "#2D6A4F" : "white",
                    border: `2px solid #2D6A4F`,
                  }}
                >
                  {completed.includes(openActivity.id) ? "Marcar como pendiente" : "✓ Marcar como completada"}
                </button>
                <button
                  onClick={() => setOpenActivity(null)}
                  className="px-5 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
