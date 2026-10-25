import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Factura rectificativa: RD 1619/2012 (sources.rd1619), art. 15 (causas, plazo de cuatro años, forma), art. 6.1.a
   (serie específica) y art. 4.1.b (simplificada rectificativa); claves R1 a R5 y métodos S/I de la Orden HAC/1177/2024
   (sources.orden1177). Plazo: params factura.rectificativaAnos, engine/reglas.ts limiteRectificar. */
const F = K.P.factura;
const DEV = '2022-12-31';
const LIM = K.limiteRectificar(DEV);

export default defineGuide({
  id: 'rectificativa', group: 'facturas', order: 1,
  tool: 'rectificativa',
  related: ['simplificada', 'requisitos-factura', 'que-es', 'firma', 'facturae'],
  sources: ['rd1619', 'orden1177', 'rd1007'],
  es: {
    slug: 'factura-rectificativa',
    nav: 'Factura rectificativa', card: 'Cuándo hacer una rectificativa, qué clave R1 a R5 lleva en Verifactu y hasta cuándo',
    title: 'Factura rectificativa 2026: cuándo, cómo y claves R1 a R5',
    description: 'Factura rectificativa en 2026: cuándo es obligatoria, plazo de cuatro años, serie propia, sustitución o diferencias y la clave R1 a R5 que lleva en Verifactu.',
    h1: 'Factura rectificativa: cuándo se hace, cómo y con qué clave',
    intro: 'Elige el motivo de la corrección y si corriges un tique: el simulador te da la clave de rectificativa de Verifactu, el método y el último día para rectificar.',
    resume: `Una factura emitida no se borra ni se edita: se corrige con otra. El artículo 15 del Reglamento de facturación obliga a expedir una factura rectificativa cuando la original no cumple los requisitos de contenido, cuando las cuotas de IVA se calcularon mal o cuando se produce alguna de las circunstancias del artículo 80 de la Ley del IVA que modifican la base imponible: devoluciones, descuentos posteriores, anulaciones, concurso del cliente o créditos incobrables. Hay que hacerla en cuanto se conoce el motivo y siempre antes de que pasen ${F.rectificativaAnos} años desde el devengo del impuesto o desde la circunstancia que la justifica. La rectificativa es una factura nueva, con su propia serie, que identifica la factura corregida y expresa la rectificación, bien por la diferencia, bien con los importes como quedan. Con Verifactu, el programa registra la rectificativa con una clave de motivo, de R1 a R5, y un método, sustitución o diferencias. Si la factura simplemente no debió existir, el programa genera un registro de anulación en lugar de borrarla.`,
    faqs: [
      { q: '¿Puedo anular una factura y hacer otra nueva con el mismo número?', a: 'No. La numeración de cada serie debe ser correlativa y una factura emitida no desaparece. Si la operación existió pero la factura tenía errores, emites una rectificativa en su serie propia. Si la factura no debió expedirse, en Verifactu el programa crea un registro de anulación que queda encadenado. En ningún caso se reutiliza el número.' },
      { q: '¿Cuál es la diferencia entre rectificar por sustitución y por diferencias?', a: 'En la rectificación por sustitución, la nueva factura recoge los importes completos como quedan después de corregir. En la rectificación por diferencias, solo indica la diferencia, positiva o negativa, respecto a la factura original. El artículo 15.5 del Reglamento admite las dos formas. En el registro de Verifactu el método se marca con la letra S o con la letra I.' },
      { q: '¿Necesito una rectificativa para cada factura con descuento por volumen?', a: 'No. El artículo 15.4 permite rectificar varias facturas en un único documento, siempre que se identifiquen todas. Cuando la corrección se debe a descuentos o bonificaciones por volumen de operaciones, ni siquiera hace falta identificar cada factura: basta con indicar el periodo al que se refiere el descuento. La rectificativa conjunta lleva también su número en la serie de rectificativas.' },
      { q: '¿Cambiar un tique por una factura completa es una rectificativa?', a: 'No, si el tique cumplía los requisitos del artículo 7.1. El artículo 15.6 dice que las facturas que se expiden en sustitución o canje de facturas simplificadas no son rectificativas. Solo lo serían si el tique tenía un error de contenido o de cuotas. En ese caso la clave de Verifactu para corregir una simplificada es la R5.' },
    ],
    body: (h) => `
<h2>Las claves de rectificativa en Verifactu</h2>
${h.table(['Clave', 'Motivo', 'Ejemplo'], [
  ['R1', 'Error fundado en derecho y artículo 80, apartados uno, dos y seis, de la Ley del IVA', 'Tipo de IVA mal aplicado, devolución de mercancía, descuento posterior'],
  ['R2', 'Artículo 80.tres: concurso del destinatario', 'El cliente entra en concurso de acreedores'],
  ['R3', 'Artículo 80.cuatro: créditos incobrables', 'Factura impagada que cumple los requisitos de incobrable'],
  ['R4', 'Resto de causas', 'Otros errores de la factura'],
  ['R5', 'Rectificativa de facturas simplificadas', 'Corrección de un tique'],
], 'Claves del campo de tipo de factura rectificativa de la Orden HAC/1177/2024.', ['l', 'l', 'l'])}
<p>El ${h.src('rd1619', 'artículo 15 del Reglamento de facturación')} define cuándo hay que rectificar; la ${h.src('orden1177', 'Orden HAC/1177/2024')} añade cómo se registra en un sistema adaptado a Verifactu. Cada rectificativa genera un registro de alta como cualquier factura, con su huella encadenada al registro anterior, su clave de motivo y la referencia a la factura corregida. Así la Agencia Tributaria puede seguir la historia completa de una operación sin que nada se borre.</p>
<h2>Plazo, serie y contenido</h2>
<p>El plazo es de ${h.n(F.rectificativaAnos)} años desde el devengo del IVA de la operación o, en los casos del artículo 80 de la Ley del IVA, desde que se produce la circunstancia. Una factura con devengo el ${h.day(DEV)} puede rectificarse hasta el ${h.day(LIM)}. Pasado ese momento ya no cabe rectificar, aunque el error sea evidente. Además, el artículo 6.1.a obliga a expedir las rectificativas en una serie específica, separada de la serie ordinaria.</p>
<p>La rectificativa debe cumplir los requisitos de contenido de una factura completa o de una simplificada, según el caso, y añadir los datos de la factura que corrige. Puede expresar el importe de la rectificación directamente, con su signo, o mostrar los importes tal como quedan, indicando también cuánto se ha rectificado. Si el error está en un tique, el ${h.src('rd1619', 'artículo 4.1.b')} permite rectificar también con una factura simplificada, sea cual sea el importe:</p>
${h.mini('simplificada', { p: ['imp', 'sector', 'rect'], d: { imp: 4500, rect: 'si' }, c: 'Comprobar si cabe una simplificada' })}
<h2>Rectificar, anular o no hacer nada</h2>
<p>No todo cambio requiere rectificativa. Si devuelves envases o mercancías y vuelves a vender al mismo cliente con el mismo tipo de IVA, el artículo 15.2 permite descontar lo devuelto en la siguiente factura. Si una factura se emitió por error y la operación nunca existió, en Verifactu se usa un registro de anulación, no una rectificativa. El programa debe impedir que borres o edites registros, y eso es parte de los ${h.a('que-es', 'requisitos de Verifactu')}.</p>
<p>Para revisar qué datos debe contener la nueva factura, consulta ${h.a('requisitos-factura', 'los requisitos de una factura')}. Si la factura corregida iba a la Administración en Facturae, la rectificativa también va en Facturae y firmada, como explica ${h.a('firma', 'firmar un Facturae')}. Y si corriges tiques con frecuencia, repasa ${h.a('simplificada', 'la factura simplificada')}.</p>
`,
  },
  en: {
    slug: 'corrective-invoice-spain',
    nav: 'Corrective invoice', card: 'When to issue a corrective invoice in Spain, its R1 to R5 code and the deadline',
    title: 'Corrective Invoice in Spain 2026: When, How, Codes R1 to R5',
    description: 'Spanish corrective invoices in 2026: when required, the four-year deadline, own series, substitution or differences, and the R1 to R5 code used in Verifactu.',
    h1: 'Corrective invoices in Spain: when, how and which code',
    intro: 'Choose the reason for the correction and whether you are correcting a receipt: the calculator gives the Verifactu corrective code, the method and the last day to correct.',
    resume: `An issued invoice is never deleted or edited in Spain: it is corrected with another one. Article 15 of the Invoicing Regulation requires a corrective invoice, or factura rectificativa, when the original does not meet the content requirements, when VAT was calculated wrongly, or when one of the events in article 80 of the VAT Act changes the taxable amount: returns, later discounts, cancellations, the customer's insolvency or bad debts. You must issue it as soon as you know the reason and always before ${F.rectificativaAnos} years have passed since the VAT became due or since the event that justifies it. The corrective invoice is a new invoice, in its own series, that identifies the corrected invoice and states the correction, either as the difference or with the amounts as they now stand. Under Verifactu the software records the corrective invoice with a reason code, R1 to R5, and a method, substitution or differences. If the invoice should simply never have existed, the software creates a cancellation record instead of deleting it.`,
    faqs: [
      { q: 'Can I cancel an invoice and issue a new one with the same number?', a: 'No. Numbering within each series must be consecutive and an issued invoice does not disappear. If the transaction happened but the invoice had errors, you issue a corrective invoice in its own series. If the invoice should never have been issued, under Verifactu the software creates a chained cancellation record. In no case is the number reused.' },
      { q: 'What is the difference between correcting by substitution and by differences?', a: 'In a correction by substitution the new invoice shows the full amounts as they stand after the correction. In a correction by differences it shows only the difference, positive or negative, from the original invoice. Article 15.5 of the Invoicing Regulation allows both. In the Verifactu record the method is marked with the letter S or the letter I.' },
      { q: 'Do I need a corrective invoice for every invoice with a volume discount?', a: 'No. Article 15.4 allows several invoices to be corrected in a single document, as long as all of them are identified. When the correction comes from volume discounts or rebates, you do not even need to identify each invoice: stating the period the discount covers is enough. The combined corrective invoice still takes its number in the corrective series.' },
      { q: 'Is swapping a till receipt for a full invoice a correction?', a: 'No, if the receipt met the requirements of article 7.1. Article 15.6 says that invoices issued to replace or exchange simplified invoices are not corrective invoices. They would only be corrective if the receipt had a content or VAT error. In that case the Verifactu code for correcting a simplified invoice is R5.' },
    ],
    body: (h) => `
<h2>Corrective codes under Verifactu</h2>
${h.table(['Code', 'Reason', 'Example'], [
  ['R1', 'Error in law and article 80(1), (2) and (6) of the VAT Act', 'Wrong VAT rate applied, returned goods, later discount'],
  ['R2', 'Article 80(3): recipient insolvency', 'The customer enters insolvency proceedings'],
  ['R3', 'Article 80(4): bad debts', 'An unpaid invoice that meets the bad debt conditions'],
  ['R4', 'Other causes', 'Other invoice errors'],
  ['R5', 'Correction of simplified invoices', 'Correcting a till receipt'],
], 'Codes for the corrective invoice type field in Order HAC/1177/2024.', ['l', 'l', 'l'])}
<p>${h.src('rd1619', 'Article 15 of the Invoicing Regulation')} sets out when to correct; ${h.src('orden1177', 'Order HAC/1177/2024')} adds how a Verifactu-compliant system records it. Each corrective invoice creates a registration record like any invoice, with its hash chained to the previous record, its reason code and a reference to the corrected invoice. That way the Tax Agency can follow the full history of a transaction without anything being erased.</p>
<h2>Deadline, series and content</h2>
<p>The deadline is ${h.n(F.rectificativaAnos)} years from when the VAT on the transaction became due or, in the article 80 cases, from when the event occurred. An invoice with a tax point of ${h.day(DEV)} can be corrected until ${h.day(LIM)}. After that, correction is no longer possible, however obvious the error. Article 6.1.a also requires corrective invoices to be issued in a specific series, separate from the ordinary one.</p>
<p>The corrective invoice must meet the content rules of a full or simplified invoice, as the case may be, and add the details of the invoice it corrects. It may state the amount of the correction directly, with its sign, or show the amounts as they now stand while also stating how much was corrected. If the error is on a receipt, ${h.src('rd1619', 'article 4.1.b')} allows the correction to be a simplified invoice too, whatever the amount:</p>
${h.mini('simplificada', { p: ['imp', 'sector', 'rect'], d: { imp: 4500, rect: 'si' }, c: 'Check whether a simplified invoice is allowed' })}
<h2>Correct, cancel or do nothing</h2>
<p>Not every change needs a corrective invoice. If containers or goods come back and you sell again to the same customer at the same VAT rate, article 15.2 lets you deduct the returns on the next invoice. If an invoice was issued by mistake and the transaction never happened, Verifactu uses a cancellation record, not a corrective invoice. The software must stop you from deleting or editing records, which is part of the ${h.a('que-es', 'Verifactu requirements')}.</p>
<p>To check which details the new invoice must contain, see ${h.a('requisitos-factura', 'Spanish invoice requirements')}. If the corrected invoice went to a public body in Facturae, the corrective one goes in signed Facturae too, as explained in ${h.a('firma', 'signing a Facturae file')}. And if you correct receipts often, read ${h.a('simplificada', 'the simplified invoice')}.</p>
`,
  },
});
