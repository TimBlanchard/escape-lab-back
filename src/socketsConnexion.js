const { userConnected, userDisconnected, setUserReady, setStepGame } = require('./roomServer')

const initConnexion = (io, socket) => {
  // connection user on socket
  socket.on('connection', () => {
    console.log('connection :', socket.id)
  })
  
  //connexion to Room
  socket.on('connectToRoom', ({idRoom, isMainScreen, isPlayer}) => {
    if (socket.idRoom) return

    const dataRoom = userConnected({idRoom, isMainScreen, isPlayer, socketID: socket.id})

    socket.idRoom = dataRoom.idRoom
    socket.join(dataRoom.idRoom)
    io.to(dataRoom.idRoom).emit('userConnected', dataRoom)
  })
    
  // on user disconnected
  socket.on('disconnect', () => {
    console.log({ socketID : socket.id, idRoom: socket.idRoom})
    const data = userDisconnected({ socketID : socket.id, idRoom: socket.idRoom})

    console.log('userDisconnected', data, socket.idRoom)
    io.to(socket.idRoom).emit('userDisconnected', data)
  })

  // on user isReady
  socket.on('isReady', () => {
    console.log('isReady')
    const data = setUserReady({ socketID : socket.id, idRoom: socket.idRoom})

    console.log(data)
    if (data.canStart) {
      io.to(socket.idRoom).emit('startGame')
      setStepGame(socket.idRoom, 'Intro')
    } else {
      io.to(socket.idRoom).emit('playerIsReady')
    }
  })


  // setStepGame
  socket.on('setStepGame', ({ stepGame }) => {
    if (!stepGame || !['Outro', 'Enigme1', 'Enigme2', 'Enigme3', 'Outro'].includes(stepGame)) return

    setStepGame(socket.idRoom, stepGame)

    io.to(socket.idRoom).emit('setStepGame', { stepGame })
  })
}

module.exports = { initConnexion }