/** Todas las páginas previstas (id = nombre del fichero de src/content/guides).
 *  Los tests aceptan un enlace a estos ids durante la redacción; « todas las páginas existen » falla mientras falte alguna. */
export const PLANNED_GUIDES = [
  'lector', 'generador-qr', 'huella', 'facturae', 'gratis', 'visor', 'sanciones',
  'que-es', 'calendario', 'modalidades', 'requisitos', 'elegir', 'app-aeat', 'autonomos', 'ticketbai', 'sii',
  'factura-electronica', 'obligatoria', 'b2b', 'fe-autonomos', 'facturae-vs-b2b', 'descargar', 'face', 'firma',
  'rectificativa', 'simplificada', 'requisitos-factura', 'ejemplo',
];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, 'home', 'method', 'about', 'widget', 'contact', 'editorial', 'privacy', 'terms', 'cookies']);
