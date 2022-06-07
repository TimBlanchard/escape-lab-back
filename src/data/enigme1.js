const ENIGME1_RESPONSES = [
  '2', // 0-intro
  '2', // 0-wrong
  '12563', // 1-0 -> code client
  '12563', // '1-wrongCode' -> same before
  '2568', // 1-1 -> code double auth
  '2568', // '1-wrongCode -> same before
  '1', // 1-2
  '1', // '1-3-wrong'
  '36743', // 2-0 -> code porte
  '36743', // 1-wrongCode
  '4788', // 2-1 -> code triple auth
  null, // 2-2-end
]
const MESSAGE_NAME = 'La Porte Service'
const MESSAGE_NAME_FACTURE = 'Service telephonique'
const MESSAGES_LIST = [
  {
    isReceived: true,
    content: 'Votre code client est 12563',
  },
  {
    isReceived: true,
    content: 'Votre code de double auth est 2568',
  },
  {
    isReceived: true,
    content: 'Votre code de triple auth est 36743',
  },
  {
    isReceived: true,
    content: 'Votre facture téléphone a été débitée de {{time}}€. Appel surtaxé 40/minute.',
  },
]

const MESSAGE_NOT_RECALL = {
  contact: MESSAGE_NAME_FACTURE,
  message: 'Après une rapide analyse le numéro + 00 8 34 87 18 31 serait un appel suspect. Nous vons déconseillons de le rappeler.',
}

module.exports = {
  ENIGME1_RESPONSES,
  MESSAGE_NAME,
  MESSAGES_LIST,
  MESSAGE_NAME_FACTURE,
  MESSAGE_NOT_RECALL,
}
