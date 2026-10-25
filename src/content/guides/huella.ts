import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Huella (hash): Orden HAC/1177/2024, art. 13 (sources.orden1177); AEAT, « Algoritmo de cálculo de codificación de la
   huella o hash », v. 0.1.2 (sources.aeatHuella). Vectores oficiales en params.huella, probados en tests. */
const H = K.P.huella;

export default defineGuide({
  id: 'huella', group: 'herramientas', order: 3,
  tool: 'huella',
  related: ['generador-qr', 'lector', 'modalidades', 'requisitos', 'que-es'],
  sources: ['aeatHuella', 'orden1177', 'rd1007'],
  es: {
    slug: 'huella-hash-verifactu',
    nav: 'Huella o hash Verifactu', card: 'Calcula la huella SHA-256 de un registro de alta o de anulación con los ejemplos de la AEAT',
    title: 'Huella o hash Verifactu 2026: calculadora SHA-256 en línea',
    description: 'Huella o hash Verifactu 2026: calcula el SHA-256 de un registro de alta o de anulación, mira la cadena que se resume y compárala con los ejemplos de la AEAT.',
    h1: 'Huella o hash Verifactu: calcula el SHA-256 de un registro',
    intro: 'Carga un ejemplo de la Agencia Tributaria o escribe tus datos: la calculadora muestra la cadena que se resume y la huella resultante, y dice si coincide con la oficial.',
    resume: `La huella, o hash, es el resumen criptográfico que cada sistema informático de facturación añade a sus registros de alta y de anulación, según el artículo 12 del RD 1007/2023 y el artículo 13 de la Orden HAC/1177/2024. Se calcula con el algoritmo ${H.algoritmo} sobre una cadena formada por pares campo=valor unidos por el signo &. En un registro de alta entran ocho datos: NIF del emisor, serie y número, fecha de expedición, tipo de factura, cuota total, importe total, huella del registro anterior y fecha, hora y huso horario de generación. En uno de anulación, cinco. Como cada registro incluye la huella del anterior, los registros forman una cadena: si alguien cambia un céntimo de una factura ya registrada, su huella cambia y deja de coincidir con la que guarda el registro siguiente. El documento de la AEAT, versión ${H.docVersion}, publica tres ejemplos con su resultado. Esta calculadora los reproduce carácter por carácter y te deja cambiar cualquier dato para ver el efecto. Sirve a quien programa o audita un sistema; un usuario no tiene que calcular nada, porque su programa lo hace solo.`,
    faqs: [
      { q: '¿Qué huella lleva el primer registro de un sistema?', a: 'Ninguna en el campo de la huella anterior: la cadena incluye el nombre del campo seguido del signo igual y nada más. El primer ejemplo de la Agencia Tributaria es justamente ese caso. A partir del segundo registro, el campo lleva la huella completa del registro inmediatamente anterior, sea de alta o de anulación, y así se forma la cadena.' },
      { q: '¿Por qué mi huella no coincide con la de la AEAT?', a: 'Casi siempre por un detalle de formato: importes con coma o con un cero de más, fechas en otro orden, un espacio al final de un valor, otra hora en el campo de generación o el huso horario escrito de otra manera. La calculadora muestra la cadena exacta que resume; compárala con la tuya carácter por carácter y el fallo aparece enseguida.' },
      { q: '¿La huella sustituye a la firma electrónica de los registros?', a: 'Solo en la modalidad VERI*FACTU. El artículo 16.3 del RD 1007/2023 exime a esos sistemas de firmar los registros y les basta con calcular la huella, porque los registros ya están en la Agencia Tributaria. En la modalidad no VERI*FACTU hacen falta las dos cosas: la huella que encadena y la firma que identifica a quien genera cada registro.' },
    ],
    body: (h) => `
<h2>Los campos que entran en la huella</h2>
${h.table(['Orden', 'Registro de alta', 'Registro de anulación'], [
  ['1', 'IDEmisorFactura', 'IDEmisorFacturaAnulada'],
  ['2', 'NumSerieFactura', 'NumSerieFacturaAnulada'],
  ['3', 'FechaExpedicionFactura', 'FechaExpedicionFacturaAnulada'],
  ['4', 'TipoFactura', 'Huella'],
  ['5', 'CuotaTotal', 'FechaHoraHusoGenRegistro'],
  ['6', 'ImporteTotal', ''],
  ['7', 'Huella', ''],
  ['8', 'FechaHoraHusoGenRegistro', ''],
], `Campos y orden según el documento de la AEAT, versión ${H.docVersion}, y el artículo 13 de la Orden HAC/1177/2024.`, ['l', 'l', 'l'])}
<p>El ${h.src('orden1177', 'artículo 13 de la Orden HAC/1177/2024')} dice qué datos del registro se resumen, y el ${h.src('aeatHuella', 'documento técnico de la AEAT')} dice cómo. Cada dato se escribe con el nombre de su campo, el signo igual y el valor, y los pares se unen con el signo &. Los valores van sin espacios al principio ni al final, la cadena se codifica en UTF-8 y el resultado de ${H.algoritmo} se expresa en hexadecimal con letras mayúsculas: sesenta y cuatro caracteres. Un registro de alta del ejemplo oficial empieza así: <code>IDEmisorFactura=89890001K&NumSerieFactura=12345678/G33</code>.</p>
<h2>Por qué un céntimo cambia toda la huella</h2>
<p>Un buen algoritmo de resumen reacciona a cualquier cambio de la entrada con una salida completamente distinta, sin parecido con la anterior. Por eso no se puede retocar una factura y ajustar la huella a mano: habría que recalcular la del registro modificado y la de todos los que vienen detrás, y la del último ya puede estar en la Agencia Tributaria o firmada. Prueba a cambiar el importe del primer ejemplo oficial:</p>
${h.mini('hash', { p: ['imp', 'cuota'], c: 'Abrir la calculadora completa' })}
<h2>Huella, encadenamiento y registros de evento</h2>
<p>El ${h.src('rd1007', 'artículo 8.2 del RD 1007/2023')} exige que los registros estén encadenados para poder seguir su rastro del primero al último. La huella es la herramienta para ello. En la modalidad no VERI*FACTU, el sistema además lleva un registro de eventos, también encadenado con su propia huella, donde anota hechos como la detección de anomalías o la exportación de registros. Si el sistema detecta que una cadena se ha roto, debe avisar.</p>
<p>Para un usuario, la huella es invisible: no aparece en la factura ni en el QR. Lo que ve el cliente es el ${h.a('generador-qr', 'código QR')}, que puede comprobar con el ${h.a('lector', 'lector del QR')}. Las diferencias entre modalidades están en ${h.a('modalidades', 'VERI*FACTU o no VERI*FACTU')}.</p>
`,
  },
  en: {
    slug: 'verifactu-hash-calculator',
    nav: 'Verifactu hash calculator', card: 'Compute the SHA-256 hash of a registration or cancellation record using the AEAT examples',
    title: 'Verifactu Hash 2026: Online SHA-256 Calculator for Records',
    description: 'Verifactu hash 2026: compute the SHA-256 of a registration or cancellation record, see the exact string being hashed and compare it with the AEAT examples.',
    h1: 'Verifactu hash: compute the SHA-256 of an invoice record',
    intro: 'Load a Tax Agency example or type your own data: the calculator shows the string being hashed and the resulting hash, and says whether it matches the official one.',
    resume: `The hash, called huella in Spanish, is the cryptographic digest that every invoicing system adds to its registration and cancellation records, under article 12 of RD 1007/2023 and article 13 of Order HAC/1177/2024. It is computed with the ${H.algoritmo} algorithm over a string made of field=value pairs joined by the & sign. A registration record uses eight values: issuer tax ID, series and number, issue date, invoice type, total VAT, total amount, the previous record’s hash and the generation date, time and time zone offset. A cancellation record uses five. Because each record includes the previous hash, the records form a chain: if someone changes one cent on an invoice already recorded, its hash changes and no longer matches the one stored in the next record. The AEAT document, version ${H.docVersion}, publishes three examples with their results. This calculator reproduces them character for character and lets you change any value to see the effect. It is meant for people who build or audit a system; an ordinary user computes nothing, because the software does it on its own.`,
    faqs: [
      { q: 'What hash does the first record of a system carry?', a: 'None in the previous hash field: the string includes the field name followed by the equals sign and nothing else. The first Tax Agency example is exactly that case. From the second record onwards the field holds the full hash of the record immediately before, whether registration or cancellation, and that is how the chain forms.' },
      { q: 'Why does my hash differ from the AEAT result?', a: 'Almost always because of a formatting detail: amounts with a comma or an extra zero, dates in another order, a trailing space in a value, a different time in the generation field or the time zone written differently. The calculator shows the exact string it hashes; compare it with yours character by character and the fault shows up quickly.' },
      { q: 'Does the hash replace the electronic signature of records?', a: 'Only in VERI*FACTU mode. Article 16.3 of RD 1007/2023 spares those systems from signing records and lets them rely on the hash alone, because the records are already with the Tax Agency. In non-VERI*FACTU mode both are needed: the hash that chains and the signature that identifies who generated each record.' },
    ],
    body: (h) => `
<h2>The fields that go into the hash</h2>
${h.table(['Order', 'Registration record', 'Cancellation record'], [
  ['1', 'IDEmisorFactura', 'IDEmisorFacturaAnulada'],
  ['2', 'NumSerieFactura', 'NumSerieFacturaAnulada'],
  ['3', 'FechaExpedicionFactura', 'FechaExpedicionFacturaAnulada'],
  ['4', 'TipoFactura', 'Huella'],
  ['5', 'CuotaTotal', 'FechaHoraHusoGenRegistro'],
  ['6', 'ImporteTotal', ''],
  ['7', 'Huella', ''],
  ['8', 'FechaHoraHusoGenRegistro', ''],
], `Fields and order under the AEAT document, version ${H.docVersion}, and article 13 of Order HAC/1177/2024.`, ['l', 'l', 'l'])}
<p>${h.src('orden1177', 'Article 13 of Order HAC/1177/2024')} says which record values are hashed, and the ${h.src('aeatHuella', 'AEAT technical document')} says how. Each value is written as its field name, an equals sign and the value, and the pairs are joined with the & sign. Values are trimmed at both ends, the string is encoded in UTF-8 and the ${H.algoritmo} result is expressed in upper-case hexadecimal: sixty-four characters. A registration record from the official example starts like this: <code>IDEmisorFactura=89890001K&NumSerieFactura=12345678/G33</code>.</p>
<h2>Why one cent changes the whole hash</h2>
<p>A good digest algorithm reacts to any change in its input with a completely different output that bears no resemblance to the previous one. That is why nobody can touch up an invoice and adjust the hash by hand: they would have to recompute the hash of the changed record and of every record after it, and the last one may already be with the Tax Agency or signed. Try changing the amount of the first official example:</p>
${h.mini('hash', { p: ['imp', 'cuota'], c: 'Open the full calculator' })}
<h2>Hash, chaining and event records</h2>
<p>${h.src('rd1007', 'Article 8.2 of RD 1007/2023')} requires records to be chained so that their trail can be followed from first to last. The hash is the tool for that. In non-VERI*FACTU mode the system also keeps an event log, chained with its own hash, where it notes events such as detected anomalies or record exports. If the system detects that a chain is broken, it must raise a warning. Any correction is made through a later record, never by rewriting the original, so the first version of every invoice stays in the chain.</p>
<p>For a user the hash is invisible: it appears neither on the invoice nor in the QR. What the customer sees is the ${h.a('generador-qr', 'QR code')}, which they can check with the ${h.a('lector', 'QR reader')}. The differences between the modes are on ${h.a('modalidades', 'VERI*FACTU or non-VERI*FACTU')}.</p>
`,
  },
});
