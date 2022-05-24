// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const {
  getDataEnigme2, getNewOwnerDataEnigme2, newPopupEnigme2, getStepGame,
} = require('./roomServer')

const TIME_BETWEEN_POPUPS = 2500
const TIME_AFTER_POPUPS = 10000

const initSocketsEnigme2 = (io, socket) => {
  socket.on('sendPopups', () => {
    const dataPopups = getDataEnigme2(socket.idRoom).popups
    io.to(socket.idRoom).emit('sendPopups', dataPopups)

    const newPopup = () => {
      const newPopups = newPopupEnigme2(socket.idRoom)
      io.to(socket.idRoom).emit('sendPopups', newPopups.popups)

      return newPopups
    }

    // send new popup each 2500ms
    for (let index = 0; index < dataPopups.length; index += 1) {
      setTimeout(() => {
        const data = newPopup()

        setTimeout(() => {
          const data2 = getNewOwnerDataEnigme2(socket.idRoom, 'bottom', data.idNewPopup)
          io.to(socket.idRoom).emit('sendPopups', data2)
        }, TIME_BETWEEN_POPUPS + 500)
      }, TIME_BETWEEN_POPUPS * (index + 1))
    }

    // send end
    setTimeout(() => {
      io.to(socket.idRoom).emit('enigme2-endSort', getDataEnigme2(socket.idRoom).popups)

      // next enigme
      const stepGame = getStepGame(socket.idRoom)

      io.to(socket.idRoom).emit('endEnigme', { stepGame })
    }, TIME_BETWEEN_POPUPS * (dataPopups.length + 1) + TIME_AFTER_POPUPS)
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
