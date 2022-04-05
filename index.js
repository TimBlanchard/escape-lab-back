const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const PORT = process.env.PORT || 5050
//Initialize new socket.io instance and pass the http server to it
const io = require('socket.io')(http)

const { userConnected, userDisconnected } = require('./room')

app.use(cors())


io.on('connection', (socket) => {
  socket.on('connection', () => {
    console.log('connection :', socket.id)
  })

  socket.on('connectToRoom', ({idRoom, isMainScreen, isPlayer}) => {
    if (socket.idRoom) return

    // console.log('Connect to room', {idRoom, isMainScreen, isPlayer, socketID: socket.id})
    const dataRoom = userConnected({idRoom, isMainScreen, isPlayer, socketID: socket.id})
    console.log('idRoom : ', dataRoom)

    socket.idRoom = dataRoom.idRoom
    socket.join(dataRoom.idRoom)
    io.to(dataRoom.idRoom).emit('userConnected', dataRoom)
  })
  
  socket.on('sendMessage', () => {
  
  })
  
  socket.on('disconnect', () => {
    console.log({ socketID : socket.id, idRoom: socket.idRoom})
    const data = userDisconnected({ socketID : socket.id, idRoom: socket.idRoom})

    console.log('userDisconnected', data, socket.idRoom)
    io.to(socket.idRoom).emit('userDisconnected', data)
  })
})

app.get('/', (req, res) => {
  res.send('Server is up and running')
})

http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`)
})
