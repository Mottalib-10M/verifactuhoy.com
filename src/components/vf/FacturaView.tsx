/** Presentación legible de un Facturae leído (emisor, destinatario, líneas, impuestos, totales), imprimible. */
import { forwardRef } from 'react';
import type { FacturaLeida } from '../../lib/engine/facturae';
import { formatMoney, formatNumber, displayDate, type Lang } from '../../lib/format';

const L = {
  es: { factura: 'Factura', num: 'Número', fecha: 'Fecha', emisor: 'Emisor', receptor: 'Destinatario', desc: 'Concepto', cant: 'Cantidad', precio: 'Precio', iva: 'IVA', importe: 'Importe', base: 'Base imponible', cuota: 'Cuota', ret: 'Retención', total: 'Total factura', pagar: 'A pagar', venc: 'Vencimiento', iban: 'IBAN', centros: 'Códigos DIR3', rol: { '01': 'Oficina contable', '02': 'Órgano gestor', '03': 'Unidad tramitadora' } as Record<string, string> },
  en: { factura: 'Invoice', num: 'Number', fecha: 'Date', emisor: 'Issuer', receptor: 'Recipient', desc: 'Item', cant: 'Quantity', precio: 'Price', iva: 'VAT', importe: 'Amount', base: 'Taxable base', cuota: 'Tax', ret: 'Withholding', total: 'Invoice total', pagar: 'Amount due', venc: 'Due date', iban: 'IBAN', centros: 'DIR3 codes', rol: { '01': 'Accounting office', '02': 'Managing body', '03': 'Processing unit' } as Record<string, string> },
};

const FacturaView = forwardRef<HTMLDivElement, { f: FacturaLeida; lang: Lang }>(({ f, lang }, ref) => {
  const t = L[lang];
  const eur = (x: number) => formatMoney(x, 2, lang);
  const d = (iso: string) => (iso ? displayDate(iso, lang === 'es' ? 'es-ES' : 'en-GB') : '–');
  return (
    <div ref={ref} className="rounded-lg border border-navy-200 bg-white p-4 text-sm text-navy-900 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xl font-bold">{t.factura} {f.serie ? `${f.serie}-` : ''}{f.numero}</p><p className="text-navy-600">{t.fecha}: {d(f.fecha)}</p></div>
        <p className="text-right text-xs text-navy-500">Facturae {f.version}</p>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><p className="text-xs font-semibold uppercase text-navy-500">{t.emisor}</p><p className="font-semibold">{f.emisor.nombre}</p><p>{f.emisor.nif}</p><p className="text-navy-700">{f.emisor.direccion}</p></div>
        <div><p className="text-xs font-semibold uppercase text-navy-500">{t.receptor}</p><p className="font-semibold">{f.receptor.nombre}</p><p>{f.receptor.nif}</p><p className="text-navy-700">{f.receptor.direccion}</p>
          {f.receptor.centros.length > 0 && <p className="mt-1 text-xs text-navy-600">{t.centros}: {f.receptor.centros.map((c) => `${t.rol[c.rol] ?? c.rol} ${c.codigo}`).join(' · ')}</p>}</div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-navy-300 text-left"><th scope="col" className="py-1.5 pe-2">{t.desc}</th><th scope="col" className="py-1.5 pe-2 text-right">{t.cant}</th><th scope="col" className="py-1.5 pe-2 text-right">{t.precio}</th><th scope="col" className="py-1.5 pe-2 text-right">{t.iva}</th><th scope="col" className="py-1.5 text-right">{t.importe}</th></tr></thead>
          <tbody>{f.lineas.map((l, i) => <tr key={i} className="border-b border-navy-100"><td className="py-1.5 pe-2">{l.descripcion}</td><td className="tabular-nums py-1.5 pe-2 text-right">{formatNumber(l.cantidad, Number.isInteger(l.cantidad) ? 0 : 2, lang)}</td><td className="tabular-nums py-1.5 pe-2 text-right">{eur(l.precio)}</td><td className="tabular-nums py-1.5 pe-2 text-right">{l.iva === null ? '–' : `${formatNumber(l.iva, 0, lang)}${lang === 'es' ? ' %' : '%'}`}</td><td className="tabular-nums py-1.5 text-right">{eur(l.importe)}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="mt-4 ms-auto max-w-xs">
        <table className="w-full text-sm"><tbody>
          <tr><td className="py-1">{t.base}</td><td className="tabular-nums py-1 text-right">{eur(f.totales.antesImpuestos)}</td></tr>
          {f.impuestos.map((x, i) => <tr key={i}><td className="py-1">{t.iva} {formatNumber(x.tipo, 0, lang)}{lang === 'es' ? ' %' : '%'}</td><td className="tabular-nums py-1 text-right">{eur(x.cuota)}</td></tr>)}
          {f.retenciones.map((x, i) => <tr key={`r${i}`}><td className="py-1">{t.ret} {formatNumber(x.tipo, 0, lang)}{lang === 'es' ? ' %' : '%'}</td><td className="tabular-nums py-1 text-right">− {eur(x.cuota)}</td></tr>)}
          <tr className="border-t border-navy-300 font-semibold"><td className="py-1">{t.total}</td><td className="tabular-nums py-1 text-right">{eur(f.totales.total)}</td></tr>
        </tbody></table>
      </div>
      {(f.vencimiento || f.iban) && <p className="mt-3 text-navy-700">{f.vencimiento && `${t.venc}: ${d(f.vencimiento)}`}{f.vencimiento && f.iban ? ' · ' : ''}{f.iban && `${t.iban}: ${f.iban}`}</p>}
    </div>
  );
});
export default FacturaView;
