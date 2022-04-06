const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const PORT = process.env.PORT || 5050
//Initialize new socket.io instance and pass the http server to it
const io = require('socket.io')(http)

const { initConnexion } = require('./socketsConnexion')
const { initKeys } = require('./keys')

app.use(cors())

io.on('connection', (socket) => {

  //====================//
  //     Connexions     //
  //====================//
  initConnexion(io, socket)
})


initKeys()

app.get('/', (req, res) => {
  res.send('Server is up and running')
})

http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`)
})
