// lib/invitations.ts

// ==========================================
// 1. ESTRUCTURA ANTERIOR (DISCERNIMIENTO)
// ==========================================

export type InvitationConfig = {
  slug: string;
  nombre: string;
  password: string;
  unlockAtArgentina: string;
  meetUrl: string;
  title: string;
  verse: string;
  verseRef: string;
};

export const invitations: Record<string, InvitationConfig> = {
  'carla-canamero': {
    slug: 'carla-canamero',
    nombre: 'Carla Cañamero',
    password: 'CC2026',
    unlockAtArgentina: '2026-03-10T11:00:00-03:00',
    meetUrl: 'https://meet.google.com/tu-codigo-aqui',
    title: 'DISCERNIMIENTO PARA QUIENES SON INVITADOS A SERVIR',
    verse:
      '“No tomen como modelo a este mundo. Por el contrario, transfórmense interiormente renovando su mentalidad, a fin de que puedan discernir cuál es la voluntad de Dios: lo que es bueno, lo que le agrada, lo perfecto.”',
    verseRef: 'Romanos 12,2'
  }
};

export type InvitationContent = {
  intro: string[];
  objetivos: string[];
  actividades: string[];
  bloques: Array<{
    titulo: string;
    lema?: string;
    intro?: string;
    preguntas?: string[];
    nota?: string;
    oracion?: string[];
  }>;
  cierre: string[];
};

export const invitationContent: InvitationContent = {
  intro: [
    'Jesús siempre te invita a seguir en marcha, ayudando a tu prójimo que así lo necesita, poniendo al servicio el carisma y los dones que Él nos regaló a través de su Espíritu. Él nunca nos pide más de lo que podemos dar y nos da la libertad para discernir los llamados que nos hace.',
    'Por eso, te pedimos que en esta ocasión hagas como el Samaritano, escuchar el llamado de Dios en donde te necesita, y predisponer el corazón para interpretar dónde te está llamando hoy en tu vida.',
    'Queremos invitarte debido a tu compromiso, acompañamiento, a tus convicciones y valores cristianos, virtud del diálogo y carisma peregrino a que este año participes en el EQUIPO DE COMUNIDAD.'
  ],
  objetivos: [
    'Formación espiritual de los peregrinos.',
    'Buscar la manera de educar al peregrino en la Fe y la Espiritualidad, para que el movimiento sea el puente hacia una vida de crecimiento espiritual personal y compartida en sociedad.',
    'Que cada encuentro tenga un momento de meditación, de bajar a la realidad y conectar con aquello que se ha hablado, y un momento de aprendizaje para que cada uno pueda llevarse un mensaje que lo impulse a seguir caminando.',
    'Mantener actualizadas las charlas que se vayan dando, entendiendo y atendiendo lo que los peregrinos necesitan y lo que la comunidad busca en cada momento.'
  ],
  actividades: [
    'Búsqueda de charlistas acordes a las charlas propuestas, indicándoles aquello que se pretende transmitir, los tiempos disponibles y todo aquello que sea necesario. Acompañarlos hasta la charla.',
    'Preparación de material y preguntas para la meditación posterior a cada charla, para materializar lo escuchado y que cada uno pueda llevarse un mensaje de lo aprendido.',
    'Guiar el encuentro de Comunidad: preparar el salón, armar el altar, marcar tiempos y la organización del encuentro, y su cierre.',
    'Misas Peregrinas: encargarse de que cada tercer domingo del mes haya peregrinos para las lecturas, ofrendas y coro, para celebrar la misa peregrina en Pquia. Virgen Niña.'
  ],
  bloques: [
    {
      titulo: 'BLOQUE Nº1: DISPONER EL CORAZÓN',
      lema: '“No responder desde la emoción, sino desde la oración.”',
      intro: 'Antes de decir sí o no, regalate un momento con Dios.',
      preguntas: [
        '¿Qué sentí cuando me invitaron? ¿Alegría? ¿Miedo? ¿Presión? ¿Paz?',
        '¿Estoy queriendo responder rápido por entusiasmo o por quedar bien?',
        '¿Me estoy dando el tiempo de escuchar a Dios?'
      ],
      nota: 'Recordá: el servicio no es un premio, es un llamado. Y nadie está obligado a decir que sí.',
      oracion: [
        'Señor, si este llamado viene de Vos, regalame claridad.',
        'Quita de mi corazón el miedo, la presión o el orgullo.',
        'Que pueda responder con libertad y verdad.',
        'Amén.'
      ]
    },
    {
      titulo: 'BLOQUE Nº2: MIRAR MI PROPIO CAMINO',
      lema: '“Primero soy peregrino, después servidor.”',
      intro: 'Antes de pensar en lo que puedo dar, preguntarme dónde estoy parado.',
      preguntas: [
        '¿Estoy caminando mi fe o estoy estancado?',
        '¿Busco servir para crecer o para escapar de algo?',
        '¿Tengo apertura a dejarme acompañar?',
        '¿Estoy dispuesto a seguir convirtiéndome?',
        '¿Qué me entusiasma del servicio?',
        '¿Qué me asusta?',
        '¿Qué siento que Dios viene trabajando en mí este último tiempo?'
      ],
      nota: 'Un servidor no es el que ya llegó. Es el que sigue caminando… y acepta que también necesita ayuda.'
    },
    {
      titulo: 'BLOQUE Nº3: DISCERNIR LOS MOVIMIENTOS INTERIORES',
      lema: '“La paz profunda y humilde suele ser señal de Dios.” – San Ignacio',
      intro: 'No todo entusiasmo es de Dios. No todo miedo significa que no es de Dios.',
      preguntas: [
        'Cuando imagino servir, ¿siento paz o ansiedad?',
        '¿Me acerca más a Dios o me desenfoca?',
        '¿Me ayuda a crecer en humildad o me infla el ego?',
        '¿Estoy dispuesto a servir aunque no me vean?'
      ],
      nota: 'Buscá la paz humilde, no la euforia pasajera.'
    },
    {
      titulo: 'BLOQUE Nº4: CONFIRMACIÓN',
      intro: 'Después de rezarlo, hablalo.',
      preguntas: [
        'Compartí lo que sentís con los animadores.',
        'Pedí consejo.',
        'No tengas miedo de decir “necesito más tiempo”.',
        'Y tampoco tengas miedo de decir que no.'
      ],
      nota: 'El servicio no define tu valor. Tu identidad es ser hijo/a de Dios, no ser parte de un equipo.'
    }
  ],
  cierre: [
    'ORACIÓN FINAL',
    'Espíritu Santo, si este es el lugar donde querés que camine, regalame disponibilidad y humildad.',
    'Si no es ahora, dame libertad para decirlo con paz.',
    'Que mi respuesta no nazca del miedo ni del entusiasmo vacío, sino del deseo sincero de seguirte.',
    'Amén.',
    'CONTACTO DE LOS ANIMADORES DEL ÁREA:'
  ]
};

