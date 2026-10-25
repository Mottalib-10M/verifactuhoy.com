/**
 * Lector del QR tributario: imagen (archivo o arrastrar), cámara o URL pegada. Decodifica la URL de cotejo de la AEAT
 * (nif, numserie, fecha, importe), comprueba su formato y enlaza la página oficial de verificación.
 * La imagen se lee en este navegador y no se envía a ningún sitio. Primer render = ejemplo oficial de la AEAT (§17.5).
 */
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { ResultCard, Rows } from '../calc/parts';
import { Field } from '../ui/Fields';
import { leerUrl, clasificar, construirUrl, type Lectura } from '../../lib/engine/qr';
import { decodeFile, decodeImage } from '../../lib/vf-client';
import { formatMoney, type Lang } from '../../lib/format';

const EJEMPLO = construirUrl({ nif: '89890001K', numserie: '12345678&G33', fecha: '01-01-2024', importe: '241.4' }, 'verifactu', 'pruebas');

const L = {
  es: {
    drop: 'Arrastra aquí la foto o captura del QR', dropSub: 'O elige una imagen (PNG, JPG). También vale una captura de una factura en PDF.', foto: 'Imagen del código QR',
    camara: 'Escanear con la cámara', parar: 'Parar la cámara', camaraNo: 'No se pudo abrir la cámara. Prueba con una foto.', url: 'O pega aquí la URL del QR',
    privat: 'La imagen se lee en este navegador: no se sube a ningún servidor.', leyendo: 'Leyendo…',
    label: 'Factura del QR', importe: 'Importe total', nif: 'NIF del emisor', num: 'Serie y número', fecha: 'Fecha de expedición', sistema: 'Sistema', entorno: 'Entorno',
    vf: 'VERI*FACTU (registro enviado a la AEAT)', novf: 'No VERI*FACTU', prod: 'Producción', pre: 'Pruebas de la AEAT (no es una factura real)',
    abrir: 'Comprobar en la sede de la AEAT', abrirSub: 'Se abre la página oficial de cotejo con estos datos. Allí la AEAT dice si la factura consta.',
    ejemplo: 'Ejemplo oficial de la AEAT, en su entorno de pruebas',
    err: { nif: 'El NIF no tiene 9 caracteres', numserie: 'Serie y número vacíos, de más de 60 caracteres o con caracteres no admitidos', fecha: 'La fecha no tiene el formato DD-MM-AAAA o no existe', importe: 'El importe no sigue el formato (hasta 12 enteros y 2 decimales con punto)' } as Record<string, string>,
    av: { 'nif-letra': 'La letra del DNI o NIE no cuadra con el número', http: 'La URL no empieza por https', formato: 'La URL lleva el parámetro formato, que no debe ir en un QR impreso' } as Record<string, string>,
    noQr: 'No se encontró ningún QR en la imagen. Prueba con una imagen más nítida o recortada al código.',
    tbai: 'Es un QR de TicketBAI (País Vasco): se comprueba en la sede de la Hacienda foral que emite la factura, no en la AEAT.',
    otro: 'Este QR no es un QR tributario de la AEAT. Su contenido:', bien: 'Formato correcto', mal: 'Errores de formato',
    falso: 'Un QR con formato correcto no prueba nada por sí solo: solo la respuesta de la AEAT dice si la factura está registrada.',
  },
  en: {
    drop: 'Drop the photo or screenshot of the QR here', dropSub: 'Or choose an image (PNG, JPG). A screenshot of a PDF invoice works too.', foto: 'QR code image',
    camara: 'Scan with the camera', parar: 'Stop the camera', camaraNo: 'The camera could not be opened. Try a photo.', url: 'Or paste the QR URL here',
    privat: 'The image is read in this browser: it is never uploaded to a server.', leyendo: 'Reading…',
    label: 'Invoice in the QR', importe: 'Total amount', nif: 'Issuer tax ID', num: 'Series and number', fecha: 'Issue date', sistema: 'System', entorno: 'Environment',
    vf: 'VERI*FACTU (record sent to the AEAT)', novf: 'Non-VERI*FACTU', prod: 'Production', pre: 'AEAT test environment (not a real invoice)',
    abrir: 'Check on the AEAT website', abrirSub: 'Opens the official matching page with these data. There the AEAT says whether the invoice is on record.',
    ejemplo: 'Official AEAT example, in its test environment',
    err: { nif: 'The tax ID is not 9 characters long', numserie: 'Series and number empty, longer than 60 characters or with disallowed characters', fecha: 'The date is not DD-MM-YYYY or does not exist', importe: 'The amount does not follow the format (up to 12 digits and 2 decimals with a dot)' } as Record<string, string>,
    av: { 'nif-letra': 'The DNI or NIE letter does not match the number', http: 'The URL does not start with https', formato: 'The URL carries the formato parameter, which must not appear in a printed QR' } as Record<string, string>,
    noQr: 'No QR code found in the image. Try a sharper image or crop it to the code.',
    tbai: 'This is a TicketBAI QR (Basque Country): it is checked on the website of the provincial treasury of the issuer, not the AEAT.',
    otro: 'This QR is not an AEAT tax QR. Its content:', bien: 'Format correct', mal: 'Format errors',
    falso: 'A correctly formatted QR proves nothing by itself: only the AEAT answer says whether the invoice is registered.',
  },
};

