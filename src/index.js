const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const PORT = process.env.PORT || 5050
//Initialize new socket.io instance and pass the http server to it
const io = require('socket.io')(http)

const { rooms, userConnected, userDisconnected, setUserReady, setStepGame } = require('./roomServer')

app.use(cors())


io.on('connection', (socket) => {

  //====================//
  //     Connexions     //
  //====================//

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
})

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true)

process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else if ( key.name === 'r') {
    console.log('============== ROOMS ==============')
    console.log(rooms)
    console.log('===================================')
  }
});
console.log('Press r to see rooms');


app.get('/', (req, res) => {
  res.send('Server is up and running')
})

http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`)
})
