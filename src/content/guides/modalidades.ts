import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* VERI*FACTU o no VERI*FACTU: RD 1007/2023, arts. 8, 12, 14, 15, 16 y 17 (sources.rd1007); Orden HAC/1177/2024,
   arts. 3, 9, 14, 16, 20 (sources.orden1177); FAQ de desarrolladores (sources.aeatFaq). */
const VF = K.P.verifactu, Q = K.P.qr;

export default defineGuide({
  id: 'modalidades', group: 'verifactu', order: 3,
  tool: 'modalidad',
  related: ['que-es', 'huella', 'requisitos', 'firma', 'lector'],
  sources: ['rd1007', 'orden1177', 'aeatFaq', 'aeatTecnica'],
  es: {
    slug: 'verifactu-o-no-verifactu',
    nav: 'VERI*FACTU o no VERI*FACTU', card: 'Las dos maneras de cumplir el reglamento, comparadas punto por punto',
    title: 'VERI*FACTU o no VERI*FACTU 2026: diferencias y cuál elegir',
    description: 'VERI*FACTU o no VERI*FACTU en 2026: envío de registros a la AEAT, firma, registro de eventos, QR, conexión y permanencia, comparados con el RD 1007/2023.',
    h1: 'VERI*FACTU o no VERI*FACTU: las dos maneras de cumplir',
    intro: 'Elige modalidad y dinos si siempre tienes conexión: el simulador te dice qué exige cada una a tu programa y qué verá tu cliente en la factura.',
    resume: `El RD 1007/2023 deja elegir entre dos maneras de cumplir. En la modalidad VERI*FACTU, regulada en su artículo 16, el programa envía a la Agencia Tributaria todos los registros de facturación de forma continuada y automática. A cambio, el reglamento presume que el sistema cumple por diseño los requisitos del artículo 8, no le obliga a firmar los registros, porque basta la huella, y la Orden HAC/1177/2024 lo libera del registro de eventos. La factura lleva bajo el QR la frase «${Q.textoAbajoVerifactu}» o «${Q.textoAbajoCorto}», y el cliente puede comprobar en la sede que consta. En la otra modalidad, que la norma llama no VERI*FACTU, los registros se quedan en el sistema del usuario, firmados electrónicamente con ${VF.firma}, junto a un registro de eventos encadenado; la Agencia Tributaria los obtiene si los requiere. Las dos son legales y las dos exigen huella y QR. Elegir VERI*FACTU tiene una consecuencia: según el artículo 16.5, la opción dura al menos hasta el final del año natural en que se hizo el primer envío. La aplicación gratuita de la AEAT siempre funciona como VERI*FACTU.`,
    faqs: [
      { q: '¿Cómo elijo la modalidad en mi programa?', a: 'No hay que presentar ningún formulario. El artículo 16.5 del reglamento entiende que optas por VERI*FACTU cuando tu sistema empieza a enviar sistemáticamente los registros a la sede de la Agencia Tributaria. En la práctica suele ser una opción de configuración del programa. Si eliges no VERI*FACTU, el sistema anota el inicio de ese funcionamiento en su registro de eventos.' },
      { q: '¿Qué pasa si se cae internet en la modalidad VERI*FACTU?', a: 'Sigues facturando. El sistema genera el registro y la factura en el momento, guarda los registros pendientes y los envía cuando vuelve la conexión. La Orden HAC/1177/2024 exige que reintente el envío al menos cada hora mientras falle. Tu factura lleva el QR desde el principio; el cliente simplemente no la verá en la sede hasta que llegue el envío.' },
      { q: '¿Puedo pasar de VERI*FACTU a no VERI*FACTU a mitad de año?', a: 'No. El artículo 16.5 del RD 1007/2023 dice que la opción por VERI*FACTU se mantiene al menos hasta el final del año natural en que hiciste el primer envío efectivo. Desde el 1 de enero siguiente puedes dejar de enviar. El paso contrario, de no VERI*FACTU a VERI*FACTU, sí puede hacerse en cualquier momento.' },
      { q: '¿Cuál de las dos modalidades conviene a un autónomo?', a: 'Para la mayoría, VERI*FACTU: el programa es más sencillo, no hace falta firmar cada registro y el cliente puede verificar la factura. La otra modalidad tiene sentido si facturas a menudo sin conexión o prefieres no enviar tus registros en el momento, a cambio de un sistema que firme, lleve registro de eventos y conserve todo para un posible requerimiento.' },
    ],
    body: (h) => `
<h2>Comparación punto por punto</h2>
${h.table(['', 'VERI*FACTU', 'No VERI*FACTU'], [
  ['Envío de los registros', 'Todos, de forma continuada y automática', 'Solo si la AEAT los requiere'],
  ['Firma electrónica de cada registro', 'No (art. 16.3)', `Sí, ${VF.firma} (art. 12; Orden, art. 14)`],
  ['Huella encadenada', 'Sí', 'Sí'],
  ['Registro de eventos', 'No (Orden, art. 3)', 'Sí (Orden, art. 9)'],
  ['Requisitos del artículo 8', 'Se presumen cumplidos (art. 16.2)', 'Hay que cumplirlos y poder demostrarlo'],
  ['Leyenda bajo el QR', `«${Q.textoAbajoCorto}»`, 'Ninguna'],
  ['Permanencia', 'Hasta el final del año natural (art. 16.5)', 'Sin permanencia'],
], 'RD 1007/2023 y Orden HAC/1177/2024.', ['l', 'l', 'l'])}
<p>La diferencia de fondo es dónde están los registros. En VERI*FACTU la Agencia Tributaria los tiene desde el principio, así que el ${h.src('rd1007', 'artículo 16.2 del RD 1007/2023')} presume que el sistema garantiza la integridad, la trazabilidad y la conservación, y le exime de la copia que regula el artículo 14.2. En la otra modalidad, el usuario es quien guarda la prueba: registros firmados, registro de eventos y capacidad de exportarlo todo en formato legible cuando lo pidan. En esta modalidad el sistema genera además, por cada seis horas de funcionamiento, un registro resumen de los eventos ocurridos, según el artículo 9 de la Orden.</p>
<p>Prueba las dos opciones:</p>
${h.mini('modalidad', { p: ['mod', 'red'], c: 'Comparador completo' })}
<h2>Cómo funciona el envío</h2>
<p>El ${h.src('orden1177', 'artículo 16 de la Orden HAC/1177/2024')} fija un control de flujo. Tras cada envío, el sistema espera el tiempo que indica la respuesta de la Agencia Tributaria, inicialmente ${h.n(VF.esperaSegundos)} segundos, o hasta reunir el máximo de registros por envío, ${h.n(VF.lotesMax)}, lo que ocurra antes. Si un envío falla, reintenta al menos cada ${h.n(VF.reintentoHoras)} hora. Por eso una factura recién emitida puede tardar un poco en aparecer en la sede, sin que haya ningún error. Si quedan registros pendientes, el sistema debe avisar de la incidencia e indicar cuántos faltan por enviar. Los detalles técnicos están en la ${h.src('aeatTecnica', 'información técnica de la AEAT')}.</p>
<h2>Lo que ve tu cliente</h2>
<p>En las dos modalidades la factura lleva el QR, pero apunta a servicios distintos. Si tu cliente escanea una factura VERI*FACTU, la sede le dice si consta y con qué datos: es la verificación que el ${h.src('rd1007', 'artículo 17')} pone en manos del receptor. Si escanea una no VERI*FACTU, la sede solo puede recoger los datos, porque no tiene el registro. Compruébalo con el ${h.a('lector', 'lector del QR')}. Cómo se firma un registro en la modalidad no VERI*FACTU se explica en ${h.a('firma', 'firmas electrónicas')}, y la huella común a las dos en el ${h.a('huella', 'calculador de la huella')}.</p>
`,
  },
  en: {
    slug: 'verifactu-vs-non-verifactu',
    nav: 'VERI*FACTU or non-VERI*FACTU', card: 'The two ways to meet the regulation, compared point by point',
    title: 'VERI*FACTU vs Non-VERI*FACTU 2026: Differences and Choice',
    description: 'VERI*FACTU vs non-VERI*FACTU in 2026: sending records to the AEAT, signature, event log, QR, connectivity and commitment compared under RD 1007/2023 rules.',
    h1: 'VERI*FACTU or non-VERI*FACTU: the two ways to comply',
    intro: 'Pick a mode and tell us whether you are always online: the simulator says what each mode demands of your software and what your customer will see on the invoice.',
    resume: `RD 1007/2023 lets you choose between two ways of complying. In VERI*FACTU mode, governed by its article 16, the software sends every invoice record to the Tax Agency continuously and automatically. In return, the regulation presumes the system meets the article 8 requirements by design, does not make it sign records, because the hash is enough, and Order HAC/1177/2024 frees it from the event log. The invoice carries under the QR the sentence “${Q.textoAbajoVerifactu}” or “${Q.textoAbajoCorto}”, and the customer can check on the website that it is on record. In the other mode, which the rules call non-VERI*FACTU, records stay in the user’s system, electronically signed with ${VF.firma}, alongside a chained event log; the Tax Agency obtains them if it asks. Both are legal and both require a hash and a QR. Choosing VERI*FACTU has one consequence: under article 16.5, the choice lasts at least until the end of the calendar year in which the first sending took place. The free AEAT app always works as VERI*FACTU.`,
    faqs: [
      { q: 'How do I choose the mode in my software?', a: 'There is no form to file. Article 16.5 of the regulation treats you as opting for VERI*FACTU once your system starts systematically sending records to the Tax Agency website. In practice it is usually a setting in the software. If you choose non-VERI*FACTU, the system notes the start of that operation in its event log.' },
      { q: 'What happens if the internet drops in VERI*FACTU mode?', a: 'You keep invoicing. The system creates the record and the invoice on the spot, stores pending records and sends them once the connection returns. Order HAC/1177/2024 requires it to retry at least hourly while sending fails. Your invoice carries the QR from the start; the customer simply will not see it on the website until the sending arrives.' },
      { q: 'Can I switch from VERI*FACTU to non-VERI*FACTU mid-year?', a: 'No. Article 16.5 of RD 1007/2023 says the VERI*FACTU option lasts at least until the end of the calendar year in which you made the first actual sending. From the following 1 January you may stop sending. The opposite move, from non-VERI*FACTU to VERI*FACTU, can be made at any time.' },
      { q: 'Which mode suits a self-employed person?', a: 'For most, VERI*FACTU: the software is simpler, there is no need to sign every record and the customer can verify the invoice. The other mode makes sense if you often invoice offline or would rather not send your records straight away, in exchange for a system that signs, keeps an event log and stores everything for a possible request.' },
    ],
    body: (h) => `
<h2>Point-by-point comparison</h2>
${h.table(['', 'VERI*FACTU', 'Non-VERI*FACTU'], [
  ['Sending records', 'All of them, continuously and automatically', 'Only if the AEAT asks'],
  ['Electronic signature of each record', 'No (art. 16.3)', `Yes, ${VF.firma} (art. 12; Order, art. 14)`],
  ['Chained hash', 'Yes', 'Yes'],
  ['Event log', 'No (Order, art. 3)', 'Yes (Order, art. 9)'],
  ['Article 8 requirements', 'Presumed met (art. 16.2)', 'Must be met and provable'],
  ['Caption under the QR', `“${Q.textoAbajoCorto}”`, 'None'],
  ['Commitment', 'Until the end of the calendar year (art. 16.5)', 'None'],
], 'RD 1007/2023 and Order HAC/1177/2024.', ['l', 'l', 'l'])}
<p>The underlying difference is where the records live. In VERI*FACTU the Tax Agency has them from the outset, so ${h.src('rd1007', 'article 16.2 of RD 1007/2023')} presumes the system guarantees integrity, traceability and retention, and spares it the copy governed by article 14.2. In the other mode the user holds the evidence: signed records, an event log and the ability to export everything in readable form when asked. In this mode the system also produces, for every six hours of operation, a summary record of the events that occurred, under article 9 of the Order. Whoever chooses it must therefore keep the signing certificate valid and renew it in time, or new records cannot be signed.</p>
<p>Try both options:</p>
${h.mini('modalidad', { p: ['mod', 'red'], c: 'Full comparison' })}
<h2>How sending works</h2>
<p>${h.src('orden1177', 'Article 16 of Order HAC/1177/2024')} sets up flow control. After each sending, the system waits for the time stated in the Tax Agency’s reply, initially ${h.n(VF.esperaSegundos)} seconds, or until it has gathered the maximum records per sending, ${h.n(VF.lotesMax)}, whichever comes first. If a sending fails, it retries at least every ${h.n(VF.reintentoHoras)} hour. That is why a freshly issued invoice may take a little while to appear on the website, with nothing wrong. If records are still pending, the system must flag the incident and say how many remain to be sent. The technical details are in the ${h.src('aeatTecnica', 'AEAT technical information')}.</p>
<h2>What your customer sees</h2>
<p>In both modes the invoice carries the QR, but it points to different services. If your customer scans a VERI*FACTU invoice, the website tells them whether it is on record and with which details: that is the check ${h.src('rd1007', 'article 17')} puts in the recipient’s hands. If they scan a non-VERI*FACTU invoice, the website can only collect the details, because it holds no record. Try it with the ${h.a('lector', 'QR reader')}. How a record is signed in non-VERI*FACTU mode is explained in ${h.a('firma', 'electronic signatures')}, and the hash shared by both modes in the ${h.a('huella', 'hash calculator')}.</p>
`,
  },
});
