/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://es-verifactu.example";
export const SITE_NAMES: Record<string, string> = {"es": "ES Verifactu", "en": "ES Verifactu"};
export const LANG_TAGS: Record<string, string> = {"es": "es-ES", "en": "en-ES"};
/** Locale des nombres et des dates : anglais britannique pour la version anglaise. */
export const NUM_TAGS: Record<string, string> = {"es": "es-ES", "en": "en-GB"};
export const OG_LOCALES: Record<string, string> = {"es": "es_ES", "en": "en_GB"};
export const LOCALE_TAG = 'es-ES';
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-25';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"es": "Editor de herramientas gratuitas sobre Verifactu y factura electrónica: diagnóstico, lector del QR, creador Facturae y calendario, todo en el navegador", "en": "Publisher of free tools on Spain's Verifactu and e-invoicing rules: eligibility check, QR reader, Facturae creator and timeline, all in your browser"};
export const AUTHOR_DESC: Record<string, string> = {"es": "Radif Partners es un editor independiente. Para ES Verifactu lee el Real Decreto 1007/2023, el Real Decreto-ley 15/2025, la Orden HAC/1177/2024, el artículo 201 bis de la Ley General Tributaria, la Ley 18/2022, el Real Decreto 238/2026, la Orden HAC/1028/2026 y el esquema Facturae 3.2.2, y los convierte en herramientas que funcionan por completo en el navegador. No es una administración ni un asesor fiscal y no presta asesoramiento fiscal.", "en": "Radif Partners is an independent publisher. For ES Verifactu it reads Royal Decree 1007/2023, Royal Decree-law 15/2025, Order HAC/1177/2024, article 201 bis of the General Tax Act, Law 18/2022, Royal Decree 238/2026, Order HAC/1028/2026 and the Facturae 3.2.2 schema, and turns them into tools that run entirely in your browser. It is not a public authority or a tax adviser and gives no tax advice."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"es": ["Verifactu", "Real Decreto 1007/2023", "Facturae 3.2.2", "FACe", "factura electrónica B2B", "TicketBAI", "SII"], "en": ["Verifactu", "Spanish invoicing software rules", "Facturae", "Spanish B2B e-invoicing", "TicketBAI"]};
export const CONTACT_EMAIL = "contacto@es-verifactu.example";
export const THEME_COLOR = '#AA151B';
export const LOGO_SYMBOL = 'QR';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = '3bd68c3d9eb478550471427765539822';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Francia / France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "NIF-IVA",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city']; // legalForm vide à dessein, comme les autres sites du portefeuille

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