export default function Lector({ lang, idPrefix = 'lq' }: { lang: Lang; idPrefix?: string }) {
  const t = L[lang];
  const [texto, setTexto] = useState(EJEMPLO);
  const [ejemplo, setEjemplo] = useState(true);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [cam, setCam] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const r: Lectura | null = leerUrl(texto);
  const clase = clasificar(texto);

  const found = (s: string | null) => { if (s) { setTexto(s); setEjemplo(false); setMsg(''); } else setMsg(t.noQr); };
  const take = async (f: File | undefined) => { if (!f) return; setBusy(true); try { found(await decodeFile(f)); } catch { setMsg(t.noQr); } finally { setBusy(false); } };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files?.[0]); };
  const stop = () => { stream.current?.getTracks().forEach((x) => x.stop()); stream.current = null; setCam(false); };
  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      stream.current = s; setCam(true); setMsg('');
    } catch { setMsg(t.camaraNo); }
  };
  useEffect(() => {
    if (!cam || !video.current || !stream.current) return;
    const v = video.current; v.srcObject = stream.current; v.play().catch(() => {});
    let alive = true;
    const tick = async () => {
      if (!alive) return;
      if (v.readyState >= 2 && v.videoWidth) { const s = await decodeImage(v, v.videoWidth, v.videoHeight).catch(() => null); if (s && alive) { found(s); stop(); return; } }
      setTimeout(tick, 300);
    };
    tick();
    return () => { alive = false; };
  }, [cam]);
  useEffect(() => () => stop(), []);

  const fecha = r?.fecha ?? '';
  const rows: Array<[string, string]> = r ? [
    [t.nif, r.nif || '–'], [t.num, r.numserie || '–'], [t.fecha, fecha.replace(/-/g, '/') || '–'],
    [t.sistema, r.modalidad === 'verifactu' ? t.vf : t.novf], [t.entorno, r.entorno === 'produccion' ? t.prod : t.pre],
  ] : [];
  const valor = r && /^-?\d+(\.\d+)?$/.test(r.importe) ? formatMoney(Number(r.importe), 2, lang) : '–';
  const sub = r ? (r.errores.length ? `${t.mal}: ${r.errores.map((e) => t.err[e]).join('; ')}.` : t.bien) : clase === 'ticketbai' ? t.tbai : msg || undefined;

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid min-w-0 content-start gap-y-3" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor={`${idPrefix}-file`} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop}
            className={`block cursor-pointer rounded-lg border-2 border-dashed px-4 py-4 text-center ${over ? 'border-accent-500 bg-accent-50' : 'border-navy-300 bg-navy-50'}`}>
            <span className="block font-semibold text-navy-900">{t.drop}</span>
            <span className="block text-sm text-navy-600">{t.dropSub}</span>
            <input id={`${idPrefix}-file`} type="file" accept="image/*" onChange={(e) => take(e.target.files?.[0])} aria-label={t.foto}
              className="mt-3 block h-12 w-full rounded-lg border border-navy-300 bg-white p-1.5 text-sm text-navy-700 file:me-3 file:h-full file:rounded-md file:border-0 file:bg-accent-700 file:px-3 file:py-2 file:font-semibold file:text-white" />
          </label>
          <button type="button" onClick={cam ? stop : start} className="h-12 rounded-lg border border-accent-700 px-4 text-sm font-semibold text-accent-700 hover:bg-accent-50">{cam ? t.parar : t.camara}</button>
          {cam && <video ref={video} muted playsInline className="w-full rounded-lg border border-navy-200" />}
          <Field id={`${idPrefix}-url`} label={t.url} value={texto} onChange={(x) => { setTexto(x); setEjemplo(false); }} mono />
          <p className="text-xs text-navy-600">{t.privat}</p>
        </form>
        <ResultCard label={t.label} value={busy ? t.leyendo : r ? valor : '–'} sub={sub}>
          <Rows rows={rows} />
          {r && r.avisos.length > 0 && <ul className="mt-2 list-disc ps-5 text-xs text-amber-800">{r.avisos.map((a) => <li key={a}>{t.av[a]}</li>)}</ul>}
          {!r && clase !== 'ticketbai' && texto && clase !== 'texto' && <p className="mt-2 break-all text-xs text-navy-700">{t.otro} {texto}</p>}
          {r && r.errores.length === 0 && <p className="mt-3"><a href={r.url} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold text-accent-700 underline">{t.abrir}</a><span className="mt-1 block text-xs text-navy-600">{t.abrirSub}</span></p>}
          {ejemplo && <p className="mt-2 text-xs text-navy-600">{t.ejemplo}</p>}
          <p className="mt-2 text-xs text-navy-600">{t.falso}</p>
        </ResultCard>
      </div>
    </div>
  );
}
