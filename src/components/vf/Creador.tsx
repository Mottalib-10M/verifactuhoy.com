/**
 * Creador de facturas Facturae 3.2.2 en el navegador: formulario → XML conforme al esquema oficial (sin firma) y vista
 * imprimible. Con « Administración » añade los tres códigos DIR3 que exige FACe. Nada se guarda ni se envía.
 * La descarga queda bloqueada mientras falte un dato que el esquema o FACe rechazarían.
 */
import { useMemo, useRef, useState } from 'react';
import SelectField from '../ui/SelectField';
import { Choice, ResultCard, Rows } from '../calc/parts';
import { Field, DateField, Group } from '../ui/Fields';
import FacturaView from './FacturaView';
import { calcular, comprobar, construirXml, leerXml, EJEMPLO, type Factura, type Parte, type Linea } from '../../lib/engine/facturae';
import { download, printNode, safeName } from '../../lib/vf-client';
import { formatMoney, parseLocaleNumber, type Lang } from '../../lib/format';

const L = {
  es: {
    dest: 'Destinatario', emp: 'Empresa o autónomo', adm: 'Administración (FACe)', tipoE: 'Emites como', fis: 'Autónomo', jur: 'Sociedad', tipoR: 'El cliente es',
    gE: 'Tus datos', gR: 'Datos del cliente', gF: 'Factura', gL: 'Conceptos', gD: 'Códigos DIR3 de la Administración',
    nif: 'NIF', nombre: 'Nombre', razon: 'Razón social', ap1: 'Primer apellido', ap2: 'Segundo apellido', dir: 'Dirección', cp: 'Código postal', mun: 'Municipio', prov: 'Provincia',
    serie: 'Serie', numero: 'Número', fecha: 'Fecha de expedición', venc: 'Vencimiento', iban: 'IBAN para el cobro', ret: 'Retención de IRPF',
    oc: 'Oficina contable', og: 'Órgano gestor', ut: 'Unidad tramitadora',
    desc: 'Descripción', cant: 'Cantidad', precio: 'Precio sin IVA', iva: 'IVA', mas: 'Añadir concepto', quitar: 'Quitar',
    label: 'Total de la factura', base: 'Base imponible', cuotas: 'IVA', retR: 'Retención', listo: 'Lista para descargar', faltan: (n: number) => `${n} ${n === 1 ? 'dato por completar' : 'datos por completar'}`,
    bajar: 'Descargar Facturae 3.2.2 (XML sin firmar)', imprimir: 'Imprimir o guardar en PDF', limpiar: 'Vaciar el formulario', ejemplo: 'Volver al ejemplo',
    firma: 'Antes de enviarla a FACe, firma el XML con tu certificado en una aplicación de firma: este creador no firma.', privat: 'Tus datos se quedan en esta ventana: no se guardan ni se envían.',
    aviso: 'Desde que Verifactu te obligue, tus facturas deben salir de un sistema que genere su registro y su QR: este creador sirve para facturar a la Administración en Facturae y para conocer el formato, no sustituye a ese sistema.',
    err: { 'emisor.nif': 'tu NIF', 'emisor.nifFormato': 'tu NIF (formato)', 'emisor.nombre': 'tu nombre', 'emisor.apellido1': 'tu apellido', 'emisor.direccion': 'tu dirección', 'emisor.cp': 'tu código postal', 'emisor.municipio': 'tu municipio', 'emisor.provincia': 'tu provincia', 'receptor.nif': 'NIF del cliente', 'receptor.nifFormato': 'NIF del cliente (formato)', 'receptor.nombre': 'nombre del cliente', 'receptor.apellido1': 'apellido del cliente', 'receptor.direccion': 'dirección del cliente', 'receptor.cp': 'código postal del cliente', 'receptor.municipio': 'municipio del cliente', 'receptor.provincia': 'provincia del cliente', numero: 'número de factura', serie: 'serie (máx. 20)', fecha: 'fecha', lineas: 'conceptos', dir3: 'códigos DIR3', iban: 'IBAN' } as Record<string, string>,
  },
  en: {
    dest: 'Recipient', emp: 'Business or self-employed', adm: 'Public body (FACe)', tipoE: 'You invoice as', fis: 'Self-employed', jur: 'Company', tipoR: 'The customer is',
    gE: 'Your details', gR: 'Customer details', gF: 'Invoice', gL: 'Items', gD: 'Public body DIR3 codes',
    nif: 'Tax ID (NIF)', nombre: 'First name', razon: 'Company name', ap1: 'First surname', ap2: 'Second surname', dir: 'Address', cp: 'Postcode', mun: 'Town', prov: 'Province',
    serie: 'Series', numero: 'Number', fecha: 'Issue date', venc: 'Due date', iban: 'IBAN for payment', ret: 'Income tax withholding (IRPF)',
    oc: 'Accounting office', og: 'Managing body', ut: 'Processing unit',
    desc: 'Description', cant: 'Quantity', precio: 'Price excl. VAT', iva: 'VAT', mas: 'Add an item', quitar: 'Remove',
    label: 'Invoice total', base: 'Taxable base', cuotas: 'VAT', retR: 'Withholding', listo: 'Ready to download', faltan: (n: number) => `${n} ${n === 1 ? 'field to complete' : 'fields to complete'}`,
    bajar: 'Download Facturae 3.2.2 (unsigned XML)', imprimir: 'Print or save as PDF', limpiar: 'Clear the form', ejemplo: 'Back to the sample',
    firma: 'Before sending it to FACe, sign the XML with your certificate in a signing application: this creator does not sign.', privat: 'Your data stays in this window: nothing is stored or sent.',
    aviso: 'Once Verifactu applies to you, your invoices must come from a system that creates their record and QR: this creator is for invoicing public bodies in Facturae and for learning the format, it does not replace that system.',
    err: { 'emisor.nif': 'your tax ID', 'emisor.nifFormato': 'your tax ID (format)', 'emisor.nombre': 'your name', 'emisor.apellido1': 'your surname', 'emisor.direccion': 'your address', 'emisor.cp': 'your postcode', 'emisor.municipio': 'your town', 'emisor.provincia': 'your province', 'receptor.nif': 'customer tax ID', 'receptor.nifFormato': 'customer tax ID (format)', 'receptor.nombre': 'customer name', 'receptor.apellido1': 'customer surname', 'receptor.direccion': 'customer address', 'receptor.cp': 'customer postcode', 'receptor.municipio': 'customer town', 'receptor.provincia': 'customer province', numero: 'invoice number', serie: 'series (max 20)', fecha: 'date', lineas: 'items', dir3: 'DIR3 codes', iban: 'IBAN' } as Record<string, string>,
  },
};
interface Pos { descripcion: string; cantidad: string; precio: string; iva: string }
const vacia: Parte = { tipo: 'J', nif: '', residencia: 'R', nombre: '', apellido1: '', apellido2: '', direccion: '', cp: '', municipio: '', provincia: '', pais: 'ESP' };
const aPos = (l: Linea): Pos => ({ descripcion: l.descripcion, cantidad: String(l.cantidad), precio: String(l.precio).replace('.', ','), iva: String(l.iva) });

