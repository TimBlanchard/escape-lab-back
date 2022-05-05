const { rooms, enigme1EnteredNumber } = require('./roomServer')

const initSocketsEnigme1 = (io, socket) => {
  // on recall
  socket.on('enigme1-recall', () => {
    io.to(socket.idRoom).emit('enigme1-recall')

    const existingRoom = rooms[socket.idRoom] || null
    if (!existingRoom) return

    existingRoom.setRecall()
  })

  socket.on('enigme1-enteredNumber', (v) => {
    const data = enigme1EnteredNumber(socket.idRoom, v)

    if (!data.send) return

    io.to(socket.idRoom).emit('enigme1-action', data)
  })
}

module.exports = { initSocketsEnigme1 }
