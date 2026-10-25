/**
 * Reglas puras del sitio. Cada fecha y cada importe vienen de params-2026.json, leídos en el BOE el día retrieved_at.
 *   verifactu()     RD 1007/2023, artículos 1.3, 3 y 4, y disposición final cuarta (redacción del RDL 15/2025)
 *   b2b()           Ley 18/2022 DF 8ª, RD 238/2026 (arts. 3, 4, DT 2ª y 3ª, DF 4ª), Orden HAC/1028/2026
 *   sancion()       LGT artículos 201 bis y 188.3
 *   plazoHabil()    RIVA artículo 69 bis y RD 238/2026 artículo 10: días naturales sin sábados, domingos ni festivos nacionales
 *   simplificada()  RD 1619/2012 artículo 4
 *   rectificativa() RD 1619/2012 artículo 15 y TipoFactura R1 a R5 de la Orden HAC/1177/2024
 */
import P from '../../data/params-2026.json';

const V = P.verifactu, B = P.b2b, S = P.sanciones;

/* ------------------------------------------------------------ fechas */
export const isoDia = (d: Date) => d.toISOString().slice(0, 10);
const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);
export function sumarMeses(iso: string, meses: number): string {
  const d = utc(iso); const dia = d.getUTCDate();
  d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + meses);
  const ult = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(dia, ult));
  return isoDia(d);
}
/** Víspera de una fecha « antes del ... »: último día para estar al día. */
export const vispera = (iso: string) => { const d = utc(iso); d.setUTCDate(d.getUTCDate() - 1); return isoDia(d); };
const FESTIVOS = new Set<string>(Object.values(P.festivos as Record<string, string[]>).flat());
export const anosFestivos = Object.keys(P.festivos).map(Number);
export const esInhabil = (iso: string) => { const w = utc(iso).getUTCDay(); return w === 0 || w === 6 || FESTIVOS.has(iso); };
/** Suma n días « naturales » excluyendo sábados, domingos y festivos nacionales (RIVA art. 69 bis.1, último párrafo). */
export function plazoHabil(desde: string, n: number): { fecha: string; fueraDeCalendario: boolean } {
  const d = utc(desde); let k = 0;
  while (k < n) { d.setUTCDate(d.getUTCDate() + 1); if (!esInhabil(isoDia(d))) k++; }
  const fecha = isoDia(d);
  return { fecha, fueraDeCalendario: !anosFestivos.includes(Number(fecha.slice(0, 4))) || !anosFestivos.includes(Number(desde.slice(0, 4))) };
}
/** Día 15 del mes siguiente (último día « antes del día 16 »). */
export const dia15Siguiente = (iso: string) => { const d = utc(iso); return isoDia(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 15))); };

/* ------------------------------------------------------------ Verifactu */
export type Tipo = 'sociedad' | 'autonomo' | 'atribucion' | 'irnr' | 'exenta';
export type Territorio = 'comun' | 'paisvasco' | 'navarra';
export type EstadoVf = 'obligado' | 'excluido-sii' | 'foral' | 'exenta' | 'sin-programa';
export interface EntradaVf { tipo: Tipo; territorio: Territorio; sii: boolean; programa: boolean }
export interface SalidaVf { estado: EstadoVf; antesDe: string | null; ultimoDia: string | null; grupo: 'is' | 'resto' | null }
export function verifactu(e: EntradaVf): SalidaVf {
  const grupo = e.tipo === 'sociedad' ? 'is' : e.tipo === 'exenta' ? null : 'resto';
  if (e.territorio !== 'comun') return { estado: 'foral', antesDe: null, ultimoDia: null, grupo };
  if (e.tipo === 'exenta') return { estado: 'exenta', antesDe: null, ultimoDia: null, grupo: null };
  if (e.sii) return { estado: 'excluido-sii', antesDe: null, ultimoDia: null, grupo };
  if (!e.programa) return { estado: 'sin-programa', antesDe: null, ultimoDia: null, grupo };
  const antesDe = grupo === 'is' ? V.sociedadesAntes : V.restoAntes;
  return { estado: 'obligado', antesDe, ultimoDia: vispera(antesDe), grupo };
}
/** Días que faltan hasta una fecha, desde la fecha de referencia (hoy en el navegador, la fecha de lectura en el build). */
export const diasHasta = (iso: string, hoy: string) => Math.round((utc(iso).getTime() - utc(hoy).getTime()) / 86400000);

