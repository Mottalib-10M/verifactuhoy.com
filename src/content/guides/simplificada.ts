import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Factura simplificada: RD 1619/2012 (sources.rd1619), art. 4 (límites, lista del 4.2, exclusiones del 4.4), art. 7
   (contenido, cualificada del 7.2, series separadas); RD 238/2026, art. 4 (excluida de la B2B salvo cualificada);
   Orden HAC/1177/2024 (QR y tipo F2). Límites: params simplificada. */
const S = K.P.simplificada, Q = K.P.qr;

export default defineGuide({
  id: 'simplificada', group: 'facturas', order: 2,
  tool: 'simplificada',
  related: ['rectificativa', 'requisitos-factura', 'lector', 'fe-autonomos', 'que-es'],
  sources: ['rd1619', 'rd238', 'orden1177'],
  es: {
    slug: 'factura-simplificada',
    nav: 'Factura simplificada', card: 'Hasta qué importe vale un tique, qué datos lleva y cuándo pasa a cualificada',
    title: 'Factura simplificada 2026: límites, datos y tique con QR',
    description: 'Factura simplificada en 2026: hasta 400 o 3000 euros según la actividad, qué datos lleva, cuándo es cualificada y qué cambia con Verifactu y con la factura B2B.',
    h1: 'Factura simplificada: cuándo vale un tique y qué debe llevar',
    intro: 'Escribe el importe y tu actividad: el simulador dice si puedes emitir una factura simplificada o necesitas una completa, y cómo se registra en Verifactu.',
    resume: `La factura simplificada es el nombre legal del tique. El artículo 4 del Reglamento de facturación la permite cuando el importe no supera ${S.general} euros con IVA incluido, o ${S.sectores} euros en una lista cerrada de actividades: venta al por menor, venta a domicilio o ambulante, transporte de personas, hostelería y restauración, peluquería y estética, aparcamientos, instalaciones deportivas, tintorerías, autopistas de peaje y algunas más. También vale siempre para una rectificativa. No cabe en las entregas intracomunitarias ni en algunas operaciones con inversión del sujeto pasivo. Lleva menos datos que una factura completa: número, fecha, NIF y nombre del emisor, tipo de bien o servicio, tipo de IVA y contraprestación total. Si el cliente es una empresa y lo pide, debes añadir su NIF, su domicilio y la cuota de IVA separada: es la simplificada cualificada, que le permite deducir el IVA. Con Verifactu, cada tique emitido por un programa genera su registro y lleva su código QR. La factura electrónica B2B, en cambio, deja fuera las simplificadas que no sean cualificadas.`,
    faqs: [
      { q: '¿Un tique de caja registradora también tiene que cumplir Verifactu?', a: 'Sí, si la caja o el terminal funciona como sistema informático de facturación y el comercio está obligado a Verifactu. Cada tique es una factura simplificada, así que el programa debe crear su registro con huella y el tique debe llevar el código QR. Una caja que solo imprime importes sin guardar registros tendrá que cambiarse o actualizarse antes de la fecha que te corresponda.' },
      { q: '¿Qué es una factura simplificada cualificada?', a: 'Es un tique al que se añaden, a petición del cliente empresario o profesional, su NIF, su domicilio y la cuota de IVA consignada por separado, según el artículo 7.2 del Reglamento de facturación. Con esos datos el cliente puede deducir el IVA. A efectos de la factura electrónica B2B, estas simplificadas cualificadas sí deben emitirse en formato electrónico cuando llegue la obligación.' },
      { q: '¿Puedo usar la misma serie para tiques y facturas completas?', a: 'No, si en el mismo año natural emites los dos tipos. El artículo 7.1.a del Reglamento obliga en ese caso a llevar series separadas para las facturas simplificadas y para las completas. Las rectificativas, a su vez, van en su propia serie. Separar las series también ayuda a que tu programa encadene bien los registros de cada tipo de factura.' },
    ],
    body: (h) => `
<h2>Límites y actividades</h2>
${h.table(['Supuesto', 'Límite con IVA', 'Base'], [
  ['Cualquier actividad', h.eur(S.general), 'RD 1619/2012, art. 4.1.a'],
  ['Comercio minorista, hostelería, transporte de personas y demás del art. 4.2', h.eur(S.sectores), 'RD 1619/2012, art. 4.2'],
  ['Factura rectificativa', 'Sin límite', 'RD 1619/2012, art. 4.1.b'],
  ['Entregas intracomunitarias y otros casos del art. 4.4', 'Nunca simplificada', 'RD 1619/2012, art. 4.4'],
], 'Límites de la factura simplificada en el Reglamento de facturación.', ['l', 'l', 'l'])}
<p>La lista del ${h.src('rd1619', 'artículo 4.2')} es cerrada y está pensada para ventas a consumidores finales: ventas al por menor, ventas ambulantes y a domicilio, transporte de personas y equipajes, hostelería y restauración, salas de baile, peluquería e institutos de belleza, instalaciones deportivas, revelado de fotografías, aparcamientos, alquiler de películas, tintorería y lavandería, y autopistas de peaje. Fuera de ella, el límite general es de ${h.eur(S.general)}. La Agencia Tributaria puede autorizar otros casos cuando las prácticas de un sector dificulten poner todos los datos.</p>
<h2>Qué debe llevar un tique</h2>
<p>El ${h.src('rd1619', 'artículo 7.1')} enumera los datos: número y serie, fecha de expedición y, si es distinta, fecha de la operación, NIF y nombre o razón social del emisor, identificación del tipo de bien o servicio, tipo de IVA aplicado, opcionalmente con la expresión «IVA incluido», y contraprestación total. Si hay operaciones con tipos distintos, se separa la base de cada una. En las rectificativas se identifica la factura rectificada. Con Verifactu, el tique añade el QR con el texto «${Q.textoArriba}», y el programa lo registra como factura simplificada, con el tipo F2.</p>
<p>Si corriges un tique, la rectificativa lleva la clave R5. Prueba qué clave corresponde a cada caso:</p>
${h.mini('rectificativa', { p: ['causa', 'simp'], d: { simp: 'si' }, c: 'Ver todas las claves de rectificativa' })}
<h2>Tiques y factura electrónica B2B</h2>
<p>El ${h.src('rd238', 'artículo 4 del Real Decreto 238/2026')} excluye de la factura electrónica obligatoria las simplificadas del artículo 4 del Reglamento, salvo las cualificadas del artículo 7.2. Un bar seguirá dando tiques a los clientes que pagan un café; si un autónomo pide una factura con su NIF para deducir el IVA de una comida de trabajo, esa simplificada cualificada sí tendrá que ser electrónica cuando llegue la fecha del emisor. Las fechas por perfil están en ${h.a('fe-autonomos', 'la factura electrónica para autónomos')}.</p>
<p>Para comprobar que tu tique está bien emitido, el ${h.a('lector', 'lector del QR')} lee el código y lo envía a la página de cotejo de la Agencia Tributaria. Los datos de una factura completa se repasan en ${h.a('requisitos-factura', 'los requisitos de una factura')}, y las correcciones en ${h.a('rectificativa', 'la factura rectificativa')}.</p>
`,
  },
  en: {
    slug: 'simplified-invoice-spain',
    nav: 'Simplified invoice', card: 'Up to what amount a receipt is valid in Spain, its content and when it becomes qualified',
    title: 'Simplified Invoice in Spain 2026: Limits, Content, QR Code',
    description: 'Simplified invoices in Spain 2026: up to 400 or 3,000 euros by activity, what they must show, when they are qualified, and what Verifactu and B2B rules change.',
    h1: 'Simplified invoices in Spain: when a receipt is enough',
    intro: 'Enter the amount and your activity: the calculator says whether you may issue a simplified invoice or need a full one, and how it is recorded under Verifactu.',
    resume: `A simplified invoice, factura simplificada, is the legal name for a till receipt in Spain. Article 4 of the Invoicing Regulation allows one when the amount does not exceed ${S.general} euros including VAT, or ${S.sectores} euros in a closed list of activities: retail sales, door-to-door and street sales, passenger transport, hospitality and catering, hairdressing and beauty, car parks, sports facilities, dry cleaners, toll motorways and a few more. It is also always allowed for a corrective invoice. It is not allowed for intra-EU supplies or certain reverse-charge transactions. It carries fewer details than a full invoice: number, date, issuer tax ID and name, type of goods or services, VAT rate and total price. If the customer is a business and asks, you must add its tax ID, address and the VAT amount shown separately: this is the qualified simplified invoice, which lets the customer deduct the VAT. Under Verifactu, each receipt issued by software creates its record and carries its QR code. B2B e-invoicing, by contrast, leaves out simplified invoices that are not qualified.`,
    faqs: [
      { q: 'Does a cash register receipt also have to comply with Verifactu?', a: 'Yes, if the till or terminal works as invoicing software and the shop is subject to Verifactu. Each receipt is a simplified invoice, so the software must create its record with a hash and the receipt must carry the QR code. A till that only prints amounts without keeping records will need replacing or updating before your deadline.' },
      { q: 'What is a qualified simplified invoice?', a: 'It is a receipt to which, at the request of a business or professional customer, you add its tax ID, its address and the VAT amount shown separately, under article 7.2 of the Invoicing Regulation. With those details the customer can deduct the VAT. For B2B e-invoicing purposes, these qualified simplified invoices must be issued electronically once the mandate applies.' },
      { q: 'Can I use the same series for receipts and full invoices?', a: 'No, if you issue both kinds in the same calendar year. Article 7.1.a of the Regulation then requires separate series for simplified and full invoices. Corrective invoices in turn go in their own series. Keeping the series apart also helps your software chain the records of each invoice type correctly.' },
    ],
    body: (h) => `
<h2>Limits and activities</h2>
${h.table(['Case', 'Limit incl. VAT', 'Basis'], [
  ['Any activity', h.eur(S.general), 'RD 1619/2012, art. 4.1.a'],
  ['Retail, hospitality, passenger transport and others in art. 4.2', h.eur(S.sectores), 'RD 1619/2012, art. 4.2'],
  ['Corrective invoice', 'No limit', 'RD 1619/2012, art. 4.1.b'],
  ['Intra-EU supplies and other art. 4.4 cases', 'Never simplified', 'RD 1619/2012, art. 4.4'],
], 'Simplified invoice limits in the Invoicing Regulation.', ['l', 'l', 'l'])}
<p>The list in ${h.src('rd1619', 'article 4.2')} is closed and aimed at sales to final consumers: retail sales, street and door-to-door sales, passenger and luggage transport, hospitality and catering, dance halls, hairdressers and beauty salons, sports facilities, photo processing, car parks, film rental, dry cleaning and laundry, and toll motorways. Outside it, the general limit is ${h.eur(S.general)}. The Tax Agency may authorise other cases when a sector's practices make it hard to include every detail.</p>
<h2>What a receipt must show</h2>
<p>${h.src('rd1619', 'Article 7.1')} lists the details: number and series, issue date and, if different, the date of the transaction, issuer tax ID and name, the type of goods or services, the VAT rate applied, optionally with the words “IVA incluido”, and the total price. If there are transactions at different rates, the taxable amount of each is shown separately. Corrective receipts identify the corrected invoice. Under Verifactu the receipt adds the QR code with the words “${Q.textoArriba}”, and the software records it as a simplified invoice, type F2.</p>
<p>If you correct a receipt, the corrective invoice takes code R5. Try which code fits each case:</p>
${h.mini('rectificativa', { p: ['causa', 'simp'], d: { simp: 'si' }, c: 'See all corrective codes' })}
<h2>Receipts and B2B e-invoicing</h2>
<p>${h.src('rd238', 'Article 4 of Royal Decree 238/2026')} excludes article 4 simplified invoices from mandatory e-invoicing, except qualified ones under article 7.2. A bar will keep handing receipts to customers who pay for a coffee; if a self-employed person asks for an invoice with their tax ID to deduct the VAT on a business lunch, that qualified simplified invoice will have to be electronic once the issuer's date arrives. Dates by profile are on ${h.a('fe-autonomos', 'e-invoicing for the self-employed')}.</p>
<p>To check that your receipt is issued correctly, the ${h.a('lector', 'QR reader')} reads the code and sends it to the Tax Agency matching page. The details of a full invoice are covered in ${h.a('requisitos-factura', 'Spanish invoice requirements')}, and corrections in ${h.a('rectificativa', 'the corrective invoice')}.</p>
`,
  },
});
