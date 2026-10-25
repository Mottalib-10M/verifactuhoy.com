import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Sanciones: LGT art. 201 bis (añadido por la Ley 11/2021, en vigor el 11/10/2021), art. 29.2.j y art. 188.3
   (sources.lgt); fechas de adaptación: RD 1007/2023, disposición final cuarta (sources.rd1007, sources.rdl15).
   Importes en params.sanciones; cálculos con K.sancion (engine/reglas.ts, probado en tests). */
const S = K.P.sanciones, VF = K.P.verifactu;
const base = { motivo: 'alteracion' as const, tipos: 1, sistemas: 0, pronto: false };
const U2 = K.sancion({ ...base, rol: 'usuario', ejercicios: 2 });
const U2P = K.sancion({ ...base, rol: 'usuario', ejercicios: 2, pronto: true });
const P3 = K.sancion({ ...base, rol: 'fabricante', ejercicios: 1, tipos: 3 });
const C200 = K.sancion({ ...base, rol: 'fabricante', motivo: 'certificado', ejercicios: 1, sistemas: 200 });
const pct = Math.round(S.reduccionPronto * 100);

export default defineGuide({
  id: 'sanciones', group: 'herramientas', order: 7,
  tool: 'sanciones',
  related: ['requisitos', 'calendario', 'elegir', 'que-es', 'app-aeat'],
  sources: ['lgt', 'rd1007', 'rdl15'],
  es: {
    slug: 'sanciones-verifactu',
    nav: 'Sanciones Verifactu', card: 'Calcula la multa del artículo 201 bis por usar o vender un programa que no cumple',
    title: `Sanciones Verifactu 2026: multas de ${S.tenencia.toLocaleString('es-ES')} y ${S.fabricante.toLocaleString('es-ES')} euros`,
    description: 'Sanciones Verifactu 2026: calcula la multa del artículo 201 bis de la Ley General Tributaria para usuarios y productores de programas, por año y con rebaja.',
    h1: 'Sanciones Verifactu: cuánto cuesta un programa que no cumple',
    intro: 'Elige si usas el programa o lo produces, cuántos ejercicios y si pagarías en plazo: el simulador aplica el artículo 201 bis y la reducción por pronto pago.',
    resume: `Las sanciones de Verifactu están en el artículo 201 bis de la Ley General Tributaria, que añadió la Ley 11/2021 y está en vigor desde el ${S.vigorDesde.split('-').reverse().join('/')}. Castiga dos conductas, ambas como infracciones graves. La primera es producir o vender programas de facturación o contabilidad que permitan llevar contabilidades distintas, ocultar o alterar transacciones, que no cumplan las especificaciones técnicas o que no estén certificados: ${S.fabricante.toLocaleString('es-ES')} euros fijos por cada ejercicio con ventas y por cada tipo de programa, o ${S.sinCertificado.toLocaleString('es-ES')} euros por cada programa vendido sin certificado. La segunda es la tenencia, es decir, usar un programa no certificado cuando debería estarlo o uno certificado que se ha alterado: ${S.tenencia.toLocaleString('es-ES')} euros fijos por ejercicio. Son multas fijas, que no dependen de tu facturación ni del número de facturas. Si pagas en plazo y no recurres, el artículo 188.3 reduce la multa un ${pct} %. Para los usuarios la sanción solo tiene sentido desde la fecha en que su programa debe estar adaptado: antes del ${VF.sociedadesAntes.split('-').reverse().join('/')} para las sociedades y antes del ${VF.restoAntes.split('-').reverse().join('/')} para el resto.`,
    faqs: [
      { q: '¿Me pueden multar a la vez como usuario y como productor?', a: 'No por el mismo programa. El apartado 2 del artículo 201 bis dice que quien ya ha sido sancionado como productor o comercializador no puede ser sancionado además por la tenencia. Es el caso de una empresa que se programa su propio sistema de facturación: responde como productora, con la multa más alta, y no se le suma la de usuario.' },
      { q: '¿La multa de tenencia depende de cuántas facturas emito?', a: `No. Es una multa pecuniaria fija de ${S.tenencia.toLocaleString('es-ES')} euros por cada ejercicio en que se tenga el programa que no cumple, sin relación con el volumen de facturas ni con la cuota defraudada. Por eso pesa mucho más en un autónomo con pocas facturas que en una gran empresa. La reducción por pronto pago es la única rebaja que prevé la ley para este caso.` },
      { q: '¿Qué hago si mi proveedor no me da la declaración responsable?', a: 'Pídela por escrito: el artículo 13 del RD 1007/2023 obliga al productor a entregarla al cliente y a mostrarla en el propio programa, en cada versión. Si no llega a tiempo, cambia de programa antes de la fecha que te toca. Como alternativa gratuita y adaptada tienes la aplicación de facturación de la Agencia Tributaria.' },
      { q: '¿Cuándo se aplica la reducción del cuarenta por ciento?', a: 'Cuando ingresas el importe de la sanción en el plazo de pago voluntario del artículo 62.2 de la Ley General Tributaria, o en el aplazamiento con aval pedido dentro de ese plazo, y no recurres ni la sanción ni la liquidación. Si después recurres, Hacienda te exige el importe que se te había rebajado.' },
    ],
    body: (h) => `
<h2>Las dos infracciones del artículo 201 bis</h2>
${h.table(['Quién', 'Conducta', 'Multa fija', 'Se multiplica por'], [
  ['Productor o comercializador', 'Programa que permite alterar, ocultar o duplicar registros, o que no cumple las especificaciones', h.eur(S.fabricante), 'Ejercicios con ventas × tipos de programa'],
  ['Productor o comercializador', 'Programa vendido sin la certificación obligatoria', h.eur(S.sinCertificado), 'Programas vendidos sin certificado'],
  ['Usuario', 'Tener un programa no certificado o un programa certificado alterado', h.eur(S.tenencia), 'Ejercicios'],
], 'Artículo 201 bis, apartados 1, 2 y 4, de la Ley General Tributaria.', ['l', 'l', 'r', 'l'])}
<p>El ${h.src('lgt', 'artículo 201 bis de la Ley General Tributaria')} desarrolla la obligación del artículo 29.2.j: los programas que soportan la facturación o la contabilidad deben garantizar la integridad, conservación, accesibilidad, legibilidad, trazabilidad e inalterabilidad de los registros. El apartado 3 califica las dos infracciones como graves. En el caso de los usuarios, la certificación que exige el reglamento es la declaración responsable del productor, prevista en el ${h.src('rd1007', 'artículo 13 del RD 1007/2023')}.</p>
<h2>Ejemplos con los importes de la ley</h2>
<p>Un autónomo que mantiene durante dos ejercicios un programa que no cumple se expone a ${h.eur(U2.total)}; si paga en plazo y no recurre, a ${h.eur(U2P.total)}. Un productor que vende en un mismo ejercicio tres tipos distintos de programa que permiten alterar registros se expone a ${h.eur(P3.total)}. Uno que vende doscientas licencias sin la certificación obligatoria, a ${h.eur(C200.total)}. Calcula tu caso:</p>
${h.mini('sanciones', { p: ['rol', 'ej', 'pronto'], c: 'Simulador completo con todas las opciones' })}
<h2>Desde cuándo cuenta</h2>
<p>El artículo está en vigor desde el ${h.day(S.vigorDesde)}, pero a un usuario solo se le puede reprochar no tener un sistema adaptado desde la fecha en que está obligado a tenerlo. Tras el ${h.src('rdl15', 'Real Decreto-ley 15/2025')}, eso es antes del ${h.day(VF.sociedadesAntes)} para los contribuyentes del Impuesto sobre Sociedades y antes del ${h.day(VF.restoAntes)} para autónomos, comunidades de bienes y demás obligados; las fechas completas están en el ${h.a('calendario', 'calendario de Verifactu')}. Los productores, en cambio, debían ofrecer programas adaptados desde el ${h.day(VF.productoresDesde)} según nuestro cálculo.</p>
<p>La forma de evitar la sanción es sencilla: tener un programa con declaración responsable antes de tu fecha. El ${h.a('requisitos', 'repaso de requisitos del programa')} te dice qué comprobar, y ${h.a('elegir', 'cómo elegir un programa de facturación')} da criterios neutros para cambiar si hace falta. Guarda la declaración de cada versión que instales.</p>
`,
  },
  en: {
    slug: 'verifactu-penalties',
    nav: 'Verifactu penalties', card: 'Work out the article 201 bis fine for using or selling non-compliant software',
    title: `Verifactu Penalties 2026: Fines of €${S.tenencia.toLocaleString('en-GB')} and €${S.fabricante.toLocaleString('en-GB')}`,
    description: 'Verifactu penalties 2026: work out the fine under article 201 bis of the General Tax Act for software users and producers, per financial year, with reductions.',
    h1: 'Verifactu penalties: what non-compliant software can cost',
    intro: 'Choose whether you use or produce the software, how many financial years and whether you would pay on time: the simulator applies article 201 bis and the prompt payment cut.',
    resume: `Verifactu penalties are set out in article 201 bis of the Spanish General Tax Act, added by Law 11/2021 and in force since ${S.vigorDesde.split('-').reverse().join('/')}. It punishes two kinds of conduct, both as serious infringements. The first is producing or selling invoicing or accounting software that allows separate sets of books, hides or alters transactions, fails the technical specifications or lacks the required certification: a fixed ${S.fabricante.toLocaleString('en-GB')} euros per financial year with sales and per software type, or ${S.sinCertificado.toLocaleString('en-GB')} euros per copy sold without certification. The second is holding, meaning using software that is not certified when it should be, or certified software that has been altered: a fixed ${S.tenencia.toLocaleString('en-GB')} euros per financial year. These are fixed fines that do not depend on your turnover or invoice count. If you pay on time and do not appeal, article 188.3 cuts the fine by ${pct}%. For users a fine only makes sense from the date their software must be adapted: before ${VF.sociedadesAntes.split('-').reverse().join('/')} for companies and before ${VF.restoAntes.split('-').reverse().join('/')} for everyone else.`,
    faqs: [
      { q: 'Can I be fined both as user and as producer?', a: 'Not for the same software. Paragraph 2 of article 201 bis says that anyone already fined as producer or seller cannot also be fined for holding it. That covers a business that writes its own invoicing system: it answers as producer, with the higher fine, and the user fine is not added on top.' },
      { q: 'Does the holding fine depend on how many invoices I issue?', a: `No. It is a fixed fine of ${S.tenencia.toLocaleString('en-GB')} euros for each financial year in which the non-compliant software is held, unrelated to invoice volume or to any tax lost. That is why it weighs far more on a self-employed person with few invoices than on a large company. The prompt payment cut is the only reduction the law provides here.` },
      { q: 'What if my provider will not give me the declaration of conformity?', a: 'Ask for it in writing: article 13 of RD 1007/2023 requires the producer to hand it to the customer and display it in the software itself, in every version. If it does not arrive in time, switch software before your deadline. The Tax Agency invoicing app is a free, adapted alternative.' },
      { q: 'When does the forty per cent reduction apply?', a: 'When you pay the fine within the voluntary payment period of article 62.2 of the General Tax Act, or under a guaranteed deferral requested within that period, and you appeal neither the fine nor the assessment. If you appeal later, the tax office claims back the amount it had taken off.' },
    ],
    body: (h) => `
<h2>The two infringements in article 201 bis</h2>
${h.table(['Who', 'Conduct', 'Fixed fine', 'Multiplied by'], [
  ['Producer or seller', 'Software that allows records to be altered, hidden or duplicated, or fails the specifications', h.eur(S.fabricante), 'Years with sales × software types'],
  ['Producer or seller', 'Software sold without the required certification', h.eur(S.sinCertificado), 'Copies sold without certification'],
  ['User', 'Holding uncertified software or certified software that has been altered', h.eur(S.tenencia), 'Financial years'],
], 'Article 201 bis, paragraphs 1, 2 and 4, of the General Tax Act.', ['l', 'l', 'r', 'l'])}
<p>${h.src('lgt', 'Article 201 bis of the General Tax Act')} gives teeth to the duty in article 29.2.j: software supporting invoicing or accounting must guarantee the integrity, retention, accessibility, legibility, traceability and unalterability of records. Paragraph 3 classes both infringements as serious. For users, the certification required by the regulation is the producer’s declaration of conformity under ${h.src('rd1007', 'article 13 of RD 1007/2023')}.</p>
<h2>Examples with the statutory amounts</h2>
<p>A self-employed person who keeps non-compliant software for two financial years faces ${h.eur(U2.total)}; paying on time without appeal, ${h.eur(U2P.total)}. A producer that sells three different types of software allowing records to be altered in one year faces ${h.eur(P3.total)}. One that sells two hundred licences without the required certification, ${h.eur(C200.total)}. Work out your case:</p>
${h.mini('sanciones', { p: ['rol', 'ej', 'pronto'], c: 'Full simulator with every option' })}
<h2>From when it counts</h2>
<p>The article has been in force since ${h.day(S.vigorDesde)}, but a user can only be blamed for lacking an adapted system from the date they are required to have one. After ${h.src('rdl15', 'Royal Decree-law 15/2025')}, that is before ${h.day(VF.sociedadesAntes)} for corporate income taxpayers and before ${h.day(VF.restoAntes)} for the self-employed, joint ownerships and everyone else caught; the full dates are on the ${h.a('calendario', 'Verifactu timeline')}. Producers, by contrast, had to offer adapted software from ${h.day(VF.productoresDesde)} by our calculation.</p>
<p>Avoiding the fine is simple: have software with a declaration of conformity before your date. The ${h.a('requisitos', 'software requirements check')} tells you what to look for, and ${h.a('elegir', 'how to choose invoicing software')} gives neutral criteria for switching if needed. Keep the declaration for every version you install, because the producer must keep them too and the tax office may ask either of you. If your provider adapts the software through an update, check that the new version shows its own declaration before your deadline, not just a promise that it is coming.</p>
`,
  },
});
