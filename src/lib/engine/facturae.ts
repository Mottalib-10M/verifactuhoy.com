/**
 * Facturae 3.2.2 (esquema oficial de facturae.gob.es, espacio de nombres Facturaev3_2_2.xml): creación y lectura en el navegador.
 * El fichero se genera SIN firma: la firma XAdES se añade con el certificado del emisor en la aplicación oficial
 * (Ley 25/2013, art. 5; política de firma de Facturae). Nada sale del equipo.
 */
import { DOMParser } from '@xmldom/xmldom';
import P from '../../data/params-2026.json';

export const NS = ['http:', '', P.facturae.namespace].join('/');
export interface Parte { tipo: 'J' | 'F'; nif: string; residencia: 'R' | 'E' | 'U'; nombre: string; apellido1?: string; apellido2?: string; direccion: string; cp: string; municipio: string; provincia: string; pais: string }
export interface Linea { descripcion: string; cantidad: number; precio: number; iva: number }
export interface Centros { oficinaContable: string; organoGestor: string; unidadTramitadora: string }
export interface Factura {
  serie: string; numero: string; fecha: string; emisor: Parte; receptor: Parte; lineas: Linea[];
  retencion: number; iban?: string; vencimiento?: string; centros?: Centros; descripcion?: string; idioma?: 'es' | 'en' | 'ca' | 'eu' | 'gl';
}
export interface Totales { bruto: number; impuestos: Array<{ tipo: number; base: number; cuota: number }>; iva: number; retencion: number; total: number; lineas: Array<{ importe: number; cuota: number }> }

export const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;
const f2 = (x: number) => r2(x).toFixed(2);
const fq = (x: number) => String(Math.round(x * 1e6) / 1e6);
const fp = (x: number) => { const s = (Math.round(x * 1e6) / 1e6).toFixed(6).replace(/0+$/, '').replace(/\.$/, ''); return s.includes('.') && s.split('.')[1].length >= 2 ? s : Number(s).toFixed(2); };
const esc = (s: string) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function calcular(f: Factura): Totales {
  const lineas = f.lineas.map((l) => { const importe = r2(l.cantidad * l.precio); return { importe, cuota: r2((importe * l.iva) / 100) }; });
  const porTipo = new Map<number, { base: number; cuota: number }>();
  f.lineas.forEach((l, i) => { const t = porTipo.get(l.iva) ?? { base: 0, cuota: 0 }; t.base = r2(t.base + lineas[i].importe); t.cuota = r2(t.cuota + lineas[i].cuota); porTipo.set(l.iva, t); });
  const bruto = r2(lineas.reduce((s, x) => s + x.importe, 0));
  const iva = r2(lineas.reduce((s, x) => s + x.cuota, 0));
  const retencion = r2((bruto * f.retencion) / 100);
  return { bruto, impuestos: [...porTipo].map(([tipo, v]) => ({ tipo, ...v })).sort((a, b) => b.tipo - a.tipo), iva, retencion, total: r2(bruto + iva - retencion), lineas };
}

export const NIF_ES = /^[0-9A-Z][0-9]{7}[0-9A-Z]$/;
/** Comprobaciones antes de descargar: lo que el esquema o FACe rechazarían. Devuelve claves de error. */
export function comprobar(f: Factura): string[] {
  const e: string[] = [];
  const parte = (p: Parte, k: string) => {
    if (!p.nif || p.nif.length < 3 || p.nif.length > 30) e.push(`${k}.nif`);
    else if (p.residencia === 'R' && !NIF_ES.test(p.nif.toUpperCase())) e.push(`${k}.nifFormato`);
    if (!p.nombre.trim()) e.push(`${k}.nombre`);
    if (p.tipo === 'F' && !(p.apellido1 ?? '').trim()) e.push(`${k}.apellido1`);
    if (!p.direccion.trim()) e.push(`${k}.direccion`);
    if (p.pais === 'ESP' && !/^\d{5}$/.test(p.cp)) e.push(`${k}.cp`);
    if (!p.municipio.trim()) e.push(`${k}.municipio`);
    if (!p.provincia.trim()) e.push(`${k}.provincia`);
  };
  parte(f.emisor, 'emisor'); parte(f.receptor, 'receptor');
  if (!f.numero.trim() || f.numero.length > 20) e.push('numero');
  if (f.serie.length > 20) e.push('serie');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.fecha)) e.push('fecha');
  if (!f.lineas.length || f.lineas.some((l) => !l.descripcion.trim() || !(l.cantidad > 0))) e.push('lineas');
  if (f.centros && [f.centros.oficinaContable, f.centros.organoGestor, f.centros.unidadTramitadora].some((c) => !/^[A-Z0-9]{1,10}$/.test(c.trim().toUpperCase()))) e.push('dir3');
  if (f.iban && !/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(f.iban.replace(/\s/g, '').toUpperCase())) e.push('iban');
  return e;
}

