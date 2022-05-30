const { setConfigEnigme3 } = require('./roomServer')

const initSocketsEnigme3 = (io, socket) => {
  socket.on('enigme3-config', () => {
    const config = setConfigEnigme3(socket.idRoom)
    console.log(config, socket.idRoom)
    io.to(socket.idRoom).emit('enigme3-config', config.config)
  })
}

module.exports = { initSocketsEnigme3 }
