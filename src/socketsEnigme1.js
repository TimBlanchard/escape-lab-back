// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const initSocketsEnigme1 = (io, socket) => {
  // on recall
  socket.on('enigme1-recall', () => {
    io.to(socket.idRoom).emit('enigme1-recall')
  })
}

module.exports = { initSocketsEnigme1 }