const dir = (p: Parte, ind: string) => p.pais === 'ESP'
  ? `${ind}<AddressInSpain>\n${ind}  <Address>${esc(p.direccion)}</Address>\n${ind}  <PostCode>${esc(p.cp)}</PostCode>\n${ind}  <Town>${esc(p.municipio)}</Town>\n${ind}  <Province>${esc(p.provincia)}</Province>\n${ind}  <CountryCode>ESP</CountryCode>\n${ind}</AddressInSpain>`
  : `${ind}<OverseasAddress>\n${ind}  <Address>${esc(p.direccion)}</Address>\n${ind}  <PostCodeAndTown>${esc(`${p.cp} ${p.municipio}`.trim())}</PostCodeAndTown>\n${ind}  <Province>${esc(p.provincia)}</Province>\n${ind}  <CountryCode>${esc(p.pais)}</CountryCode>\n${ind}</OverseasAddress>`;

function parteXml(tag: string, p: Parte, centros?: Centros): string {
  const i = '      ';
  const cen = centros ? `\n    <AdministrativeCentres>\n${([['01', centros.oficinaContable], ['02', centros.organoGestor], ['03', centros.unidadTramitadora]] as const).map(([rol, c]) => `      <AdministrativeCentre>\n        <CentreCode>${esc(c.trim().toUpperCase())}</CentreCode>\n        <RoleTypeCode>${rol}</RoleTypeCode>\n${dir(p, '        ')}\n      </AdministrativeCentre>`).join('\n')}\n    </AdministrativeCentres>` : '';
  const ent = p.tipo === 'J'
    ? `    <LegalEntity>\n${i}<CorporateName>${esc(p.nombre)}</CorporateName>\n${dir(p, i)}\n    </LegalEntity>`
    : `    <Individual>\n${i}<Name>${esc(p.nombre)}</Name>\n${i}<FirstSurname>${esc(p.apellido1 ?? '')}</FirstSurname>${p.apellido2 ? `\n${i}<SecondSurname>${esc(p.apellido2)}</SecondSurname>` : ''}\n${dir(p, i)}\n    </Individual>`;
  return `  <${tag}>\n    <TaxIdentification>\n      <PersonTypeCode>${p.tipo}</PersonTypeCode>\n      <ResidenceTypeCode>${p.residencia}</ResidenceTypeCode>\n      <TaxIdentificationNumber>${esc(p.nif.toUpperCase())}</TaxIdentificationNumber>\n    </TaxIdentification>${cen}\n${ent}\n  </${tag}>`;
}

