const {
  rooms, enigme1EnteredNumber, enigme1End, getStepGame,
} = require('./roomServer')

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

  socket.on('enigme1-end', () => {
    const data = enigme1End(socket.idRoom)

    io.to(socket.idRoom).emit('enigme1-end', data)

    setTimeout(() => {
      const stepGame = getStepGame(socket.idRoom)

      io.to(socket.idRoom).emit('endEnigme', { stepGame })
    }, 4000)
  })
}

module.exports = { initSocketsEnigme1 }
