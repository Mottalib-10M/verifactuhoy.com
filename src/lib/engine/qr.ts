/**
 * URL del código QR tributario: AEAT, « Características del QR y especificaciones del servicio de cotejo »,
 * versión 0.5.0 (10/12/2025), y Orden HAC/1177/2024, artículos 20 y 21.
 * Parámetros: nif (9), numserie (hasta 60, ASCII 32 a 126), fecha (DD-MM-AAAA), importe (hasta 12 enteros y 2 decimales, punto).
 */
import P from '../../data/params-2026.json';

export type Modalidad = 'verifactu' | 'noverifactu';
export type Entorno = 'produccion' | 'pruebas';
export interface DatosQr { nif: string; numserie: string; fecha: string; importe: string }
export interface Lectura extends DatosQr { modalidad: Modalidad; entorno: Entorno; host: string; errores: string[]; avisos: string[]; url: string }

const Q = P.qr;
export const baseUrl = (m: Modalidad, e: Entorno) => (e === 'pruebas' ? (m === 'verifactu' ? Q.pruebasVerifactu : Q.pruebasNoVerifactu) : (m === 'verifactu' ? Q.verifactu : Q.noVerifactu));

/** Codificación de la AEAT: cada valor en UTF-8 y codificado para URL. */
export function construirUrl(d: DatosQr, m: Modalidad = 'verifactu', e: Entorno = 'produccion'): string {
  const enc = (s: string) => encodeURIComponent(s.trim());
  return `${baseUrl(m, e)}?nif=${enc(d.nif.toUpperCase())}&numserie=${enc(d.numserie)}&fecha=${enc(d.fecha)}&importe=${enc(d.importe)}`;
}

export const NIF_RE = /^[0-9A-Z]{9}$/;
export const FECHA_RE = /^(\d{2})-(\d{2})-(\d{4})$/;
export const IMPORTE_RE = /^-?\d{1,12}(\.\d{1,2})?$/;

/** Letra de control del DNI y del NIE (números de 8 cifras más letra). Para los NIF de entidades solo se comprueba el formato. */
export function letraDni(nif: string): 'ok' | 'mal' | 'no-aplica' {
  const n = nif.toUpperCase();
  const m = /^([0-9XYZ])(\d{7})([A-Z])$/.exec(n);
  if (!m) return 'no-aplica';
  const num = Number(({ X: '0', Y: '1', Z: '2' } as Record<string, string>)[m[1]] ?? m[1]) * 1e7 + Number(m[2]);
  return 'TRWAGMYFPDXBNJZSQVHLCKE'[num % 23] === m[3] ? 'ok' : 'mal';
}

export function validarDatos(d: DatosQr): { errores: string[]; avisos: string[] } {
  const errores: string[] = [], avisos: string[] = [];
  if (!NIF_RE.test(d.nif.toUpperCase())) errores.push('nif');
  else if (letraDni(d.nif) === 'mal') avisos.push('nif-letra');
  if (!d.numserie || d.numserie.length > Q.numserieMax || /[^\x20-\x7e]/.test(d.numserie)) errores.push('numserie');
  const f = FECHA_RE.exec(d.fecha);
  if (!f) errores.push('fecha');
  else { const dt = new Date(Date.UTC(+f[3], +f[2] - 1, +f[1])); if (dt.getUTCDate() !== +f[1] || dt.getUTCMonth() !== +f[2] - 1) errores.push('fecha'); }
  if (!IMPORTE_RE.test(d.importe)) errores.push('importe');
  return { errores, avisos };
}

/** Lee el texto de un QR (o una URL pegada). Devuelve null si no es una URL de cotejo de la AEAT. */
export function leerUrl(texto: string): Lectura | null {
  let u: URL;
  try { u = new URL(texto.trim()); } catch { return null; }
  const host = u.hostname.toLowerCase();
  const prod = host === 'www2.agenciatributaria.gob.es', pre = host === 'prewww2.aeat.es';
  const path = u.pathname;
  const m: Modalidad | null = /\/ValidarQRNoVerifactu$/i.test(path) ? 'noverifactu' : /\/ValidarQR$/i.test(path) ? 'verifactu' : null;
  if ((!prod && !pre) || !m || !/\/wlpl\/TIKE-CONT\//i.test(path)) return null;
  const g = (k: string) => u.searchParams.get(k) ?? '';
  const d: DatosQr = { nif: g('nif'), numserie: g('numserie'), fecha: g('fecha'), importe: g('importe') };
  const { errores, avisos } = validarDatos(d);
  if (u.protocol !== 'https:') avisos.push('http');
  if (u.searchParams.has('formato')) avisos.push('formato');
  return { ...d, modalidad: m, entorno: pre ? 'pruebas' : 'produccion', host, errores, avisos, url: u.toString() };
}

/** Texto de cualquier QR leído: ¿es un QR tributario de VERI*FACTU, de TicketBAI u otra cosa? */
export function clasificar(texto: string): 'verifactu' | 'ticketbai' | 'url' | 'texto' {
  if (leerUrl(texto)) return 'verifactu';
  try { const u = new URL(texto.trim()); return /tbai|ticketbai|batuz/i.test(u.hostname + u.pathname) ? 'ticketbai' : 'url'; } catch { return 'texto'; }
}
