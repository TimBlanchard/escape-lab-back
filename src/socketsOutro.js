// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const initSocketsOutro = (io, socket) => {
  socket.on('outro-startMessages', () => {
    io.to(socket.idRoom).emit('outro-startMessages')

    // TODO start messages
  })
}

module.exports = { initSocketsOutro }
