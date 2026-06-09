// lib/invitations.ts

export type DynamicConfig = {
  slug: string;
  nombre: string;
  password: string;
  // Mensaje de bienvenida inicial
  mensajeBienvenida: string;
  // ID del video de YouTube (ej: de https://www.youtube.com/watch?v=dQw4w9WgXcQ el ID es dQw4w9WgXcQ)
  youtubeVideoId: string; 
  // Consigna final
  esIndividual: boolean;
  companero?: string; // Opcional, por si es con alguien más
  actividadEspecifica: string;
};

export const retiroDynamics: Record<string, DynamicConfig> = {
  'demo-tomas': {
    slug: 'demo-tomas',
    nombre: 'Tomás García',
    password: 'DEMO',
    mensajeBienvenida: '¡Qué alegría que estés acá, Tomi! Este es un momento pensado exclusivamente para vos. Te invitamos a respirar profundo, dejar de lado las corridas del día y disponer el corazón para lo que Dios tiene preparado hoy.',
    // Video de prueba (puedes cambiarlo por cualquier ID de YouTube válido)
    youtubeVideoId: 'dQw4w9WgXcQ', 
    esIndividual: false,
    companero: 'Mateo Fernández',
    actividadEspecifica: 'Diríjanse al sector del jardín cerca de la cruz de madera. Juntos van a leer el pasaje de Emaús que tienen en sus mochilas y van a compartir en qué momentos del año sintieron que Jesús caminaba al lado de ustedes, incluso sin darse cuenta.'
  }
};

export function getDynamicBySlug(slug: string) {
  return retiroDynamics[slug] ?? null;
}

export function validateDynamicPassword(slug: string, password: string): boolean {
  const dynamic = retiroDynamics[slug];
  if (!dynamic) return false;
  return dynamic.password.trim().toUpperCase() === password.trim().toUpperCase();
}