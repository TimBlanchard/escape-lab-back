// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const {
  getDataEnigme2, getNewOwnerDataEnigme2,
} = require('./roomServer')

const initSocketsEnigme2 = (io, socket) => {
  socket.on('sendPopups', () => {
    const dataPopups = getDataEnigme2(socket.idRoom).popups
    console.log('dataPopups', dataPopups)
    io.to(socket.idRoom).emit('sendPopups', dataPopups)
  })

  socket.on('popupIsReady', () => {
    console.log('popupIsReady')
    io.to(socket.idRoom).emit('sendPopupToPlayer')
  })

  socket.on('p2pPopup', () => {
    io.to(socket.idRoom).emit('popupTransfer')
  })

  socket.on('enigme2-popupOwnerChanged', ({ direction, id }) => {
    const dataPopups = getNewOwnerDataEnigme2(socket.idRoom, direction, id)
    io.to(socket.idRoom).emit('sendPopups', dataPopups)
  })
}

module.exports = { initSocketsEnigme2 }
