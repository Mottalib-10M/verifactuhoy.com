import { route, hasRoute, type Locale } from './routes';
import { GUIDES, guideById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  es: { home: 'Verifactu 2026', method: 'Método', about: 'Quiénes somos', widget: 'Insertar las herramientas', contact: 'Contacto', editorial: 'Política editorial', privacy: 'Privacidad', terms: 'Aviso legal', cookies: 'Cookies' },
  en: { home: 'Verifactu 2026', method: 'Method', about: 'About', widget: 'Embed the tools', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
export const GROUPS: Array<{ id: Group; label: Record<Locale, string> }> = [
  { id: 'herramientas', label: { es: 'Herramientas', en: 'Tools' } },
  { id: 'verifactu', label: { es: 'Verifactu', en: 'Verifactu' } },
  { id: 'electronica', label: { es: 'Factura electrónica', en: 'E-invoicing' } },
  { id: 'facturas', label: { es: 'Facturas', en: 'Invoices' } },
];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? guideById(id)?.[lang]?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.label[lang], links: inGroup(g.id, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => {
  const site = { label: { es: 'Este sitio', en: 'This site' }[lang], links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) };
  return [
    { label: GROUPS[1].label[lang], links: inGroup('verifactu', lang) },
    { label: GROUPS[2].label[lang], links: inGroup('electronica', lang) },
    { label: GROUPS[3].label[lang], links: inGroup('facturas', lang) },
    site,
  ];
};
/** Las herramientas, a un clic desde cualquier página (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => inGroup('herramientas', lang);
