import type { Locale } from './routes';
const es = {
  updatedOn: 'Actualizado el', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Preparado por',
  skipToContent: 'Ir al contenido', mainNav: 'Navegación principal', breadcrumbLabel: 'Ruta de navegación', breadcrumbHome: 'Inicio', menuOpen: 'Abrir el menú',
  faqTitle: 'Preguntas frecuentes', relatedCalculators: 'Sigue con', sourcesTitle: 'Fuentes oficiales de esta página', writtenBy: 'Preparado por',
  asOf: 'Situación', lastUpdated: 'normativa leída en el BOE y en la sede de la AEAT el', footerValidated: 'Fuentes: RD 1007/2023 y RDL 15/2025, Orden HAC/1177/2024, RD 238/2026 y Orden HAC/1028/2026 (BOE), especificaciones técnicas de la AEAT, esquema Facturae 3.2.2',
  footerBrowser: 'Todo funciona en tu navegador · ningún fichero ni dato se envía · sin cuenta ni registro',
  footerDisclaimer: 'Sitio independiente de Radif Partners, no gubernamental, sin relación con la Agencia Tributaria, el Ministerio de Hacienda ni las Haciendas forales. Información orientativa: no sustituye el asesoramiento fiscal de un profesional.',
  footerPopular: 'Herramientas',
  notFound: 'En esta dirección no hay ninguna página. En la portada tienes el diagnóstico Verifactu, el lector del QR y el creador de Facturae.',
  readMore: 'Seguir leyendo',
  moreOptions: 'Más datos', copyLink: 'Copiar el enlace', copied: 'Enlace copiado', print: 'Imprimir', howComputed: 'Cómo se calcula', openFull: 'Abrir la herramienta completa',
  independent: 'Sitio independiente, no gubernamental',
};
const en: typeof es = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources for this page', writtenBy: 'Prepared by',
  asOf: 'As of', lastUpdated: 'rules read in the BOE and on the AEAT website on', footerValidated: 'Sources: RD 1007/2023 and RDL 15/2025, Order HAC/1177/2024, RD 238/2026 and Order HAC/1028/2026 (BOE), AEAT technical specifications, Facturae 3.2.2 schema',
  footerBrowser: 'Everything runs in your browser · no file or data is sent · no account, no sign-up',
  footerDisclaimer: 'Independent, non-governmental site published by Radif Partners, not affiliated with the Spanish Tax Agency, the Ministry of Finance or the provincial treasuries. Not tax advice.',
  footerPopular: 'Tools',
  notFound: 'Nothing lives at this address. The home page has the Verifactu check, the QR reader and the Facturae creator.',
  readMore: 'Read more',
  moreOptions: 'More details', copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is calculated', openFull: 'Open the full tool',
  independent: 'Independent, non-governmental site',
};
const ALL = { es, en };
export function t(lang: Locale) { return ALL[lang] ?? es; }
