const { STEPS_GAME } = require('./room')
const {
  userConnected, userDisconnected, setUserReady, setUserReadyEnigme, setStepGame,
} = require('./roomServer')

const IS_DEV = process.env.ENV === 'development'

const initConnexion = (io, socket) => {
  // connection user on socket
  socket.on('connection', () => {
    console.log('connection :', socket.id)
  })

  // connexion to Room
  socket.on('connectToRoom', ({ idRoom, isMainScreen, isPlayer }) => {
    // if (socket.idRoom) return

    const dataRoom = userConnected({
      idRoom, isMainScreen, isPlayer, socketID: socket.id,
    })

    // eslint-disable-next-line no-param-reassign
    socket.idRoom = dataRoom.idRoom
    socket.join(dataRoom.idRoom)
    io.to(dataRoom.idRoom).emit('userConnected', dataRoom)

    if (IS_DEV && dataRoom.listUsers?.length === 3 && dataRoom.idRoom === 'DEV001') {
      // CHANGE HERE TO GO
      setTimeout(() => {
        io.to(socket.idRoom).emit('startGame')
        setStepGame(socket.idRoom, 'Intro')
      }, 500)
    }
  })

  // on user disconnected
  socket.on('disconnect', () => {
    const data = userDisconnected({ socketID: socket.id, idRoom: socket.idRoom })

    console.log('userDisconnected', data, socket.idRoom)
    io.to(socket.idRoom).emit('userDisconnected', data)
  })

  // on user isReady
  socket.on('isReady', () => {
    const data = setUserReady({ socketID: socket.id, idRoom: socket.idRoom })

    io.to(socket.idRoom).emit('playerIsReady', data.isReadyPlayer)

    if (data.canStart) {
      io.to(socket.idRoom).emit('startGame')
      setStepGame(socket.idRoom, 'Intro')
    }
  })

  // is Ready new enigme
  socket.on('readyEnigme', () => {
    const data = setUserReadyEnigme({ socketID: socket.id, idRoom: socket.idRoom })

    if (data.canStart) {
      io.to(socket.idRoom).emit('startEnigme')
      setStepGame(socket.idRoom, 'Intro')
    }
  })

  // setStepGame
  socket.on('setStepGame', ({ stepGame }) => {
    if (!stepGame || !STEPS_GAME.includes(stepGame)) return

    setStepGame(socket.idRoom, stepGame)

    io.to(socket.idRoom).emit('setStepGame', { stepGame })
  })
}

module.exports = { initConnexion }