export default function Creador({ lang, preset = 'empresa', idPrefix = 'cr' }: { lang: Lang; preset?: string; idPrefix?: string }) {
  const t = L[lang];
  const [dest, setDest] = useState<'empresa' | 'admin'>(preset === 'admin' ? 'admin' : 'empresa');
  const [em, setEm] = useState<Parte>(EJEMPLO.emisor);
  const [re, setRe] = useState<Parte>(preset === 'admin' ? { ...EJEMPLO.receptor, nombre: 'Ayuntamiento de Ejemplo', nif: 'P0000000J' } : EJEMPLO.receptor);
  const [cab, setCab] = useState({ serie: EJEMPLO.serie, numero: EJEMPLO.numero, fecha: EJEMPLO.fecha, vencimiento: EJEMPLO.vencimiento ?? '', iban: EJEMPLO.iban ?? '', retencion: String(EJEMPLO.retencion) });
  const [dir3, setDir3] = useState({ oficinaContable: 'L01000000', organoGestor: 'L01000000', unidadTramitadora: 'L01000000' });
  const [pos, setPos] = useState<Pos[]>(EJEMPLO.lineas.map(aPos));
  const view = useRef<HTMLDivElement>(null);

  const factura: Factura = useMemo(() => ({
    serie: cab.serie.trim(), numero: cab.numero.trim(), fecha: cab.fecha, emisor: em, receptor: re, retencion: Number(cab.retencion) || 0,
    iban: cab.iban.trim() || undefined, vencimiento: cab.vencimiento || undefined, centros: dest === 'admin' ? dir3 : undefined,
    lineas: pos.map((p) => ({ descripcion: p.descripcion.trim(), cantidad: parseLocaleNumber(p.cantidad), precio: parseLocaleNumber(p.precio), iva: Number(p.iva) })),
  }), [cab, em, re, dir3, pos, dest]);
  const errores = useMemo(() => comprobar(factura), [factura]);
  const tot = useMemo(() => calcular(factura), [factura]);
  const xml = useMemo(() => (errores.length ? '' : construirXml(factura)), [factura, errores]);
  const leida = useMemo(() => (xml ? leerXml(xml) : null), [xml]);
  const eur = (x: number) => formatMoney(x, 2, lang);
  const bad = (k: string) => errores.includes(k);

  const parte = (p: Parte, set: (x: Parte) => void, k: 'emisor' | 'receptor') => {
    const u = (f: keyof Parte) => (x: string) => set({ ...p, [f]: f === 'nif' ? x.toUpperCase() : x });
    return (<>
      <div className="sm:col-span-2"><Choice id={`${idPrefix}-${k}-tipo`} label={k === 'emisor' ? t.tipoE : t.tipoR} value={p.tipo} onChange={(x) => set({ ...p, tipo: x })} options={[{ value: 'F', label: t.fis }, { value: 'J', label: t.jur }]} /></div>
      <Field id={`${idPrefix}-${k}-nif`} label={t.nif} value={p.nif} onChange={u('nif')} bad={bad(`${k}.nif`) || bad(`${k}.nifFormato`)} mono />
      <Field id={`${idPrefix}-${k}-nombre`} label={p.tipo === 'J' ? t.razon : t.nombre} value={p.nombre} onChange={u('nombre')} bad={bad(`${k}.nombre`)} />
      {p.tipo === 'F' && <Field id={`${idPrefix}-${k}-ap1`} label={t.ap1} value={p.apellido1 ?? ''} onChange={u('apellido1')} bad={bad(`${k}.apellido1`)} />}
      {p.tipo === 'F' && <Field id={`${idPrefix}-${k}-ap2`} label={t.ap2} value={p.apellido2 ?? ''} onChange={u('apellido2')} />}
      <Field id={`${idPrefix}-${k}-dir`} label={t.dir} value={p.direccion} onChange={u('direccion')} bad={bad(`${k}.direccion`)} wide />
      <Field id={`${idPrefix}-${k}-cp`} label={t.cp} value={p.cp} onChange={u('cp')} bad={bad(`${k}.cp`)} mode="numeric" />
      <Field id={`${idPrefix}-${k}-mun`} label={t.mun} value={p.municipio} onChange={u('municipio')} bad={bad(`${k}.municipio`)} />
      <Field id={`${idPrefix}-${k}-prov`} label={t.prov} value={p.provincia} onChange={u('provincia')} bad={bad(`${k}.provincia`)} />
    </>);
  };

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid min-w-0 content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          <Choice id={`${idPrefix}-dest`} label={t.dest} value={dest} onChange={setDest} options={[{ value: 'empresa', label: t.emp }, { value: 'admin', label: t.adm }]} />
          <Group title={t.gE}>{parte(em, setEm, 'emisor')}</Group>
          <Group title={t.gR}>{parte(re, setRe, 'receptor')}</Group>
          {dest === 'admin' && <Group title={t.gD}>
            <Field id={`${idPrefix}-oc`} label={t.oc} value={dir3.oficinaContable} onChange={(x) => setDir3({ ...dir3, oficinaContable: x.toUpperCase() })} bad={bad('dir3')} mono />
            <Field id={`${idPrefix}-og`} label={t.og} value={dir3.organoGestor} onChange={(x) => setDir3({ ...dir3, organoGestor: x.toUpperCase() })} bad={bad('dir3')} mono />
            <Field id={`${idPrefix}-ut`} label={t.ut} value={dir3.unidadTramitadora} onChange={(x) => setDir3({ ...dir3, unidadTramitadora: x.toUpperCase() })} bad={bad('dir3')} mono />
          </Group>}
          <Group title={t.gF}>
            <Field id={`${idPrefix}-serie`} label={t.serie} value={cab.serie} onChange={(x) => setCab({ ...cab, serie: x })} bad={bad('serie')} />
            <Field id={`${idPrefix}-num`} label={t.numero} value={cab.numero} onChange={(x) => setCab({ ...cab, numero: x })} bad={bad('numero')} />
            <DateField id={`${idPrefix}-fecha`} label={t.fecha} value={cab.fecha} onChange={(x) => setCab({ ...cab, fecha: x })} bad={bad('fecha')} />
            <DateField id={`${idPrefix}-venc`} label={t.venc} value={cab.vencimiento} onChange={(x) => setCab({ ...cab, vencimiento: x })} />
            <Field id={`${idPrefix}-iban`} label={t.iban} value={cab.iban} onChange={(x) => setCab({ ...cab, iban: x.toUpperCase() })} bad={bad('iban')} mono />
            <SelectField id={`${idPrefix}-ret`} label={t.ret} value={cab.retencion} onChange={(x) => setCab({ ...cab, retencion: x })} options={['0', '1', '2', '7', '15', '19'].map((x) => ({ value: x, label: `${x}${lang === 'es' ? ' %' : '%'}` }))} />
          </Group>
          <fieldset className="min-w-0 rounded-lg border border-navy-200 p-3 sm:p-4">
            <legend className="px-1 text-sm font-semibold text-navy-900">{t.gL}</legend>
            {pos.map((p, i) => (
              <div key={i} className="mb-3 grid items-end gap-3 border-b border-navy-100 pb-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
                <Field id={`${idPrefix}-d${i}`} label={t.desc} value={p.descripcion} onChange={(x) => setPos(pos.map((q, j) => (j === i ? { ...q, descripcion: x } : q)))} bad={bad('lineas') && !p.descripcion.trim()} />
                <Field id={`${idPrefix}-c${i}`} label={t.cant} value={p.cantidad} onChange={(x) => setPos(pos.map((q, j) => (j === i ? { ...q, cantidad: x } : q)))} mode="decimal" />
                <Field id={`${idPrefix}-p${i}`} label={t.precio} value={p.precio} onChange={(x) => setPos(pos.map((q, j) => (j === i ? { ...q, precio: x } : q)))} mode="decimal" />
                <SelectField id={`${idPrefix}-i${i}`} label={t.iva} value={p.iva} onChange={(x) => setPos(pos.map((q, j) => (j === i ? { ...q, iva: x } : q)))} options={['21', '10', '4', '0'].map((x) => ({ value: x, label: `${x}${lang === 'es' ? ' %' : '%'}` }))} />
                {pos.length > 1 && <button type="button" className="justify-self-start text-xs text-navy-600 underline sm:col-span-4" onClick={() => setPos(pos.filter((_, j) => j !== i))}>{t.quitar}</button>}
              </div>
            ))}
            {pos.length < 20 && <button type="button" className="text-sm font-medium text-accent-700 underline" onClick={() => setPos([...pos, { descripcion: '', cantidad: '1', precio: '0', iva: '21' }])}>{t.mas}</button>}
          </fieldset>
          <p className="text-xs text-navy-600">{t.privat}</p>
        </form>
        <div className="lg:sticky lg:top-4 lg:self-start">
          <ResultCard label={t.label} value={eur(tot.total)} sub={errores.length ? `${t.faltan(errores.length)}: ${errores.map((e) => t.err[e] ?? e).join(', ')}` : t.listo}>
            <Rows rows={[[t.base, eur(tot.bruto)], ...tot.impuestos.map((x) => [`${t.cuotas} ${x.tipo}${lang === 'es' ? ' %' : '%'}`, eur(x.cuota)] as [string, string]), ...(tot.retencion ? [[t.retR, `− ${eur(tot.retencion)}`] as [string, string]] : [])]} />
            <div className="mt-3 grid gap-2">
              <button type="button" disabled={!xml} onClick={() => download(xml, safeName(`facturae-${cab.serie}${cab.numero}.xml`, 'facturae.xml'), 'application/xml')} className="h-12 rounded-lg bg-accent-700 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-navy-300">{t.bajar}</button>
              {leida && <button type="button" className="text-sm font-medium text-accent-700 underline" onClick={() => view.current && printNode(view.current, `${cab.serie}${cab.numero}`)}>{t.imprimir}</button>}
              <p className="flex flex-wrap gap-x-4 text-xs"><button type="button" className="text-navy-600 underline" onClick={() => { setEm({ ...vacia, tipo: 'F' }); setRe(vacia); setCab({ serie: '', numero: '', fecha: cab.fecha, vencimiento: '', iban: '', retencion: '0' }); setPos([{ descripcion: '', cantidad: '1', precio: '0', iva: '21' }]); }}>{t.limpiar}</button><button type="button" className="text-navy-600 underline" onClick={() => { setEm(EJEMPLO.emisor); setRe(EJEMPLO.receptor); setPos(EJEMPLO.lineas.map(aPos)); setCab({ serie: EJEMPLO.serie, numero: EJEMPLO.numero, fecha: EJEMPLO.fecha, vencimiento: EJEMPLO.vencimiento ?? '', iban: EJEMPLO.iban ?? '', retencion: String(EJEMPLO.retencion) }); }}>{t.ejemplo}</button></p>
            </div>
            <p className="mt-3 text-xs text-navy-600">{t.firma}</p>
          </ResultCard>
          <p className="mt-3 text-xs text-navy-600">{t.aviso}</p>
        </div>
      </div>
      {leida && <div className="mt-5"><FacturaView ref={view} f={leida} lang={lang} /></div>}
    </div>
  );
}
