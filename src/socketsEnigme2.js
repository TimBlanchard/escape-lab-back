// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const {
  getDataEnigme2, getNewOwnerDataEnigme2, newPopupEnigme2, getStepGame,
} = require('./roomServer')

const TIME_BETWEEN_POPUPS = 6000
const TIME_AFTER_POPUPS = 12000

const initSocketsEnigme2 = (io, socket) => {
  socket.on('enigme2-sendPopups', () => {
    const dataPopups = getDataEnigme2(socket.idRoom).popups
    io.to(socket.idRoom).emit('enigme2-sendPopups', dataPopups)

    const newPopup = () => {
      const newPopups = newPopupEnigme2(socket.idRoom)
      io.to(socket.idRoom).emit('enigme2-sendPopups', newPopups.popups)

      return newPopups
    }

    // send new popup each 2500ms
    for (let index = 0; index < dataPopups.length; index += 1) {
      setTimeout(() => {
        const data = newPopup()

        setTimeout(() => {
          const data2 = getNewOwnerDataEnigme2(socket.idRoom, 'bottom', data.idNewPopup)
          io.to(socket.idRoom).emit('enigme2-sendPopups', data2)
        }, TIME_BETWEEN_POPUPS + 500)
      }, TIME_BETWEEN_POPUPS * (index + 1))
    }

    // send end
    const timerEndEnigme = TIME_BETWEEN_POPUPS * (dataPopups.length + 1) + TIME_AFTER_POPUPS
    io.to(socket.idRoom).emit('enigme2-timer', { timer: timerEndEnigme })
    setTimeout(() => {
      io.to(socket.idRoom).emit('enigme2-endSort', getDataEnigme2(socket.idRoom).popups)

      // next enigme
      const stepGame = getStepGame(socket.idRoom)

      io.to(socket.idRoom).emit('endEnigme', { stepGame })
    }, timerEndEnigme)
  })

  socket.on('enigme2-popupOwnerChanged', ({ direction, id }) => {
    const dataPopups = getNewOwnerDataEnigme2(socket.idRoom, direction, id)
    io.to(socket.idRoom).emit('enigme2-sendPopups', dataPopups)
  })
}

module.exports = { initSocketsEnigme2 }
