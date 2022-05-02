const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')

const PORT = process.env.PORT || 5050
// Initialize new socket.io instance and pass the http server to it
const io = require('socket.io')(http)

const { initConnexion } = require('./socketsConnexion')

const { initKeys } = require('./keys')
const { initSocketsIntro } = require('./socketsIntro')
const { initSocketsOutro } = require('./socketsOutro')
const { initSocketsEnigme1 } = require('./socketsEnigme1')
const { initSocketsEnigme2 } = require('./socketsEnigme2')
const { initSocketsEnigme3 } = require('./socketsEnigme3')

app.use(cors())

io.on('connection', (socket) => {
  // connexion
  initConnexion(io, socket)

  // intro
  initSocketsIntro(io, socket)

  // Enigme1
  initSocketsEnigme1(io, socket)
  // Enigme2
  initSocketsEnigme2(io, socket)
  // Enigme3
  initSocketsEnigme3(io, socket)

  // outro
  initSocketsOutro(io, socket)
})

initKeys()

app.get('/', (req, res) => {
  res.send('Server is up and running cool !')
})

http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`)
})
