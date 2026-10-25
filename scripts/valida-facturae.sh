#!/usr/bin/env bash
# Descarga el esquema oficial Facturae 3.2.2 (facturae.gob.es) y el de XML-DSig (W3C) en .cache-raw/xsd
# (fuera de git), apunta el import a la copia local y lanza los tests: el test « valida contra el esquema
# oficial » genera dos Facturae con el creador y los valida con xmllint.
set -euo pipefail
cd "$(dirname "$0")/.."
D=.cache-raw/xsd
mkdir -p "$D"
XSD_URL=$(python3 -c "import json;print(json.load(open('src/data/params-2026.json'))['facturae']['xsd'])")
curl -fsSL -o "$D/Facturaev3_2_2.xsd" "$XSD_URL"
curl -fsSL -o "$D/xmldsig-core-schema.xsd" https://www.w3.org/TR/xmldsig-core/xmldsig-core-schema.xsd
sed -i.bak 's#schemaLocation="http://www.w3.org/TR/xmldsig-core/xmldsig-core-schema.xsd"#schemaLocation="xmldsig-core-schema.xsd"#' "$D/Facturaev3_2_2.xsd" && rm -f "$D/Facturaev3_2_2.xsd.bak"
grep -q 'schemaLocation="xmldsig-core-schema.xsd"' "$D/Facturaev3_2_2.xsd"
npx vitest run tests/engine.test.ts -t "esquema oficial"
