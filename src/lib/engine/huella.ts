/**
 * Huella (hash) de los registros de facturación: Orden HAC/1177/2024, artículo 13, y documento de la AEAT
 * « Algoritmo de cálculo de codificación de la huella o hash », versión 0.1.2 (27/08/2024).
 * Cadena = campo=valor unidos por &, valores sin espacios al inicio ni al final, UTF-8, SHA-256 en hexadecimal mayúsculas.
 */
import { sha256Hex } from './sha256';

export interface Alta { nif: string; numSerie: string; fecha: string; tipo: string; cuota: string; importe: string; anterior: string; fechaHora: string }
export interface Anulacion { nif: string; numSerie: string; fecha: string; anterior: string; fechaHora: string }

const v = (x: string) => (x ?? '').trim();
export function cadenaAlta(a: Alta): string {
  return `IDEmisorFactura=${v(a.nif)}&NumSerieFactura=${v(a.numSerie)}&FechaExpedicionFactura=${v(a.fecha)}&TipoFactura=${v(a.tipo)}&CuotaTotal=${v(a.cuota)}&ImporteTotal=${v(a.importe)}&Huella=${v(a.anterior)}&FechaHoraHusoGenRegistro=${v(a.fechaHora)}`;
}
export function cadenaAnulacion(a: Anulacion): string {
  return `IDEmisorFacturaAnulada=${v(a.nif)}&NumSerieFacturaAnulada=${v(a.numSerie)}&FechaExpedicionFacturaAnulada=${v(a.fecha)}&Huella=${v(a.anterior)}&FechaHoraHusoGenRegistro=${v(a.fechaHora)}`;
}
export const huellaAlta = (a: Alta) => sha256Hex(cadenaAlta(a));
export const huellaAnulacion = (a: Anulacion) => sha256Hex(cadenaAnulacion(a));

/** Los tres ejemplos del documento de la AEAT (alta, alta encadenada, anulación). */
export const EJEMPLO_1: Alta = { nif: '89890001K', numSerie: '12345678/G33', fecha: '01-01-2024', tipo: 'F1', cuota: '12.35', importe: '123.45', anterior: '', fechaHora: '2024-01-01T19:20:30+01:00' };
export const EJEMPLO_2: Alta = { nif: '89890001K', numSerie: '12345679/G34', fecha: '01-01-2024', tipo: 'F1', cuota: '12.35', importe: '123.45', anterior: '3C464DAF61ACB827C65FDA19F352A4E3BDC2C640E9E9FC4CC058073F38F12F60', fechaHora: '2024-01-01T19:20:35+01:00' };
export const EJEMPLO_3: Anulacion = { nif: '89890001K', numSerie: '12345679/G34', fecha: '01-01-2024', anterior: 'F7B94CFD8924EDFF273501B01EE5153E4CE8F259766F88CF6ACB8935802A2B97', fechaHora: '2024-01-01T19:20:40+01:00' };
