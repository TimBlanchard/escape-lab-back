const ENIGME1_RESPONSES = [
  '2', // 0-intro
  '2', // 0-wrong
  '12345', // 1-0 -> code client
  '1234', // 1-1 -> code double auth
  '1234', // '1-wrongCode -> same before
  '1', // 1-2
  '1', // '1-3-wrong'
  '12345', // 2-0 -> code porte
  '1234', // 2-1 -> code triple auth
  null, // 2-2-end
]
const MESSAGE_NAME = 'La Porte Service'
const MESSAGES_LIST = [
  {
    isReceived: true,
    content: 'Votre code client est 12345',
  },
  {
    isReceived: true,
    content: 'Votre code de double auth est 1234',
  },
  {
    isReceived: true,
    content: 'Votre code de triple auth est 12345',
  },
  {
    isReceived: true,
    content: 'Le code de la porte est 1234',
  },
]

module.exports = {
  ENIGME1_RESPONSES,
  MESSAGE_NAME,
  MESSAGES_LIST,
}
