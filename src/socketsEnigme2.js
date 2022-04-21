// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const {
  getDataEnigme2,
} = require('./roomServer')

const initSocketsEnigme2 = (io, socket) => {
  socket.on('sendPopups', () => {
    const dataPopups = getDataEnigme2.popups
    io.to(socket.idRoom).emit('sendPopups', dataPopups)
  })

  socket.on('popupIsReady', () => {
    console.log('popupIsReady')
    io.to(socket.idRoom).emit('sendPopupToPlayer')
  })

  socket.on('p2pPopup', () => {
    io.to(socket.idRoom).emit('popupTransfer')
  })
}

module.exports = { initSocketsEnigme2 }
