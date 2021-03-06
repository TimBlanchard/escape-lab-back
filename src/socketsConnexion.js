const { STEPS_GAME } = require('./room')
const {
  userConnected, userDisconnected, setUserReady, setUserReadyEnigme, getStepGame, setStepGame, restartEnigme2, restartEnigme1,
} = require('./roomServer')
const { setConfigEnigme3 } = require('./roomServer')

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

    if (dataRoom.error && idRoom !== 'dev1') {
      io.to(socket.id).emit('errorInputs', dataRoom)
      return
    }

    // eslint-disable-next-line no-param-reassign
    socket.idRoom = dataRoom.idRoom
    socket.join(dataRoom.idRoom)
    io.to(dataRoom.idRoom).emit('userConnected', dataRoom)

    //
    // If is reconnexion
    //
    if (dataRoom.isStart && dataRoom.stepGameNumber > 0 && dataRoom.stepGameNumber < 4) {
      switch (dataRoom.stepGameNumber) {
        case 1:
          io.to(socket.idRoom).emit('show-fader')
          restartEnigme1(socket.idRoom)

          setTimeout(() => {
            io.to(socket.idRoom).emit('enigme1-restart')
          }, 1000)
          break

        case 2:
          io.to(socket.idRoom).emit('show-fader')
          restartEnigme2(socket.idRoom)

          setTimeout(() => {
            io.to(socket.idRoom).emit('enigme2-restart')
          }, 1000)
          break

        case 3:
          // eslint-disable-next-line no-case-declarations
          const config = setConfigEnigme3(socket.idRoom)
          io.to(socket.idRoom).emit('show-fader')
          setTimeout(() => {
            io.to(socket.idRoom).emit('enigme3-restart', config.config)
          }, 1000)
          break

        default:
          console.log('Error restart on reconnexion')
          break
      }
    }

    //
    // DEV
    //
    if (IS_DEV && dataRoom.listUsers?.length === 3 && dataRoom.idRoom === 'dev1' && !dataRoom.stepGame) {
      // CHANGE HERE TO GO
      setTimeout(() => {
        io.to(socket.idRoom).emit('startGame')
        setStepGame(socket.idRoom, 0)
      }, 500)
    }
  })

  // on user disconnected
  const disconnected = () => {
    const data = userDisconnected({ socketID: socket.id, idRoom: socket.idRoom })

    console.log('userDisconnected', data, socket.idRoom)
    io.to(socket.idRoom).emit('userDisconnected', data)
  }
  socket.on('disconnect', disconnected)
  socket.on('leave', disconnected)

  // on user isReady
  socket.on('isReady', () => {
    const data = setUserReady({ socketID: socket.id, idRoom: socket.idRoom })

    io.to(socket.idRoom).emit('playerIsReady', data.isReadyPlayer)

    if (data.canStart) {
      io.to(socket.idRoom).emit('startGame')
      setStepGame(socket.idRoom, 0)
    }
  })

  //
  // Enigmes
  //

  // next Enigme
  socket.on('endEnigme', () => {
    const stepGame = getStepGame(socket.idRoom)

    io.to(socket.idRoom).emit('endEnigme', { stepGame })
  })

  // next Enigme
  socket.on('nextEnigme', () => {
    const data = setStepGame(socket.idRoom)
    console.log('nextEnigme', data)

    if (data.stepGame === 'Outro') {
      io.to(socket.idRoom).emit('playEndOutro')
      io.to(socket.idRoom).emit('endEnigme', { stepGame: data.stepGame })
      setTimeout(() => {
        io.to(socket.idRoom).emit('setStepGame', { stepGame: 'Outro', stepGameNumber: 4 })
      }, 500)
    } else {
      io.to(socket.idRoom).emit('buildEnigme', { stepGame: data.stepGame })
    }
  })

  // is Ready new enigme
  socket.on('readyEnigme', () => {
    const data = setUserReadyEnigme({ socketID: socket.id, idRoom: socket.idRoom })

    if (data.canStart) {
      io.to(socket.idRoom).emit('startEnigme')
    }
  })

  // is Ready For Tuto
  socket.on('readyTutoEnigme', () => {
    const data = setUserReady({ socketID: socket.id, idRoom: socket.idRoom })

    if (data.canStart) {
      io.to(socket.idRoom).emit('startEnigme')
    }
  })

  // setStepGame
  socket.on('setStepGame', ({ stepGame }) => {
    if (!stepGame || stepGame > STEPS_GAME.length) return

    const data = setStepGame(socket.idRoom, stepGame)

    io.to(socket.idRoom).emit('setStepGame', { stepGame: data.stepGame, stepGameNumber: data.stepGameNumber })
  })

  socket.on('endVideo', () => {
    io.to(socket.idRoom).emit('endVideo')
  })
}

module.exports = { initConnexion }
