/**
 * Visor de Facturae (3.2, 3.2.1, 3.2.2): abre el XML, firmado o no, y lo muestra como una factura legible,
 * con comprobación de sumas, versión y firma. El fichero se lee en este navegador y no se envía.
 * Primer render = factura de ejemplo creada con el mismo motor (datos ficticios).
 */
import { useMemo, useRef, useState, type DragEvent } from 'react';
import { ResultCard, Rows } from '../calc/parts';
import FacturaView from './FacturaView';
import { construirXml, leerXml, EJEMPLO, ErrorLectura, type FacturaLeida } from '../../lib/engine/facturae';
import { readText, printNode, download } from '../../lib/vf-client';
import { formatMoney, type Lang } from '../../lib/format';

const L = {
  es: {
    drop: 'Arrastra aquí tu Facturae', dropSub: 'Fichero .xml o .xsig, firmado o sin firmar', fich: 'Fichero Facturae',
    privat: 'Tu fichero se lee en este navegador: no se sube a ningún servidor.', label: 'Total de la factura', leyendo: 'Leyendo…',
    emisor: 'Emisor', num: 'Número', version: 'Versión', firma: 'Firma electrónica', firmada: 'Sí (no se valida el certificado)', sinFirma: 'No: FACe la rechazaría', checks: 'Comprobaciones', ok: 'Sumas y tipos correctos',
    av: { sumaLineas: 'La suma de las líneas no da el importe bruto', sumaImpuestos: 'La suma de impuestos no cuadra con el total de impuestos', total: 'Base más impuestos menos retenciones no da el total', cuota: 'Alguna cuota no corresponde a base por tipo', version: 'Versión de Facturae no reconocida', sinFirma: 'Sin firma electrónica' } as Record<string, string>,
    err: { xml: 'El fichero no es un XML válido. ¿Está dañado o incompleto?', noFacturae: 'Este XML no es una factura Facturae.' },
    imprimir: 'Imprimir o guardar en PDF', ejemplo: 'Factura de ejemplo con datos ficticios', descargar: 'Descargar este ejemplo en XML', varias: (n: number) => `El fichero tiene ${n} facturas: se muestra la primera.`,
  },
  en: {
    drop: 'Drop your Facturae file here', dropSub: '.xml or .xsig file, signed or unsigned', fich: 'Facturae file',
    privat: 'Your file is read in this browser: it is never uploaded to a server.', label: 'Invoice total', leyendo: 'Reading…',
    emisor: 'Issuer', num: 'Number', version: 'Version', firma: 'Electronic signature', firmada: 'Yes (certificate not validated)', sinFirma: 'No: FACe would reject it', checks: 'Checks', ok: 'Sums and rates add up',
    av: { sumaLineas: 'Line amounts do not add up to the gross amount', sumaImpuestos: 'Tax amounts do not add up to the tax total', total: 'Base plus tax minus withholding does not give the total', cuota: 'A tax amount does not match base times rate', version: 'Unrecognised Facturae version', sinFirma: 'No electronic signature' } as Record<string, string>,
    err: { xml: 'The file is not valid XML. Is it damaged or incomplete?', noFacturae: 'This XML is not a Facturae invoice.' },
    imprimir: 'Print or save as PDF', ejemplo: 'Sample invoice with made-up data', descargar: 'Download this sample as XML', varias: (n: number) => `The file holds ${n} invoices: the first is shown.`,
  },
};

export default function Visor({ lang, idPrefix = 'vf' }: { lang: Lang; idPrefix?: string }) {
  const t = L[lang];
  const ejemploXml = useMemo(() => construirXml(EJEMPLO), []);
  const [xml, setXml] = useState(ejemploXml);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const view = useRef<HTMLDivElement>(null);
  const res = useMemo((): { f?: FacturaLeida; err?: 'xml' | 'noFacturae' } => { try { return { f: leerXml(xml) }; } catch (e) { return { err: e instanceof ErrorLectura ? e.clave : 'xml' }; } }, [xml]);
  const take = async (file: File | undefined) => { if (!file) return; setBusy(true); try { setXml(await readText(file)); setName(file.name); } finally { setBusy(false); } };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files?.[0]); };
  const f = res.f;
  const avisos = f ? f.avisos.filter((a) => a !== 'sinFirma') : [];
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid min-w-0 content-start gap-y-3" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor={`${idPrefix}-file`} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop}
            className={`block cursor-pointer rounded-lg border-2 border-dashed px-4 py-4 text-center ${over ? 'border-accent-500 bg-accent-50' : 'border-navy-300 bg-navy-50'}`}>
            <span className="block font-semibold text-navy-900">{t.drop}</span>
            <span className="block text-sm text-navy-600">{t.dropSub}</span>
            <input id={`${idPrefix}-file`} type="file" accept=".xml,.xsig,application/xml,text/xml" onChange={(e) => take(e.target.files?.[0])} aria-label={t.fich}
              className="mt-3 block h-12 w-full rounded-lg border border-navy-300 bg-white p-1.5 text-sm text-navy-700 file:me-3 file:h-full file:rounded-md file:border-0 file:bg-accent-700 file:px-3 file:py-2 file:font-semibold file:text-white" />
          </label>
          <p className="text-xs text-navy-600">{t.privat}</p>
          {!name && <p className="text-sm"><button type="button" className="font-medium text-accent-700 underline" onClick={() => download(ejemploXml, 'facturae-ejemplo.xml', 'application/xml')}>{t.descargar}</button></p>}
        </form>
        <ResultCard label={f ? `${t.label}${f.emisor.nombre ? ` · ${f.emisor.nombre}` : ''}` : t.fich} value={busy ? t.leyendo : f ? formatMoney(f.totales.total, 2, lang) : '–'} sub={res.err ? t.err[res.err] : f && f.facturas > 1 ? t.varias(f.facturas) : undefined}>
          <Rows rows={f ? [[t.num, `${f.serie ? `${f.serie}-` : ''}${f.numero}`], [t.version, f.version || '–'], [t.firma, f.firmada ? t.firmada : t.sinFirma], [t.checks, avisos.length ? avisos.map((a) => t.av[a]).join('; ') : t.ok]] : []} />
          {!name && <p className="mt-2 text-xs text-navy-600">{t.ejemplo}</p>}
          {f && <p className="mt-3 text-sm"><button type="button" className="font-medium text-accent-700 underline" onClick={() => view.current && printNode(view.current, `${f.serie}${f.numero}`)}>{t.imprimir}</button></p>}
        </ResultCard>
      </div>
      {f && <div className="mt-5"><FacturaView ref={view} f={f} lang={lang} /></div>}
    </div>
  );
}
