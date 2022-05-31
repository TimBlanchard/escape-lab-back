// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const {
  getDataEnigme2,
  getSucessEnigme2,
  getNewOwnerDataEnigme2,
  newPopupEnigme2,
  getStepGame,
  setUserReady,
  restartEnigme2,
} = require('./roomServer')

const TIME_BETWEEN_POPUPS = 5000
const TIME_AFTER_POPUPS = 10000
const TIME_AFTER_SORT = 2000

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
      const { popups } = getDataEnigme2(socket.idRoom)
      const success = getSucessEnigme2(socket.idRoom)
      io.to(socket.idRoom).emit('enigme2-endSort', { popups, success })

      // next enigme
      if (!success) return
      const stepGame = getStepGame(socket.idRoom)

      setTimeout(() => {
        io.to(socket.idRoom).emit('endEnigme', { stepGame })
      }, TIME_AFTER_SORT)
    }, timerEndEnigme)
  })

  socket.on('enigme2-readyRestart', () => {
    const data = setUserReady({ socketID: socket.id, idRoom: socket.idRoom })
    const { popups } = getDataEnigme2(socket.idRoom)
    restartEnigme2(socket.idRoom)

    if (data.canStart) {
      // TODO : add timing ???
      io.to(socket.idRoom).emit('enigme2-restart', popups)
    }
  })

  socket.on('enigme2-popupOwnerChanged', ({ direction, id }) => {
    const dataPopups = getNewOwnerDataEnigme2(socket.idRoom, direction, id)
    io.to(socket.idRoom).emit('enigme2-sendPopups', dataPopups)
  })
}

module.exports = { initSocketsEnigme2 }