export function construirXml(f: Factura): string {
  const t = calcular(f);
  const id = `${f.emisor.nif.toUpperCase()}${f.numero}${f.serie}`.slice(0, 70);
  const tax = (code: string, rate: number, base: number, cuota: number, ind: string) => `${ind}<Tax>\n${ind}  <TaxTypeCode>${code}</TaxTypeCode>\n${ind}  <TaxRate>${f2(rate)}</TaxRate>\n${ind}  <TaxableBase>\n${ind}    <TotalAmount>${f2(base)}</TotalAmount>\n${ind}  </TaxableBase>\n${ind}  <TaxAmount>\n${ind}    <TotalAmount>${f2(cuota)}</TotalAmount>\n${ind}  </TaxAmount>\n${ind}</Tax>`;
  const lines = f.lineas.map((l, k) => {
    const imp = t.lineas[k].importe;
    const ret = f.retencion > 0 ? `\n          <TaxesWithheld>\n${tax('04', f.retencion, imp, r2((imp * f.retencion) / 100), '            ')}\n          </TaxesWithheld>` : '';
    return `        <InvoiceLine>\n          <ItemDescription>${esc(l.descripcion)}</ItemDescription>\n          <Quantity>${fq(l.cantidad)}</Quantity>\n          <UnitOfMeasure>01</UnitOfMeasure>\n          <UnitPriceWithoutTax>${fp(l.precio)}</UnitPriceWithoutTax>\n          <TotalCost>${f2(imp)}</TotalCost>\n          <GrossAmount>${f2(imp)}</GrossAmount>${ret}\n          <TaxesOutputs>\n${tax('01', l.iva, imp, t.lineas[k].cuota, '            ')}\n          </TaxesOutputs>\n        </InvoiceLine>`;
  }).join('\n');
  const pago = f.iban && f.vencimiento ? `\n      <PaymentDetails>\n        <Installment>\n          <InstallmentDueDate>${f.vencimiento}</InstallmentDueDate>\n          <InstallmentAmount>${f2(t.total)}</InstallmentAmount>\n          <PaymentMeans>04</PaymentMeans>\n          <AccountToBeCredited>\n            <IBAN>${esc(f.iban.replace(/\s/g, '').toUpperCase())}</IBAN>\n          </AccountToBeCredited>\n        </Installment>\n      </PaymentDetails>` : '';
  const desc = f.descripcion?.trim() ? `\n        <InvoiceDescription>${esc(f.descripcion.trim())}</InvoiceDescription>` : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<fe:Facturae xmlns:fe="${NS}" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
  <FileHeader>
    <SchemaVersion>${P.facturae.version}</SchemaVersion>
    <Modality>I</Modality>
    <InvoiceIssuerType>EM</InvoiceIssuerType>
    <Batch>
      <BatchIdentifier>${esc(id)}</BatchIdentifier>
      <InvoicesCount>1</InvoicesCount>
      <TotalInvoicesAmount>
        <TotalAmount>${f2(t.total)}</TotalAmount>
      </TotalInvoicesAmount>
      <TotalOutstandingAmount>
        <TotalAmount>${f2(t.total)}</TotalAmount>
      </TotalOutstandingAmount>
      <TotalExecutableAmount>
        <TotalAmount>${f2(t.total)}</TotalAmount>
      </TotalExecutableAmount>
      <InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
    </Batch>
  </FileHeader>
  <Parties>
${parteXml('SellerParty', f.emisor)}
${parteXml('BuyerParty', f.receptor, f.centros)}
  </Parties>
  <Invoices>
    <Invoice>
      <InvoiceHeader>
        <InvoiceNumber>${esc(f.numero)}</InvoiceNumber>${f.serie ? `\n        <InvoiceSeriesCode>${esc(f.serie)}</InvoiceSeriesCode>` : ''}
        <InvoiceDocumentType>FC</InvoiceDocumentType>
        <InvoiceClass>OO</InvoiceClass>
      </InvoiceHeader>
      <InvoiceIssueData>
        <IssueDate>${f.fecha}</IssueDate>
        <InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
        <TaxCurrencyCode>EUR</TaxCurrencyCode>
        <LanguageName>${f.idioma ?? 'es'}</LanguageName>${desc}
      </InvoiceIssueData>
      <TaxesOutputs>
${t.impuestos.map((x) => tax('01', x.tipo, x.base, x.cuota, '        ')).join('\n')}
      </TaxesOutputs>${f.retencion > 0 ? `\n      <TaxesWithheld>\n${tax('04', f.retencion, t.bruto, t.retencion, '        ')}\n      </TaxesWithheld>` : ''}
      <InvoiceTotals>
        <TotalGrossAmount>${f2(t.bruto)}</TotalGrossAmount>
        <TotalGrossAmountBeforeTaxes>${f2(t.bruto)}</TotalGrossAmountBeforeTaxes>
        <TotalTaxOutputs>${f2(t.iva)}</TotalTaxOutputs>
        <TotalTaxesWithheld>${f2(t.retencion)}</TotalTaxesWithheld>
        <InvoiceTotal>${f2(t.total)}</InvoiceTotal>
        <TotalOutstandingAmount>${f2(t.total)}</TotalOutstandingAmount>
        <TotalExecutableAmount>${f2(t.total)}</TotalExecutableAmount>
      </InvoiceTotals>
      <Items>
${lines}
      </Items>${pago}
    </Invoice>
  </Invoices>
</fe:Facturae>
`;
}

/* ------------------------------------------------------------ lectura */
export interface LineaLeida { descripcion: string; cantidad: number; precio: number; importe: number; iva: number | null }
export interface FacturaLeida {
  version: string; espacio: string; firmada: boolean; serie: string; numero: string; fecha: string; tipoDoc: string; clase: string; moneda: string;
  emisor: { nombre: string; nif: string; direccion: string }; receptor: { nombre: string; nif: string; direccion: string; centros: Array<{ rol: string; codigo: string }> };
  lineas: LineaLeida[]; impuestos: Array<{ codigo: string; tipo: number; base: number; cuota: number }>; retenciones: Array<{ codigo: string; tipo: number; base: number; cuota: number }>;
  totales: { bruto: number; antesImpuestos: number; impuestos: number; retenido: number; total: number; aPagar: number };
  vencimiento: string; iban: string; avisos: string[]; facturas: number;
}
type El = { getElementsByTagName: (n: string) => ArrayLike<El>; textContent: string | null; namespaceURI?: string | null; localName?: string; childNodes: ArrayLike<El & { nodeType: number }>; documentElement?: El };
const kids = (e: El, name: string): El[] => Array.from(e.childNodes ?? []).filter((c) => c.nodeType === 1 && (c.localName === name || (c as unknown as { nodeName: string }).nodeName === name)) as El[];
const kid = (e: El | undefined, ...path: string[]): El | undefined => { let c = e; for (const p of path) { c = c ? kids(c, p)[0] : undefined; } return c; };
const txt = (e: El | undefined, ...path: string[]) => (kid(e, ...path)?.textContent ?? '').trim();
const num = (e: El | undefined, ...path: string[]) => { const s = txt(e, ...path); return s ? Number(s) : 0; };

export class ErrorLectura extends Error { constructor(public clave: 'xml' | 'noFacturae') { super(clave); } }

export function leerXml(xml: string): FacturaLeida {
  let doc: El;
  const errs: string[] = [];
  try { doc = new DOMParser({ onError: (lvl: string, m: string) => { if (lvl !== 'warning') errs.push(m); } } as never).parseFromString(xml, 'text/xml') as unknown as El; }
  catch { throw new ErrorLectura('xml'); }
  const root = doc.documentElement;
  if (!root || errs.length) throw new ErrorLectura('xml');
  if (root.localName !== 'Facturae') throw new ErrorLectura('noFacturae');
  const espacio = root.namespaceURI ?? '';
  const version = txt(root, 'FileHeader', 'SchemaVersion') || (/Facturaev(\d)_(\d)(?:_(\d))?/.exec(espacio)?.slice(1).filter(Boolean).join('.') ?? '');
  const avisos: string[] = [];
  const parte = (tag: string) => {
    const p = kid(root, 'Parties', tag);
    const le = kid(p, 'LegalEntity'), ind = kid(p, 'Individual');
    const ent = le ?? ind;
    const nombre = le ? txt(le, 'CorporateName') : [txt(ind, 'Name'), txt(ind, 'FirstSurname'), txt(ind, 'SecondSurname')].filter(Boolean).join(' ');
    const ad = kid(ent, 'AddressInSpain') ?? kid(ent, 'OverseasAddress');
    const direccion = ad ? [txt(ad, 'Address'), [txt(ad, 'PostCode'), txt(ad, 'Town'), txt(ad, 'PostCodeAndTown')].filter(Boolean).join(' '), txt(ad, 'Province'), txt(ad, 'CountryCode')].filter(Boolean).join(', ') : '';
    const centros = kid(p, 'AdministrativeCentres') ? kids(kid(p, 'AdministrativeCentres')!, 'AdministrativeCentre').map((c) => ({ rol: txt(c, 'RoleTypeCode'), codigo: txt(c, 'CentreCode') })) : [];
    return { nombre, nif: txt(p, 'TaxIdentification', 'TaxIdentificationNumber'), direccion, centros };
  };
  const invs = kids(kid(root, 'Invoices') ?? root, 'Invoice');
  const inv = invs[0];
  if (!inv) throw new ErrorLectura('noFacturae');
  const tx = (e: El | undefined) => (e ? kids(e, 'Tax').map((t) => ({ codigo: txt(t, 'TaxTypeCode'), tipo: num(t, 'TaxRate'), base: num(t, 'TaxableBase', 'TotalAmount'), cuota: num(t, 'TaxAmount', 'TotalAmount') })) : []);
  const lineas: LineaLeida[] = kids(kid(inv, 'Items') ?? inv, 'InvoiceLine').map((l) => {
    const t0 = kids(kid(l, 'TaxesOutputs') ?? l, 'Tax')[0];
    return { descripcion: txt(l, 'ItemDescription'), cantidad: num(l, 'Quantity'), precio: num(l, 'UnitPriceWithoutTax'), importe: num(l, 'GrossAmount'), iva: t0 ? num(t0, 'TaxRate') : null };
  });
  const T = kid(inv, 'InvoiceTotals');
  const totales = { bruto: num(T, 'TotalGrossAmount'), antesImpuestos: num(T, 'TotalGrossAmountBeforeTaxes'), impuestos: num(T, 'TotalTaxOutputs'), retenido: num(T, 'TotalTaxesWithheld'), total: num(T, 'InvoiceTotal'), aPagar: num(T, 'TotalExecutableAmount') };
  const impuestos = tx(kid(inv, 'TaxesOutputs')), retenciones = tx(kid(inv, 'TaxesWithheld'));
  const cerca = (a: number, b: number) => Math.abs(a - b) < 0.011;
  if (!cerca(r2(lineas.reduce((s, l) => s + l.importe, 0)), totales.bruto)) avisos.push('sumaLineas');
  if (!cerca(r2(impuestos.reduce((s, x) => s + x.cuota, 0)), totales.impuestos)) avisos.push('sumaImpuestos');
  if (!cerca(r2(totales.antesImpuestos + totales.impuestos - totales.retenido), totales.total)) avisos.push('total');
  for (const x of impuestos) if (!cerca(r2((x.base * x.tipo) / 100), x.cuota) && x.cuota !== 0) avisos.push('cuota');
  if (version && !['3.2', '3.2.1', '3.2.2'].includes(version)) avisos.push('version');
  const firmada = (doc.getElementsByTagName('ds:Signature').length + (doc as unknown as { getElementsByTagNameNS: (a: string, b: string) => ArrayLike<unknown> }).getElementsByTagNameNS('http://www.w3.org/2000/09/xmldsig#', 'Signature').length) > 0;
  if (!firmada) avisos.push('sinFirma');
  const inst = kid(inv, 'PaymentDetails', 'Installment');
  return {
    version, espacio, firmada, serie: txt(inv, 'InvoiceHeader', 'InvoiceSeriesCode'), numero: txt(inv, 'InvoiceHeader', 'InvoiceNumber'), fecha: txt(inv, 'InvoiceIssueData', 'IssueDate'),
    tipoDoc: txt(inv, 'InvoiceHeader', 'InvoiceDocumentType'), clase: txt(inv, 'InvoiceHeader', 'InvoiceClass'), moneda: txt(inv, 'InvoiceIssueData', 'InvoiceCurrencyCode'),
    emisor: parte('SellerParty'), receptor: parte('BuyerParty'), lineas, impuestos, retenciones, totales,
    vencimiento: txt(inst, 'InstallmentDueDate'), iban: txt(inst, 'AccountToBeCredited', 'IBAN'), avisos: [...new Set(avisos)], facturas: invs.length,
  };
}

/** Factura de ejemplo (datos ficticios), la misma en el creador, el visor y los tests. */
export const EJEMPLO: Factura = {
  serie: 'A', numero: '2026-0042', fecha: '2026-10-20',
  emisor: { tipo: 'F', nif: '12345678Z', residencia: 'R', nombre: 'Lucía', apellido1: 'Martín', apellido2: 'Ruiz', direccion: 'Calle Mayor 10', cp: '28013', municipio: 'Madrid', provincia: 'Madrid', pais: 'ESP' },
  receptor: { tipo: 'J', nif: 'B00000000', residencia: 'R', nombre: 'Ejemplo Servicios SL', direccion: 'Avenida de la Constitución 5', cp: '41001', municipio: 'Sevilla', provincia: 'Sevilla', pais: 'ESP' },
  lineas: [{ descripcion: 'Diseño de catálogo, octubre 2026', cantidad: 1, precio: 850, iva: 21 }, { descripcion: 'Horas de maquetación', cantidad: 6, precio: 35, iva: 21 }],
  retencion: 15, iban: 'ES9121000418450200051332', vencimiento: '2026-11-19',
};
