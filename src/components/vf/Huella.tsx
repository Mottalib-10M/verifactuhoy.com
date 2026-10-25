/**
 * Calculadora de la huella (hash) de un registro de alta o de anulación, con el algoritmo de la AEAT (SHA-256 sobre la
 * cadena campo=valor). Precargada con los tres ejemplos oficiales; dice si el resultado coincide con el de la AEAT.
 */
import { useMemo, useState } from 'react';
import { Choice, ResultCard, Rows } from '../calc/parts';
import SelectField from '../ui/SelectField';
import { Field } from '../ui/Fields';
import { cadenaAlta, cadenaAnulacion, huellaAlta, huellaAnulacion, EJEMPLO_1, EJEMPLO_2, EJEMPLO_3, type Alta } from '../../lib/engine/huella';
import P from '../../data/params-2026.json';
import type { Lang } from '../../lib/format';

const L = {
  es: {
    tipo: 'Registro', alta: 'Alta', anul: 'Anulación', ej: 'Cargar un ejemplo de la AEAT', e1: 'Ejemplo 1: primer registro', e2: 'Ejemplo 2: registro encadenado', e3: 'Ejemplo 3: anulación', libre: 'Mis datos',
    nif: 'NIF del emisor', num: 'Serie y número', fecha: 'Fecha de expedición (DD-MM-AAAA)', tf: 'Tipo de factura', cuota: 'Cuota total', imp: 'Importe total', ant: 'Huella del registro anterior (vacía si es el primero)', fh: 'Fecha, hora y huso del registro',
    label: 'Huella SHA-256', coincide: 'Coincide con el resultado publicado por la AEAT', cadena: 'Cadena que se resume', largo: 'Longitud', car: 'caracteres hexadecimales',
    nota: 'Los valores se toman tal cual, sin espacios al principio ni al final. Un solo carácter distinto cambia toda la huella.',
  },
  en: {
    tipo: 'Record', alta: 'Registration', anul: 'Cancellation', ej: 'Load an AEAT example', e1: 'Example 1: first record', e2: 'Example 2: chained record', e3: 'Example 3: cancellation', libre: 'My data',
    nif: 'Issuer tax ID', num: 'Series and number', fecha: 'Issue date (DD-MM-YYYY)', tf: 'Invoice type', cuota: 'Total VAT', imp: 'Total amount', ant: 'Previous record hash (empty for the first)', fh: 'Record date, time and offset',
    label: 'SHA-256 hash', coincide: 'Matches the result published by the AEAT', cadena: 'String that is hashed', largo: 'Length', car: 'hex characters',
    nota: 'Values are taken as they are, trimmed at both ends. A single different character changes the whole hash.',
  },
};
const OFICIAL = [P.huella.vector1, P.huella.vector2, P.huella.vector3];

export default function Huella({ lang, idPrefix = 'hu' }: { lang: Lang; idPrefix?: string }) {
  const t = L[lang];
  const [tipo, setTipo] = useState<'alta' | 'anul'>('alta');
  const [ej, setEj] = useState('1');
  const [a, setA] = useState<Alta>(EJEMPLO_1);
  const load = (k: string) => {
    setEj(k);
    if (k === '1') { setTipo('alta'); setA(EJEMPLO_1); }
    if (k === '2') { setTipo('alta'); setA(EJEMPLO_2); }
    if (k === '3') { setTipo('anul'); setA({ ...EJEMPLO_2, ...EJEMPLO_3 }); }
  };
  const set = (k: keyof Alta) => (x: string) => { setA((o) => ({ ...o, [k]: x })); setEj('0'); };
  const cadena = useMemo(() => (tipo === 'alta' ? cadenaAlta(a) : cadenaAnulacion(a)), [a, tipo]);
  const h = useMemo(() => (tipo === 'alta' ? huellaAlta(a) : huellaAnulacion(a)), [a, tipo]);
  const ok = OFICIAL.includes(h);

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid min-w-0 content-start gap-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-ej`} label={t.ej} value={ej} onChange={load} options={[{ value: '1', label: t.e1 }, { value: '2', label: t.e2 }, { value: '3', label: t.e3 }, ...(ej === '0' ? [{ value: '0', label: t.libre }] : [])]} />
          <Choice id={`${idPrefix}-tipo`} label={t.tipo} value={tipo} onChange={(x) => { setTipo(x); setEj('0'); }} options={[{ value: 'alta', label: t.alta }, { value: 'anul', label: t.anul }]} />
          <Field id={`${idPrefix}-nif`} label={t.nif} value={a.nif} onChange={set('nif')} mono />
          <Field id={`${idPrefix}-num`} label={t.num} value={a.numSerie} onChange={set('numSerie')} mono />
          <Field id={`${idPrefix}-fecha`} label={t.fecha} value={a.fecha} onChange={set('fecha')} mono />
          {tipo === 'alta' && <Field id={`${idPrefix}-tf`} label={t.tf} value={a.tipo} onChange={set('tipo')} mono />}
          {tipo === 'alta' && <Field id={`${idPrefix}-cuota`} label={t.cuota} value={a.cuota} onChange={set('cuota')} mono mode="decimal" />}
          {tipo === 'alta' && <Field id={`${idPrefix}-imp`} label={t.imp} value={a.importe} onChange={set('importe')} mono mode="decimal" />}
          <Field id={`${idPrefix}-fh`} label={t.fh} value={a.fechaHora} onChange={set('fechaHora')} mono />
          <Field id={`${idPrefix}-ant`} label={t.ant} value={a.anterior} onChange={set('anterior')} mono wide />
        </form>
        <ResultCard label={t.label} value={`${h.slice(0, 10)}…`} sub={ok ? t.coincide : undefined}>
          <p className="mt-2 break-all font-mono text-xs text-navy-900">{h}</p>
          <Rows rows={[[t.largo, `64 ${t.car}`]]} />
          <p className="mt-2 text-xs font-medium text-navy-700">{t.cadena}</p>
          <p className="break-all font-mono text-[11px] text-navy-700">{cadena}</p>
          <p className="mt-2 text-xs text-navy-600">{t.nota}</p>
        </ResultCard>
      </div>
    </div>
  );
}