/* ------------------------------------------------------------ factura electrónica B2B */
export type Persona = 'juridica' | 'fisica';
export type Destino = 'empresa' | 'particular' | 'extranjero' | 'administracion';
export interface EntradaB2b { volumen: number; persona: Persona; destino: Destino }
export interface SalidaB2b { aplica: boolean; grande: boolean; desde: string | null; pdfHasta: string | null; estadosDesde: string | null }
export function b2b(e: EntradaB2b): SalidaB2b {
  const grande = e.volumen > B.umbral;
  if (e.destino !== 'empresa') return { aplica: false, grande, desde: null, pdfHasta: null, estadosDesde: null };
  const desde = grande ? B.fechaGrandes : B.fechaResto;
  const pdfHasta = grande ? sumarMeses(B.fechaGrandes, B.pdfMeses) : null;
  const estadosDesde = !grande && e.persona === 'fisica' ? B.estadosVoluntariosHasta : desde;
  return { aplica: true, grande, desde, pdfHasta, estadosDesde };
}

/* ------------------------------------------------------------ sanciones (LGT art. 201 bis) */
export type Rol = 'usuario' | 'fabricante';
export type Motivo = 'alteracion' | 'certificado';
export interface EntradaSancion { rol: Rol; motivo: Motivo; ejercicios: number; tipos: number; sistemas: number; pronto: boolean }
export function sancion(e: EntradaSancion): { base: number; reduccion: number; total: number; unidad: number; veces: number } {
  const ej = Math.max(1, Math.round(e.ejercicios));
  let unidad: number, veces: number;
  if (e.rol === 'usuario') { unidad = S.tenencia; veces = ej; }
  else if (e.motivo === 'certificado') { unidad = S.sinCertificado; veces = Math.max(1, Math.round(e.sistemas)); }
  else { unidad = S.fabricante; veces = ej * Math.max(1, Math.round(e.tipos)); }
  const base = unidad * veces;
  const reduccion = e.pronto ? Math.round(base * S.reduccionPronto) : 0;
  return { base, reduccion, total: base - reduccion, unidad, veces };
}

/* ------------------------------------------------------------ SII (RIVA art. 69 bis) */
export type ClaseSii = 'expedida' | 'tercero' | 'recibida' | 'rectificativa';
export function plazoSii(clase: ClaseSii, fecha: string, devengo: string): { dias: number; porDias: string; tope: string | null; limite: string; fuera: boolean } {
  const dias = clase === 'tercero' ? P.sii.diasTercero : P.sii.diasExpedidas;
  const p = plazoHabil(fecha, dias);
  const tope = clase === 'expedida' || clase === 'tercero' ? dia15Siguiente(devengo) : clase === 'recibida' ? dia15Siguiente(fecha) : null;
  const limite = tope && tope < p.fecha ? tope : p.fecha;
  return { dias, porDias: p.fecha, tope, limite, fuera: p.fueraDeCalendario };
}

/* ------------------------------------------------------------ factura simplificada (RD 1619/2012 art. 4) */
export type Sector = 'general' | 'listado';
export function simplificada(importe: number, sector: Sector, rectificativa: boolean): { permitida: boolean; limite: number } {
  const limite = sector === 'listado' ? P.simplificada.sectores : P.simplificada.general;
  return { permitida: rectificativa || importe <= limite, limite };
}

/* ------------------------------------------------------------ factura rectificativa */
export type Causa = 'error' | 'art80-1-2-6' | 'concurso' | 'impago' | 'otra';
export function tipoRectificativa(causa: Causa, sobreSimplificada: boolean): string {
  if (sobreSimplificada) return 'R5';
  return causa === 'art80-1-2-6' ? 'R1' : causa === 'concurso' ? 'R2' : causa === 'impago' ? 'R3' : 'R4';
}
/** Plazo máximo para rectificar: cuatro años desde el devengo (RD 1619/2012 art. 15.1). */
export const limiteRectificar = (devengo: string) => sumarMeses(devengo, 12 * P.factura.rectificativaAnos);

/* ------------------------------------------------------------ FACe (Ley 25/2013 art. 4) */
export type Forma = 'sa-sl' | 'extranjera' | 'ute' | 'autonomo' | 'otra';
export function face(forma: Forma, importe: number, excluyeMenores: boolean): 'obligado' | 'exento-importe' | 'voluntario' {
  if (forma === 'autonomo' || forma === 'otra') return 'voluntario';
  if (excluyeMenores && importe <= P.factura.faceExclusion) return 'exento-importe';
  return 'obligado';
}
