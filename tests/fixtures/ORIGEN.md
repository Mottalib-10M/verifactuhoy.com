# Origen y licencia de los datos de prueba

Este dossier no contiene ningún fichero de terceros. Todo lo que usan las pruebas está generado por el propio sitio o
reproduce valores publicados como ejemplo en documentos oficiales.

| Dato de prueba | Origen | Licencia o régimen |
|---|---|---|
| Huellas de los tres registros (tests/engine.test.ts, `params-2026.json > huella.vector1..3`) | AEAT, « Detalle de las especificaciones técnicas para generación de la huella o hash de los registros de facturación », versión 0.1.2 (27/08/2024), ejemplos del documento | Valores numéricos de un documento oficial (art. 13 de la Ley de Propiedad Intelectual: las disposiciones y actos oficiales no son objeto de propiedad intelectual). Solo se copian los datos del ejemplo, no el documento. |
| URL del QR (NIF 89890001K, número 12345678&G33, 01-01-2024, 241.4) | AEAT, « Características del QR y especificaciones del servicio de cotejo de la factura », versión 0.5.0 (10/12/2025) | Ídem: datos del ejemplo oficial, entorno de pruebas de la AEAT. |
| Facturas Facturae de las pruebas | Generadas en cada ejecución por `construirXml` (src/lib/engine/facturae.ts) con datos ficticios (`EJEMPLO`) | Código del sitio. NIF y IBAN de ejemplo inventados o de formato público de prueba. |
| Esquema Facturae 3.2.2 y XML-DSig | Descargados en cada validación por `scripts/valida-facturae.sh` desde facturae.gob.es y w3.org a `.cache-raw/xsd/` | No se versionan en git (`.gitignore`). |

No se ha encontrado en facturae.gob.es una colección de facturas de ejemplo oficiales con licencia de reutilización
explícita (consulta del 25/10/2026); por eso las pruebas usan facturas propias validadas contra el esquema oficial.