export function getInvitationBySlug(slug: string) {
  return invitations[slug] ?? null;
}

export function validateInvitationPassword(slug: string, password: string) {
  const invitation = getInvitationBySlug(slug);
  if (!invitation) return false;
  return invitation.password === password;
}

// ==========================================
// 2. NUEVA ESTRUCTURA (DINÁMICA RETIRO - DEMO)
// ==========================================

// lib/invitations.ts

export type DynamicConfig = {
  slug: string;
  nombre: string;
  password: string;
  youtubeId: string;
  esIndividual: boolean;    // true para solos, false para coequipers
  companero?: string;       // Nombre del coequiper si esIndividual es false
};

export const retiroDynamics: Record<string, DynamicConfig> = {
  'mili-morales': {
    slug: 'mili-morales',
    nombre: 'Mili Morales',
    password: 'Milim',
    youtubeId: 'N4rIuvOY9PU',
    esIndividual: true
  },
  'nacho-reta': {
    slug: 'nacho-reta',
    nombre: 'Ignacio Reta',
    password: 'Nachor',
    youtubeId: '178EYiylqGg',
    esIndividual: true
  },
  'santi-farrando': {
    slug: 'santi-farrando',
    nombre: 'Santiago Farrando',
    password: 'Santif',
    youtubeId: 'w-1Oo-ZuPp0',
    esIndividual: true
  },
  'aru-osterauer': {
    slug: 'aru-osterauer',
    nombre: 'Aruma Osterauer',
    password: 'Arumao',
    youtubeId: 'JDWpo_MOx84', // Pega el ID del Short de Aruma acá cuando lo tengas
    esIndividual: false,
    companero: 'Sofi Mutis'
  },
  'sofi-mutis': {
    slug: 'sofi-mutis',
    nombre: 'Sofi Mutis',
    password: 'Sofim',
    youtubeId: 'yJYXwHYmfIM',
    esIndividual: false,
    companero: 'Aruma Osterauer'
  },
  'ivan-lucero': {
    slug: 'ivan-lucero',
    nombre: 'Ivan Lucero',
    password: 'Ivanl',
    youtubeId: 'B6cmEHApapM',
    esIndividual: false,
    companero: 'Agustín Hernández'
  },
  'agus-hernandez': {
    slug: 'agus-hernandez',
    nombre: 'Agustín Hernández',
    password: 'Agush',
    youtubeId: '3cJYyoT3KHE',
    esIndividual: false,
    companero: 'Ivan Lucero'
  }
};

export function getDynamicBySlug(slug: string) {
  return retiroDynamics[slug] ?? null;
}

export function validateDynamicPassword(slug: string, password: string): boolean {
  const dynamic = retiroDynamics[slug];
  if (!dynamic) return false;
  // Validación exacta de mayúsculas/minúsculas para las claves personalizadas
  return dynamic.password.trim() === password.trim();
}