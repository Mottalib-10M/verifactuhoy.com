/** Où mène le bouton d'un mini-simulateur : la page qui porte l'outil complet de ce type. */
import { ROUTES, route } from '../i18n/routes';
import { pageOfTool } from './pages';
import type { Lang } from './format';
/** Minis dont l'outil complet est un outil de fichier ou la frise. */
const EXTRA: Record<string, string> = { calendario: 'calendario', hash: 'huella', qrurl: 'generador-qr' };
export const miniHref = (kind: string, lang: Lang, fallback: string) => { const id = EXTRA[kind] ?? pageOfTool(kind); return id && ROUTES.some((r) => r.id === id) ? route(id, lang) : fallback; };
