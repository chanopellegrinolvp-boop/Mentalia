// Pre-filtro barato (sin IA) para el diario emocional del paciente.
// Sesgo hacia la seguridad: ante la duda, escala. Mejor un falso positivo a gpt-4o
// que perder una señal real. Solo si esto matchea se llama a la IA.
//
// Criterio: se normaliza el texto (minúsculas + sin tildes) y se busca cualquiera
// de estos patrones de señal de alerta (ideación suicida, autolesión, desesperanza),
// con variantes y errores de tipeo comunes.

const PATRONES: RegExp[] = [
  /suicid/,                                              // suicidio, suicidarme, suicida
  /matar(me|se)|me quiero matar|quiero matarme/,
  /quitarme la vida|acabar con mi vida|terminar con mi vida|sacarme la vida/,
  /(quiero|deseo|ganas de) morir(me)?|me quiero morir|ojala.*(muera|muriera)|mejor muert/,
  /no quiero (vivir|seguir|estar aca|estar aqui|existir|despertar)/,
  /no (vale|valgo) la pena/,
  /hacer(me)? dano|dano a mi mism|lastimar(me)?|cortarme|autolesion|autolastim|me corto|me lastimo/,
  /no aguanto mas|no doy mas|ya no puedo mas|no puedo mas con (todo|esto|la vida)/,
  /(no hay|sin) salida|sin sentido|nada tiene sentido|nada vale/,
  /(quiero|ganas de) desaparecer|que todo (termine|acabe|se termine)|desaparecer para siempre/,
  /estoy mejor muerto|estarian mejor sin mi|nadie me va a extranar/,
];

export function detectaSenalAlerta(texto: string | null | undefined): boolean {
  if (!texto) return false;
  const t = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // saca tildes
  return PATRONES.some((re) => re.test(t));
}
