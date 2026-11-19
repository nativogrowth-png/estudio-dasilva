/* ------------------------------------------------------------------
   Estudio Da Silva · ajustes rápidos de la maqueta.
   Para cambiar la promesa del hero: poné A, B o C en PROMESA_ACTIVA.
   (Para ver las otras sin editar nada: abrí la página con ?promesa=B o ?promesa=C)
------------------------------------------------------------------- */
window.SITE = {
  PROMESA_ACTIVA: 'A',
  PROMESAS: {
    A: { l1: 'Dedicate a tu negocio.', l2: 'De la DGI y el BPS me ocupo yo.' },
    B: { l1: 'Tus impuestos y sueldos al día,', l2: 'sin que tengas que pensar en ellos.' },
    C: { l1: 'Tu contadora de confianza,', l2: 'a un WhatsApp de distancia.' }
  },
  WHATSAPP: '59899950727',
  TELEFONO: '+59826220865',
  MAIL: 'marianela@estudiodasilva.uy',
  INSTAGRAM: 'https://www.instagram.com/estudiodasilvauy/',
  /* Mensajes precargados de WhatsApp, uno por botón (data-wa="clave") */
  WA_TEXTOS: {
    general: 'Hola Marianela, vengo de la web y quiero hacer una consulta',
    hero: 'Hola Marianela, vengo de la web y quiero consultar por mi negocio',
    sueldos: 'Hola Marianela, vengo de la web y quiero consultar por sueldos',
    impuestos: 'Hola Marianela, vengo de la web y quiero consultar por impuestos y declaraciones juradas',
    balances: 'Hola Marianela, vengo de la web y quiero consultar por un balance',
    asesoramiento: 'Hola Marianela, vengo de la web y quiero consultar por asesoramiento contable y fiscal',
    emprender: 'Hola Marianela, vengo de la web y quiero emprender, necesito acompañamiento',
    empresa: 'Hola Marianela, vengo de la web, tengo una empresa y quiero consultar',
    independiente: 'Hola Marianela, vengo de la web, trabajo por mi cuenta y quiero consultar',
    cambio: 'Hola Marianela, vengo de la web y quiero consultar por cambiar de estudio contable'
  }
};
