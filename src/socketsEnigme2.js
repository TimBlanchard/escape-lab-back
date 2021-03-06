// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const {
  getDataEnigme2,
  getSucessEnigme2,
  getNewOwnerDataEnigme2,
  newPopupEnigme2,
  getStepGame,
  setUserReady,
  restartEnigme2,
  setSettimeoutEnigme2,
} = require('./roomServer')

const TIME_BETWEEN_POPUPS = 4800
const TIME_AFTER_POPUPS = 4000
const TIME_AFTER_SORT = 5000

const initSocketsEnigme2 = (io, socket) => {
  socket.on('enigme2-getPopups', () => {
    const dataPopups = getDataEnigme2(socket.idRoom).popups

    io.to(socket.idRoom).emit('enigme2-getPopups', dataPopups)
  })

  socket.on('enigme2-sendPopups', () => {
    const dataPopups = getDataEnigme2(socket.idRoom).popups
    io.to(socket.idRoom).emit('enigme2-sendPopups', dataPopups)

    const newPopup = (duration) => {
      const newPopups = newPopupEnigme2(socket.idRoom, duration)
      io.to(socket.idRoom).emit('enigme2-sendPopups', newPopups.popups)

      return newPopups
    }

    const arraySetTimeout = []

    // send new popup each 2500ms
    const TIME_LAST_POPUS = TIME_BETWEEN_POPUPS * (dataPopups.length + 1)
    for (let index = 0; index < dataPopups.length; index += 1) {
      const time = 1000 + TIME_BETWEEN_POPUPS * index - (100 * index)

      arraySetTimeout.push(setTimeout(() => {
        const data = newPopup(TIME_BETWEEN_POPUPS + 800)

        setTimeout(() => {
          const data2 = getNewOwnerDataEnigme2(socket.idRoom, 'bottom', data.idNewPopup)
          io.to(socket.idRoom).emit('enigme2-sendPopups', data2)
        }, TIME_BETWEEN_POPUPS + 500)
      }, time))
    }

    // send end
    const timerEndEnigme = TIME_LAST_POPUS + TIME_AFTER_POPUPS
    io.to(socket.idRoom).emit('enigme2-timer', { timer: timerEndEnigme })
    arraySetTimeout.push(setTimeout(() => {
      const { popups } = getDataEnigme2(socket.idRoom)
      const success = getSucessEnigme2(socket.idRoom)
      io.to(socket.idRoom).emit('enigme2-endSort', { popups, success })

      // next enigme
      if (!success) return
      const stepGame = getStepGame(socket.idRoom)

      setTimeout(() => {
        io.to(socket.idRoom).emit('endEnigme', { stepGame })
      }, TIME_AFTER_SORT)
    }, timerEndEnigme))

    setSettimeoutEnigme2(socket.idRoom, arraySetTimeout)
  })

  socket.on('enigme2-readyRestart', () => {
    const data = setUserReady({ socketID: socket.id, idRoom: socket.idRoom })
    const { popups } = getDataEnigme2(socket.idRoom)
    restartEnigme2(socket.idRoom)

    if (data.canStart) {
      io.to(socket.idRoom).emit('show-fader', popups)
      setTimeout(() => {
        io.to(socket.idRoom).emit('enigme2-restart', popups)
      }, 1000)
    }
  })

  socket.on('enigme2-popupOwnerChanged', ({ direction, id }) => {
    const dataPopups = getNewOwnerDataEnigme2(socket.idRoom, direction, id)
    io.to(socket.idRoom).emit('enigme2-sendPopups', dataPopups)
  })
}

module.exports = { initSocketsEnigme2 }
