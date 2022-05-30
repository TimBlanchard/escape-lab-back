const { setConfigEnigme3 } = require('./roomServer')

const initSocketsEnigme3 = (io, socket) => {
  socket.on('enigme3-config', () => {
    const config = setConfigEnigme3(socket.idRoom)
    io.to(socket.idRoom).emit('enigme3-config', config.config)
  })

  socket.on('enigme3-restart', () => {
    const config = setConfigEnigme3(socket.idRoom)
    io.to(socket.idRoom).emit('enigme3-restart', config.config)
  })
}

module.exports = { initSocketsEnigme3 }
