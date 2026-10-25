/** llms.txt (RECETTE §21), generado a partir del registro de páginas. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const P = K.P, VF = P.verifactu, B = P.b2b;
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Spanish Verifactu and e-invoicing tools and guides, in Spanish and English. Read on ${P.retrieved_at} in the BOE: under the fourth final provision of Royal Decree 1007/2023 (as amended by Royal Decree-law 15/2025), invoicing software must be adapted before ${VF.sociedadesAntes} for corporate income taxpayers and before ${VF.restoAntes} for everyone else; excluded: SII filers, Basque and Navarre tax domiciles, invoicing without software. Fines under article 201 bis of the General Tax Act: ${P.sanciones.tenencia} EUR per year for users of non-compliant software, ${P.sanciones.fabricante} EUR per year and software type for producers. B2B e-invoicing (Law 18/2022, Royal Decree 238/2026, Order HAC/1028/2026 in force ${B.ordenVigor}): ${B.fechaGrandes} above ${B.umbral} EUR turnover and ${B.fechaResto} for others (site's calculation). Browser-only tools (no upload, no account): Verifactu check, tax QR reader (decodes the AEAT matching URL), QR and SHA-256 hash generators reproducing the official AEAT examples, Facturae ${P.facturae.version} creator validated against the official XSD (unsigned), Facturae viewer, penalty, SII deadline and B2B calculators. Independent site published by Radif Partners, not affiliated with the Spanish Tax Agency (AEAT) or any public body; not tax advice. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.es}`, ...GUIDES.filter((p) => p.group === g.id).flatMap((p) => [
      `- [${p.es.nav}](${SITE_URL}${route(p.id, 'es')}): ${p.es.card}`,
      `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`,
    ]), '']),
    '## About', `- [Método](${SITE_URL}${route('method', 'es')})`, `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Quiénes somos](${SITE_URL}${route('about', 'es')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
