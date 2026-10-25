/**
 * Generador de la URL y del código QR tributario (especificación AEAT 0.5.0): nivel de corrección M, zona en blanco,
 * texto « QR tributario: » encima y leyenda VERI*FACTU debajo. Sirve para probar o comprobar un diseño de factura:
 * el QR no registra nada; la factura solo es verificable si el sistema de facturación ha enviado su registro.
 */
import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Choice, ResultCard, Rows } from '../calc/parts';
import { Field } from '../ui/Fields';
import { construirUrl, validarDatos, type Modalidad, type Entorno } from '../../lib/engine/qr';
import { download } from '../../lib/vf-client';
import P from '../../data/params-2026.json';
import type { Lang } from '../../lib/format';

const L = {
  es: {
    nif: 'NIF del emisor', num: 'Serie y número de la factura', fecha: 'Fecha de expedición (DD-MM-AAAA)', imp: 'Importe total (punto decimal)', mod: 'Sistema', ent: 'Entorno',
    vf: 'VERI*FACTU', novf: 'No VERI*FACTU', prod: 'Producción', pre: 'Pruebas',
    label: 'URL del QR tributario', ok: 'Lista para el QR', ko: 'Revisa los datos',
    svg: 'Descargar el QR en SVG', png: 'Descargar en PNG', tam: 'Tamaño impreso', nivel: 'Corrección de errores', margen: 'Zona en blanco',
    arriba: P.qr.textoArriba, abajo: P.qr.textoAbajoVerifactu,
    aviso: 'Este QR no registra la factura en la AEAT. Solo sirve para probar el diseño o comprobar cómo queda la URL. En una factura real lo genera tu sistema de facturación junto con el registro.',
    err: { nif: 'NIF de 9 caracteres', numserie: 'Hasta 60 caracteres imprimibles', fecha: 'Fecha DD-MM-AAAA válida', importe: 'Hasta 12 enteros y 2 decimales, con punto' } as Record<string, string>,
  },
  en: {
    nif: 'Issuer tax ID', num: 'Invoice series and number', fecha: 'Issue date (DD-MM-YYYY)', imp: 'Total amount (decimal point)', mod: 'System', ent: 'Environment',
    vf: 'VERI*FACTU', novf: 'Non-VERI*FACTU', prod: 'Production', pre: 'Test',
    label: 'Tax QR URL', ok: 'Ready for the QR', ko: 'Check the data',
    svg: 'Download the QR as SVG', png: 'Download as PNG', tam: 'Printed size', nivel: 'Error correction', margen: 'Quiet zone',
    arriba: P.qr.textoArriba, abajo: P.qr.textoAbajoVerifactu,
    aviso: 'This QR does not register the invoice with the AEAT. It is for testing a layout or seeing how the URL looks. On a real invoice your invoicing system creates it together with the record.',
    err: { nif: '9-character tax ID', numserie: 'Up to 60 printable characters', fecha: 'Valid DD-MM-YYYY date', importe: 'Up to 12 digits and 2 decimals, with a dot' } as Record<string, string>,
  },
};

export default function QrGen({ lang, idPrefix = 'qg' }: { lang: Lang; idPrefix?: string }) {
  const t = L[lang];
  const [nif, setNif] = useState('89890001K');
  const [num, setNum] = useState('12345678&G33');
  const [fecha, setFecha] = useState('01-01-2024');
  const [imp, setImp] = useState('241.4');
  const [mod, setMod] = useState<Modalidad>('verifactu');
  const [ent, setEnt] = useState<Entorno>('pruebas');
  const d = { nif, numserie: num, fecha, importe: imp };
  const v = validarDatos(d);
  const url = useMemo(() => construirUrl(d, mod, ent), [nif, num, fecha, imp, mod, ent]);
  const [svg, setSvg] = useState('');
  useEffect(() => {
    if (v.errores.length) { setSvg(''); return; }
    QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'M', margin: 4 }).then(setSvg).catch(() => setSvg(''));
  }, [url, v.errores.length]);
  const png = async () => {
    const b64 = (await QRCode.toDataURL(url, { errorCorrectionLevel: 'M', margin: 4, width: 600 })).split(',')[1];
    const bin = atob(b64); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    download(bytes, 'qr-tributario.png', 'image/png');
  };

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid min-w-0 content-start gap-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <Field id={`${idPrefix}-nif`} label={t.nif} value={nif} onChange={(x) => setNif(x.toUpperCase())} bad={v.errores.includes('nif')} mono />
          <Field id={`${idPrefix}-num`} label={t.num} value={num} onChange={setNum} bad={v.errores.includes('numserie')} mono />
          <Field id={`${idPrefix}-fecha`} label={t.fecha} value={fecha} onChange={setFecha} bad={v.errores.includes('fecha')} mono mode="numeric" />
          <Field id={`${idPrefix}-imp`} label={t.imp} value={imp} onChange={(x) => setImp(x.replace(',', '.'))} bad={v.errores.includes('importe')} mono mode="decimal" />
          <Choice id={`${idPrefix}-mod`} label={t.mod} value={mod} onChange={setMod} options={[{ value: 'verifactu', label: t.vf }, { value: 'noverifactu', label: t.novf }]} />
          <Choice id={`${idPrefix}-ent`} label={t.ent} value={ent} onChange={setEnt} options={[{ value: 'pruebas', label: t.pre }, { value: 'produccion', label: t.prod }]} />
        </form>
        <ResultCard label={t.label} value={v.errores.length ? t.ko : t.ok} sub={v.errores.length ? v.errores.map((e) => t.err[e]).join(' · ') : undefined}>
          <p className="mt-2 break-all font-mono text-xs text-navy-800">{url}</p>
          <Rows rows={[[t.tam, `${P.qr.mmMin} × ${P.qr.mmMin} mm – ${P.qr.mmMax} × ${P.qr.mmMax} mm`], [t.nivel, P.qr.correccion], [t.margen, `≥ ${P.qr.margenMin} mm (${P.qr.margenRecomendado} mm)`]]} />
        </ResultCard>
      </div>
      {svg && (
        <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-6">
          <figure className="w-44 shrink-0 text-center">
            <figcaption className="text-xs font-semibold text-navy-900">{t.arriba}</figcaption>
            <div className="mx-auto mt-1 w-40" dangerouslySetInnerHTML={{ __html: svg }} />
            {mod === 'verifactu' && <p className="mt-1 text-[10px] leading-tight text-navy-800">{t.abajo}</p>}
          </figure>
          <div className="text-sm">
            <p className="flex flex-wrap gap-x-4 gap-y-1"><button type="button" className="font-medium text-accent-700 underline" onClick={() => download(svg, 'qr-tributario.svg', 'image/svg+xml')}>{t.svg}</button><button type="button" className="font-medium text-accent-700 underline" onClick={png}>{t.png}</button></p>
            <p className="mt-2 max-w-prose text-xs text-navy-600">{t.aviso}</p>
          </div>
        </div>
      )}
    </div>
  );
}
