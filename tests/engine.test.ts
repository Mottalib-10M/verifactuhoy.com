/**
 * Motores: huella (vectores oficiales de la AEAT), URL del QR (ejemplo oficial), reglas de fechas e importes
 * (textos del BOE leídos el 2026-10-25) y Facturae (ida y vuelta creador → visor, validación XSD si está en caché).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import P from '../src/data/params-2026.json';
import { sha256Hex } from '../src/lib/engine/sha256';
import { huellaAlta, huellaAnulacion, cadenaAlta, EJEMPLO_1, EJEMPLO_2, EJEMPLO_3 } from '../src/lib/engine/huella';
import { construirUrl, leerUrl, letraDni, validarDatos, clasificar } from '../src/lib/engine/qr';
import * as R from '../src/lib/engine/reglas';
import { calcular, comprobar, construirXml, leerXml, EJEMPLO, ErrorLectura } from '../src/lib/engine/facturae';
import { SPECS, runTool } from '../src/lib/tool-specs';

describe('huella SHA-256 (AEAT, documento 0.1.2)', () => {
  it('SHA-256 de referencia', () => {
    expect(sha256Hex('abc')).toBe('BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD');
    expect(sha256Hex('')).toBe('E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855');
    expect(sha256Hex('ñ€')).toBe(sha256Hex('ñ€'));
  });
  it('los tres ejemplos oficiales', () => {
    expect(huellaAlta(EJEMPLO_1)).toBe(P.huella.vector1);
    expect(huellaAlta(EJEMPLO_2)).toBe(P.huella.vector2);
    expect(huellaAnulacion(EJEMPLO_3)).toBe(P.huella.vector3);
  });
  it('la cadena sigue el orden campo=valor de la AEAT', () => {
    expect(cadenaAlta(EJEMPLO_1)).toBe('IDEmisorFactura=89890001K&NumSerieFactura=12345678/G33&FechaExpedicionFactura=01-01-2024&TipoFactura=F1&CuotaTotal=12.35&ImporteTotal=123.45&Huella=&FechaHoraHusoGenRegistro=2024-01-01T19:20:30+01:00');
  });
  it('un céntimo cambia la huella', () => { expect(huellaAlta({ ...EJEMPLO_1, importe: '123.46' })).not.toBe(P.huella.vector1); });
});

describe('URL del QR tributario (AEAT 0.5.0)', () => {
  const d = { nif: '89890001K', numserie: '12345678&G33', fecha: '01-01-2024', importe: '241.4' };
  it('ejemplo oficial, entorno de pruebas', () => {
    expect(construirUrl(d, 'verifactu', 'pruebas')).toBe('https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR?nif=89890001K&numserie=12345678%26G33&fecha=01-01-2024&importe=241.4');
  });
  it('ida y vuelta', () => {
    for (const m of ['verifactu', 'noverifactu'] as const) for (const e of ['produccion', 'pruebas'] as const) {
      const r = leerUrl(construirUrl(d, m, e))!;
      expect(r).not.toBeNull();
      expect([r.nif, r.numserie, r.fecha, r.importe, r.modalidad, r.entorno]).toEqual([d.nif, d.numserie, d.fecha, d.importe, m, e]);
      expect(r.errores).toEqual([]);
    }
  });
  it('formatos', () => {
    expect(validarDatos({ ...d, fecha: '31-02-2026' }).errores).toContain('fecha');
    expect(validarDatos({ ...d, importe: '10,50' }).errores).toContain('importe');
    expect(validarDatos({ ...d, importe: '1234567890123' }).errores).toContain('importe');
    expect(validarDatos({ ...d, numserie: 'x'.repeat(61) }).errores).toContain('numserie');
    expect(validarDatos({ ...d, nif: '1234' }).errores).toContain('nif');
  });
  it('letra del DNI y del NIE', () => {
    expect(letraDni('12345678Z')).toBe('ok');
    expect(letraDni('12345678A')).toBe('mal');
    expect(letraDni('X1234567L')).toBe('ok');
    expect(letraDni('B00000000')).toBe('no-aplica');
  });
  it('clasifica otros QR', () => {
    expect(clasificar('https://example.org/x')).toBe('url');
    expect(clasificar('hola')).toBe('texto');
  });
});

describe('reglas', () => {
  it('Verifactu: fechas de la DF 4.ª del RD 1007/2023 (RDL 15/2025)', () => {
    expect(R.verifactu({ tipo: 'sociedad', territorio: 'comun', sii: false, programa: true })).toMatchObject({ estado: 'obligado', antesDe: '2027-01-01', ultimoDia: '2026-12-31' });
    expect(R.verifactu({ tipo: 'autonomo', territorio: 'comun', sii: false, programa: true })).toMatchObject({ estado: 'obligado', antesDe: '2027-07-01', ultimoDia: '2027-06-30' });
    expect(R.verifactu({ tipo: 'sociedad', territorio: 'comun', sii: true, programa: true }).estado).toBe('excluido-sii');
    expect(R.verifactu({ tipo: 'autonomo', territorio: 'paisvasco', sii: false, programa: true }).estado).toBe('foral');
    expect(R.verifactu({ tipo: 'autonomo', territorio: 'comun', sii: false, programa: false }).estado).toBe('sin-programa');
    expect(R.verifactu({ tipo: 'exenta', territorio: 'comun', sii: false, programa: true }).estado).toBe('exenta');
  });
  it('productores: nueve meses desde la entrada en vigor de la Orden HAC/1177/2024', () => {
    expect(R.sumarMeses(P.verifactu.ordenVigor, P.verifactu.productoresMeses)).toBe(P.verifactu.productoresDesde);
  });
  it('B2B: 12 y 24 meses desde la Orden HAC/1028/2026', () => {
    expect(R.sumarMeses(P.b2b.ordenVigor, P.b2b.mesesGrandes)).toBe(P.b2b.fechaGrandes);
    expect(R.sumarMeses(P.b2b.ordenVigor, P.b2b.mesesResto)).toBe(P.b2b.fechaResto);
    expect(R.b2b({ volumen: 9e6, persona: 'juridica', destino: 'empresa' })).toMatchObject({ aplica: true, grande: true, desde: '2027-10-06', pdfHasta: '2028-10-06' });
    expect(R.b2b({ volumen: 8e6, persona: 'fisica', destino: 'empresa' })).toMatchObject({ grande: false, desde: '2028-10-06', estadosDesde: '2029-10-06' });
    expect(R.b2b({ volumen: 1e5, persona: 'juridica', destino: 'empresa' }).estadosDesde).toBe('2028-10-06');
    expect(R.b2b({ volumen: 1e5, persona: 'fisica', destino: 'particular' }).aplica).toBe(false);
  });
  it('plazos hábiles: sábados, domingos y festivos nacionales fuera', () => {
    expect(R.plazoHabil('2026-12-23', 4).fecha).toBe('2026-12-30');
    expect(R.plazoHabil('2026-10-09', 4).fecha).toBe('2026-10-16');
    expect(R.plazoHabil('2027-03-24', 4).fecha).toBe('2027-03-31');
    expect(R.plazoHabil('2030-01-02', 4).fueraDeCalendario).toBe(true);
  });
  it('SII: 4 días hábiles con tope el día 15 del mes siguiente', () => {
    const r = R.plazoSii('expedida', '2026-12-28', '2026-12-28');
    expect(r.porDias).toBe('2027-01-04');
    expect(r.limite).toBe('2027-01-04');
    expect(R.plazoSii('expedida', '2027-01-29', '2026-12-10').limite).toBe('2027-01-15');
    expect(R.plazoSii('tercero', '2026-10-01', '2026-10-01').dias).toBe(8);
  });
  it('sanciones del art. 201 bis LGT', () => {
    expect(R.sancion({ rol: 'usuario', motivo: 'alteracion', ejercicios: 2, tipos: 1, sistemas: 1, pronto: false }).total).toBe(100000);
    expect(R.sancion({ rol: 'usuario', motivo: 'alteracion', ejercicios: 2, tipos: 1, sistemas: 1, pronto: true }).total).toBe(60000);
    expect(R.sancion({ rol: 'fabricante', motivo: 'alteracion', ejercicios: 1, tipos: 3, sistemas: 1, pronto: false }).total).toBe(450000);
    expect(R.sancion({ rol: 'fabricante', motivo: 'certificado', ejercicios: 1, tipos: 1, sistemas: 10, pronto: false }).total).toBe(10000);
  });
  it('factura simplificada, rectificativa y FACe', () => {
    expect(R.simplificada(400, 'general', false).permitida).toBe(true);
    expect(R.simplificada(400.01, 'general', false).permitida).toBe(false);
    expect(R.simplificada(2999, 'listado', false).permitida).toBe(true);
    expect(R.tipoRectificativa('art80-1-2-6', false)).toBe('R1');
    expect(R.tipoRectificativa('error', false)).toBe('R4');
    expect(R.tipoRectificativa('concurso', false)).toBe('R2');
    expect(R.tipoRectificativa('impago', false)).toBe('R3');
    expect(R.tipoRectificativa('otra', false)).toBe('R4');
    expect(R.tipoRectificativa('error', true)).toBe('R5');
    expect(R.limiteRectificar('2024-03-15')).toBe('2028-03-15');
    expect(R.face('sa-sl', 3000, true)).toBe('exento-importe');
    expect(R.face('sa-sl', 5000.01, true)).toBe('obligado');
    expect(R.face('autonomo', 9000, true)).toBe('voluntario');
  });
});

describe('simuladores', () => {
  it('cada simulador corre con sus valores por defecto, en las dos lenguas', () => {
    for (const k of Object.keys(SPECS)) for (const l of ['es', 'en'] as const) {
      const o = runTool(k, l);
      expect(o.label, k).toBeTruthy();
      expect(JSON.stringify(o), k).not.toMatch(/undefined|NaN|Infinity/);
    }
  });
});

describe('Facturae 3.2.2', () => {
  it('totales con IVA y retención', () => {
    const t = calcular(EJEMPLO);
    expect(t.bruto).toBe(1060);
    expect(t.iva).toBe(222.6);
    expect(t.retencion).toBe(159);
    expect(t.total).toBe(1123.6);
    expect(comprobar(EJEMPLO)).toEqual([]);
  });
  it('ida y vuelta creador → visor', () => {
    const r = leerXml(construirXml(EJEMPLO));
    expect(r.version).toBe('3.2.2');
    expect(r.numero).toBe(EJEMPLO.numero);
    expect(r.emisor.nif).toBe(EJEMPLO.emisor.nif);
    expect(r.lineas).toHaveLength(2);
    expect(r.totales.aPagar).toBe(calcular(EJEMPLO).total);
    expect(r.avisos).toEqual(['sinFirma']);
  });
  it('rechaza lo que no es Facturae', () => {
    expect(() => leerXml('<a><b/></a>')).toThrow(ErrorLectura);
    expect(() => leerXml('no es xml <')).toThrow(ErrorLectura);
  });
  const XSD = '.cache-raw/xsd/Facturaev3_2_2.xsd';
  it.skipIf(!existsSync(XSD))('valida contra el esquema oficial (scripts/valida-facturae.sh descarga el XSD)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fe-'));
    const casos = [EJEMPLO, { ...EJEMPLO, retencion: 0, iban: undefined, receptor: { ...EJEMPLO.receptor, nombre: 'Ayuntamiento de Ejemplo', nif: 'P0000000J' }, centros: { oficinaContable: 'L01000000', organoGestor: 'L01000000', unidadTramitadora: 'L01000000' }, lineas: [...EJEMPLO.lineas, { descripcion: 'Libros', cantidad: 3, precio: 12.5, iva: 4 }] }];
    casos.forEach((f, i) => {
      const file = join(dir, `f${i}.xml`); writeFileSync(file, construirXml(f as typeof EJEMPLO));
      expect(() => execFileSync('xmllint', ['--noout', '--nonet', '--schema', XSD, file], { stdio: 'pipe' })).not.toThrow();
    });
  });
});
