// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const {
  getDataEnigme2, getNewOwnerDataEnigme2, newPopupEnigme2,
} = require('./roomServer')

const initSocketsEnigme2 = (io, socket) => {
  socket.on('sendPopups', () => {
    const dataPopups = getDataEnigme2(socket.idRoom).popups
    io.to(socket.idRoom).emit('sendPopups', dataPopups)

    const newPopup = () => {
      const newPopups = newPopupEnigme2(socket.idRoom)
      io.to(socket.idRoom).emit('sendPopups', newPopups.popups)

      return newPopups
    }

    for (let index = 0; index < dataPopups.length; index += 1) {
      setTimeout(() => {
        const data = newPopup()

        setTimeout(() => {
          const data2 = getNewOwnerDataEnigme2(socket.idRoom, 'bottom', data.idNewPopup)
          io.to(socket.idRoom).emit('sendPopups', data2)
        }, 3000)
      }, 2500 * (index + 1))
    }
  })

  // socket.on('popupIsReady', () => {
  //   console.log('popupIsReady')
  //   io.to(socket.idRoom).emit('sendPopupToPlayer')
  // })

  // socket.on('p2pPopup', () => {
  //   io.to(socket.idRoom).emit('popupTransfer')
  // })

  socket.on('enigme2-popupOwnerChanged', ({ direction, id }) => {
    const dataPopups = getNewOwnerDataEnigme2(socket.idRoom, direction, id)
    io.to(socket.idRoom).emit('sendPopups', dataPopups)
  })
}

module.exports = { initSocketsEnigme2 }
