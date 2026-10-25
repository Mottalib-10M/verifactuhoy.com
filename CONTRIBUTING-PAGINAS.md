# Ajouter ou étoffer une page d'ES Verifactu

Cette notice s'adresse aux agents qui prolongent le site. Lisez-la en entier avant d'écrire, avec `~/Documents/GitHub/RECETTE-SITE.md` (§0, §3, §6, §7, §9.3, §11, §17.6, §21, §26).

## Principe

Une page = **un fichier** `src/content/guides/<id>.ts` (`defineGuide`). Ce fichier porte l'espagnol (`es`) et l'anglais (`en`) côte à côte : slug, titre, description, H1, chapeau, bloc citable (`resume`), FAQ, corps, sources, outil de tête et pages liées. L'`id` est le nom du fichier.

Routes, menus, sitemap, hreflang, llms.txt et schémas lisent ces fichiers. **Ne touchez à aucun fichier du cœur pour ajouter une page.** Ajoutez l'id dans `src/lib/planned.ts`.

## Les outils

| `tool` | Composant | Rôle |
|---|---|---|
| clé de `src/lib/tool-specs.ts` (`verifactu`, `modalidad`, `calendario`, `sanciones`, `requisitos`, `elegir`, `app`, `territorio`, `sii`, `b2b`, `estados`, `fe`, `face`, `formato`, `descarga`, `firma`, `simplificada`, `rectificativa`, `datos`, `hash`, `qrurl`) | `calc/SpecTool.tsx` | Simulateurs déclaratifs ; ce sont aussi les seuls admis en mini-simulateur (`h.mini`) |
| `lector` | `vf/Lector.tsx` | Lire le QR tributaire (image, caméra, URL) et ouvrir la page de cotejo de l'AEAT |
| `qrgen`, `huella` | `vf/QrGen.tsx`, `vf/Huella.tsx` | URL et QR (spécification AEAT 0.5.0) ; empreinte SHA-256 (document AEAT 0.1.2) |
| `creador` + `toolArg.preset` = `admin` / `empresa` | `vf/Creador.tsx` | Créer un Facturae 3.2.2 non signé |
| `visor` | `vf/Visor.tsx` | Ouvrir un Facturae (signé ou non) |
| `frise` | `vf/Calendario.tsx` + `ui/Frise.tsx` | Frise du calendrier Verifactu et B2B (RECETTE §17.6) |

Les moteurs sont dans `src/lib/engine/` : `sha256.ts`, `huella.ts`, `qr.ts`, `reglas.ts` (dates, délais ouvrés avec fériés nationaux, B2B, sanctions, SII, simplificada, rectificativa, FACe), `facturae.ts` (calcul, contrôle, XML, lecture). Fonctions pures, testées dans `tests/engine.test.ts`.

**Rien n'est envoyé** : aucun outil ne fait de requête réseau avec un fichier ou une saisie. Le seul lien sortant est celui, cliqué par le lecteur, vers la page de cotejo de l'AEAT.

## Les données

`src/data/params-2026.json` contient toutes les valeurs juridiques et techniques (dates du RD 1007/2023 modifié par le RDL 15/2025, montants de l'art. 201 bis LGT, seuil de 8 M€ et dates B2B, délais SII, plafonds de la factura simplificada, Facturae, fériés nationaux 2026 et 2027) et les **sources**, avec `retrieved_at`. Tout chiffre d'une page vient de là, par `K.P` / `h.P` ou `h.eur` / `h.day` / `h.n`.

Les fériés nationaux ne couvrent que 2026 et 2027 : au-delà, `plazoHabil` signale `fueraDeCalendario` et les outils le disent. Ajoutez chaque année la résolution du BOE.

## Vérification des fichiers générés

`bash scripts/valida-facturae.sh` télécharge le XSD officiel Facturae 3.2.2 et XML-DSig dans `.cache-raw/xsd/` (hors git) puis valide avec `xmllint` deux factures produites par le créateur. Résultat attendu : 1 test passé. Origine et licence des données de test : `tests/fixtures/ORIGEN.md`.

## Mise à jour

1. Surveiller le BOE (RD 1007/2023, Orden HAC/1177/2024, RD 238/2026, Orden HAC/1028/2026), la sede de l'AEAT (spécifications QR et huella, FAQ) et facturae.gob.es (version du format et de l'application).
2. Mettre à jour `params-2026.json`, relancer `npx vitest run`, `scripts/valida-facturae.sh` et `npm run check`.
3. Au 1er janvier, créer `params-<année>.json`, ajouter les fériés et relire les dates.

## Règles propres au site

- **Aucune autorité** : pas de logo de l'AEAT ni d'un ministère ; « Sitio independiente, no gubernamental » sous chaque H1.
- **Pas de conseil fiscal individuel**, pas de lien vers un éditeur de logiciel, ni affiliation ni formulaire commercial ; aucune marque de logiciel dans les pages.
- **Aucun nom de concurrent ni de moteur de recherche** ; `tests/pages.test.ts` les refuse.
- **Dates B2B** : elles sont calculées par le site (12 et 24 mois après l'entrée en vigueur de l'Orden HAC/1028/2026) ; les pages le disent.
- **Foral** : País Vasco et Navarra renvoient aux Haciendas forales, sans date non confirmée.
- **Pas de `textarea` ni d'`input type=email`** dans les outils (`check-premier-ecran`).
- **Licences** : jsQR (Apache-2.0), qrcode (MIT), @xmldom/xmldom (MIT), installés par npm.
