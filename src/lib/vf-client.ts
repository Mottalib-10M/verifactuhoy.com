/**
 * Ayudas de las herramientas de fichero en el navegador: leer, descargar, imprimir.
 * Ninguna habla con un servidor.
 */
export function download(data: BlobPart, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
export const safeName = (s: string | undefined, fallback: string) => (s || fallback).replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || fallback;

/** Imprime un nodo en un marco invisible con los estilos de la página: impresión o « Guardar como PDF ». */
export function printNode(node: HTMLElement, title: string) {
  const f = document.createElement('iframe');
  f.setAttribute('aria-hidden', 'true');
  Object.assign(f.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
  document.body.appendChild(f);
  const d = f.contentDocument!;
  const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')].map((x) => x.outerHTML).join('');
  d.open();
  d.write(`<!doctype html><html lang="${document.documentElement.lang}"><head><meta charset="utf-8"><title>${title.replace(/</g, '')}</title>${styles}<style>@page{size:A4;margin:14mm}body{background:#fff;padding:0;margin:0}</style></head><body>${node.outerHTML}</body></html>`);
  d.close();
  const go = () => { f.contentWindow?.focus(); f.contentWindow?.print(); setTimeout(() => f.remove(), 1500); };
  if (d.readyState === 'complete') setTimeout(go, 300); else f.onload = () => setTimeout(go, 300);
}

/** Lee el texto de un fichero del visitante (UTF-8, o ISO-8859-1 si el XML lo declara). */
export async function readText(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const head = new TextDecoder('ascii').decode(bytes.slice(0, 200));
  const enc = /encoding=["']([\w-]+)["']/i.exec(head)?.[1]?.toLowerCase();
  try { return new TextDecoder(enc && enc !== 'utf-8' ? enc : 'utf-8').decode(bytes); } catch { return new TextDecoder('utf-8').decode(bytes); }
}

/** Decodifica el QR de una imagen: BarcodeDetector del navegador si existe, si no jsQR (cargado al usarlo). */
export async function decodeImage(source: CanvasImageSource & { width?: number; height?: number }, w: number, h: number): Promise<string | null> {
  const BD = (globalThis as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => { detect: (s: CanvasImageSource) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector;
  if (BD) { try { const r = await new BD({ formats: ['qr_code'] }).detect(source); if (r[0]?.rawValue) return r[0].rawValue; } catch { /* sigue con jsQR */ } }
  const scale = Math.min(1, 1600 / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
  const c = document.createElement('canvas'); c.width = cw; c.height = ch;
  const ctx = c.getContext('2d', { willReadFrequently: true }); if (!ctx) return null;
  ctx.drawImage(source, 0, 0, cw, ch);
  const data = ctx.getImageData(0, 0, cw, ch);
  const jsQR = (await import('jsqr')).default;
  return jsQR(data.data, cw, ch, { inversionAttempts: 'attemptBoth' })?.data ?? null;
}
export async function decodeFile(file: File): Promise<string | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image(); img.src = url; await img.decode();
    return await decodeImage(img, img.naturalWidth, img.naturalHeight);
  } finally { URL.revokeObjectURL(url); }
}
