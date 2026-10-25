import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { formatNumber } from '../../lib/format';

/* Requisitos del programa: RD 1007/2023 arts. 8 y 13 (sources.rd1007); Orden HAC/1177/2024 art. 15, contenido de la
   declaración responsable (sources.orden1177); LGT art. 29.2.j y 201 bis (sources.lgt). */
const VF = K.P.verifactu, SA = K.P.sanciones;

export default defineGuide({
  id: 'requisitos', group: 'verifactu', order: 4,
  tool: 'requisitos',
  related: ['elegir', 'sanciones', 'modalidades', 'huella', 'app-aeat'],
  sources: ['rd1007', 'orden1177', 'lgt', 'aeatSif'],
  es: {
    slug: 'requisitos-software-verifactu',
    nav: 'Requisitos del programa', card: 'Comprueba si tu programa de facturación trae lo que exige Verifactu',
    title: 'Requisitos software Verifactu 2026: declaración responsable',
    description: 'Requisitos del software Verifactu 2026: qué debe hacer tu programa de facturación, qué dice la declaración responsable del productor y cómo comprobarlo tú.',
    h1: 'Requisitos del programa Verifactu y declaración responsable',
    intro: 'Cinco preguntas sobre tu programa actual: la comprobación dice qué cumple, qué falta y qué pedir a tu proveedor antes de la fecha que te toca.',
    resume: `Un programa de facturación cumple Verifactu cuando garantiza la integridad, conservación, accesibilidad, legibilidad, trazabilidad e inalterabilidad de los registros de cada factura, como exige el artículo 8 del Real Decreto 1007/2023, y cuando su productor lo declara por escrito. Esa declaración responsable, regulada en el artículo 13 del reglamento y en el artículo 15 de la Orden HAC/1177/2024, empieza con el título «Declaración responsable del sistema informático de facturación» y recoge el nombre y el código del sistema, la versión exacta, sus componentes, si funciona solo como VERI*FACTU, el tipo de firma de los registros cuando no lo hace, los datos del productor y la fecha y el lugar de la firma. Debe verse dentro del propio programa, de forma rápida y sencilla, y entregarse al cliente al comprarlo. No existe una homologación ni un certificado de la Agencia Tributaria: el usuario confía en la declaración del productor y responde si usa un programa que no cumple. La sanción para el usuario es de ${formatNumber(SA.tenencia, 0, 'es')} euros por ejercicio según el artículo 201 bis de la Ley General Tributaria.`,
    faqs: [
      { q: '¿Dónde encuentro la declaración responsable de mi programa?', a: 'Dentro del propio programa, normalmente en el menú de ayuda, de información o de configuración. La Orden HAC/1177/2024 exige que esté accesible de forma rápida, fácil e intuitiva, legible e individualizada para cada versión. Si no la encuentras, pídela por escrito al proveedor: el artículo 13 del reglamento le obliga a entregarla al cliente y a conservar las de todas sus versiones.' },
      { q: '¿La Agencia Tributaria homologa o certifica los programas?', a: 'No. El reglamento no prevé una homologación previa por la Agencia Tributaria: es el productor quien certifica, mediante su declaración responsable, que el programa cumple la Ley General Tributaria, el reglamento y la orden. La Agencia Tributaria puede comprobarlo después, pedir información al productor y sancionarle. Desconfía de cualquier sello que diga que un programa está aprobado por Hacienda.' },
      { q: '¿Qué pasa si añado un módulo de otro fabricante a mi programa?', a: 'Cada componente cuenta. Según el artículo 15.4 de la Orden HAC/1177/2024, si el sistema se amplía con piezas de hardware o software de otros productores, cada uno debe aportar la declaración responsable de su ampliación y de cada versión. Lo mismo ocurre cuando el programa nace de varios componentes de distintos fabricantes. Guarda todas esas declaraciones junto a la del programa principal.' },
      { q: '¿Me sirve el programa si solo cumple la modalidad VERI*FACTU?', a: 'Sí, siempre que lo uses enviando los registros a la Agencia Tributaria. La declaración responsable indica si el sistema está hecho para funcionar exclusivamente como VERI*FACTU. En ese caso no necesita firmar los registros ni llevar el registro de eventos, pero tampoco te permitirá facturar sin enviar. Si necesitas trabajar sin conexión, busca uno que admita la otra modalidad.' },
    ],
    body: (h) => `
<h2>Lo que exige el reglamento al programa</h2>
${h.table(['Requisito', 'Qué significa en la práctica', 'Base'], [
  ['Integridad e inalterabilidad', 'Una factura emitida no se borra ni se edita: se corrige con otra', 'RD 1007/2023, art. 8.2'],
  ['Trazabilidad', 'Cada registro lleva la huella del anterior y forma una cadena', 'Orden HAC/1177/2024, arts. 7 y 13'],
  ['Conservación y accesibilidad', 'Los registros se guardan y se exportan cuando Hacienda los pide', 'RD 1007/2023, arts. 8 y 14'],
  ['QR en la factura', 'Código QR tributario y, en VERI*FACTU, su leyenda', 'Orden HAC/1177/2024, arts. 20 y 21'],
  ['Declaración responsable', 'El productor declara por escrito que el programa cumple', 'RD 1007/2023, art. 13'],
], 'Requisitos principales de un sistema informático de facturación.', ['l', 'l', 'l'])}
<p>El ${h.src('rd1007', 'artículo 8 del RD 1007/2023')} enumera seis garantías: integridad, conservación, accesibilidad, legibilidad, trazabilidad e inalterabilidad de los registros. Además, todo programa debe poder enviar los registros a la Agencia Tributaria de forma continuada y automática, aunque el usuario elija no hacerlo. Cuando no los envía, el programa firma cada registro con ${VF.firma} y lleva un registro de eventos que anota, por ejemplo, el inicio y el fin del funcionamiento, las anomalías detectadas y las exportaciones, como detalla el artículo 9 de la orden.</p>
<h2>Cómo leer la declaración responsable</h2>
<p>La ${h.src('orden1177', 'Orden HAC/1177/2024, artículo 15')}, fija su contenido mínimo y el orden de los datos. Fíjate en tres puntos. Primero, la versión: la declaración vale para una versión concreta, así que una actualización trae su propia declaración. Segundo, la indicación de si el programa funciona solo como VERI*FACTU. Tercero, si admite varios obligados tributarios en la misma instalación, algo que interesa a las gestorías que facturan por cuenta de sus clientes. Como anexo se recomienda una explicación de cómo cumple cada especificación técnica. Guarda una copia de cada declaración que recibas, versión a versión, junto a tus registros de facturación.</p>
<p>Comprueba también tu exposición si el programa no está adaptado cuando llegue tu fecha:</p>
${h.mini('sanciones', { p: ['rol', 'ej'], d: { rol: 'usuario' }, c: 'Simulador completo de sanciones' })}
<h2>Lo que puedes comprobar tú mismo</h2>
<p>Sin conocimientos técnicos se ven varias cosas: si la factura impresa lleva el QR con el texto «${K.P.qr.textoArriba}», si el programa te deja anular una factura emitida en lugar de borrarla, y si puedes exportar los registros. Para saber si la huella está bien calculada, el ${h.a('huella', 'calculador de la huella')} reproduce el algoritmo oficial. Si el programa falla en algo de esto, pide la versión adaptada; si tu proveedor no la tendrá a tiempo, mira los ${h.a('elegir', 'criterios para elegir otro programa')} o la ${h.a('app-aeat', 'aplicación gratuita de la AEAT')}. Las dos modalidades se comparan en ${h.a('modalidades', 'VERI*FACTU o no VERI*FACTU')}.</p>
`,
  },
  en: {
    slug: 'verifactu-software-requirements',
    nav: 'Software requirements', card: 'Check whether your invoicing software has what Verifactu requires',
    title: 'Verifactu Software Requirements 2026: Producer Declaration',
    description: 'Verifactu software requirements 2026: what your invoicing software must do, what the producer’s statement of compliance says and how you can check it yourself.',
    h1: 'Verifactu software requirements and the producer declaration',
    intro: 'Five questions about your current software: the check shows what it meets, what is missing and what to ask your provider before your date.',
    resume: `Invoicing software complies with Verifactu when it guarantees the integrity, storage, accessibility, legibility, traceability and unalterability of each invoice record, as article 8 of Royal Decree 1007/2023 requires, and when its producer states so in writing. That statement of compliance, governed by article 13 of the regulation and article 15 of Order HAC/1177/2024, opens with the heading “Declaración responsable del sistema informático de facturación” and lists the name and code of the system, the exact version, its components, whether it works only in VERI*FACTU mode, the signature type for records when it does not, the producer’s details and the date and place of signature. It must be visible inside the software itself, quickly and easily, and handed to the customer on purchase. There is no approval or certificate from the Spanish Tax Agency: the user relies on the producer’s statement and is liable for using software that does not comply. The fine for users is ${formatNumber(SA.tenencia, 0, 'en')} euros per financial year under article 201 bis of the General Tax Act.`,
    faqs: [
      { q: 'Where do I find my software’s statement of compliance?', a: 'Inside the software, usually in the help, about or settings menu. Order HAC/1177/2024 requires it to be quick, easy and intuitive to reach, legible and specific to each version. If you cannot find it, ask the provider in writing: article 13 of the regulation requires them to give it to customers and to keep the statements for every version.' },
      { q: 'Does the Tax Agency approve or certify software?', a: 'No. The regulation provides for no prior approval by the Tax Agency: the producer certifies, through its statement of compliance, that the software meets the General Tax Act, the regulation and the order. The Tax Agency can check afterwards, request information from the producer and fine it. Be wary of any badge claiming that software has been approved by the tax office.' },
      { q: 'What if I add a module from another vendor to my software?', a: 'Every component counts. Under article 15.4 of Order HAC/1177/2024, if the system is extended with hardware or software from other producers, each must supply a statement for its extension and for each version. The same applies when the software is built from components by different vendors. Keep all those statements alongside the main one.' },
      { q: 'Is software that only supports VERI*FACTU mode enough?', a: 'Yes, as long as you use it sending records to the Tax Agency. The statement says whether the system is built to work exclusively as VERI*FACTU. In that case it does not need to sign records or keep an event log, but it will not let you invoice without sending either. If you need to work offline, look for software that supports the other mode.' },
    ],
    body: (h) => `
<h2>What the regulation requires of the software</h2>
${h.table(['Requirement', 'What it means in practice', 'Basis'], [
  ['Integrity and unalterability', 'An issued invoice is not deleted or edited: it is corrected with another', 'RD 1007/2023, art. 8.2'],
  ['Traceability', 'Each record carries the hash of the previous one and forms a chain', 'Order HAC/1177/2024, arts. 7 and 13'],
  ['Storage and accessibility', 'Records are kept and exported when the tax office asks', 'RD 1007/2023, arts. 8 and 14'],
  ['QR on the invoice', 'Tax QR code and, in VERI*FACTU mode, its caption', 'Order HAC/1177/2024, arts. 20 and 21'],
  ['Statement of compliance', 'The producer states in writing that the software complies', 'RD 1007/2023, art. 13'],
], 'Main requirements for invoicing software.', ['l', 'l', 'l'])}
<p>${h.src('rd1007', 'Article 8 of RD 1007/2023')} lists six guarantees: integrity, storage, accessibility, legibility, traceability and unalterability of records. All software must also be able to send records to the Tax Agency continuously and automatically, even if the user chooses not to. When it does not send them, the software signs each record with ${VF.firma} and keeps an event log that notes, for example, when operation starts and stops, detected anomalies and exports, as article 9 of the order details.</p>
<h2>How to read the statement of compliance</h2>
<p>${h.src('orden1177', 'Order HAC/1177/2024, article 15')}, sets its minimum content and the order of the details. Look at three points. First, the version: the statement covers one specific version, so an update comes with its own statement. Second, whether the software works only as VERI*FACTU. Third, whether it supports several taxpayers in the same installation, which matters to accounting firms invoicing on behalf of clients. An annex explaining how each technical specification is met is recommended. Keep a copy of every statement you receive, version by version, with your invoicing records.</p>
<p>Also check your exposure if the software is not adapted when your date arrives:</p>
${h.mini('sanciones', { p: ['rol', 'ej'], d: { rol: 'usuario' }, c: 'Full penalty calculator' })}
<h2>What you can check yourself</h2>
<p>Without technical knowledge you can see several things: whether the printed invoice carries the QR with the words “${K.P.qr.textoArriba}”, whether the software lets you cancel an issued invoice rather than delete it, and whether you can export the records. To see whether the hash is computed correctly, the ${h.a('huella', 'hash calculator')} reproduces the official algorithm. If the software fails any of these checks, ask your provider for the adapted version and its statement; if your provider will not have it in time, see the ${h.a('elegir', 'criteria for choosing other software')} or the ${h.a('app-aeat', 'free AEAT app')}. The two modes are compared in ${h.a('modalidades', 'VERI*FACTU or non-VERI*FACTU')}.</p>
`,
  },
});
