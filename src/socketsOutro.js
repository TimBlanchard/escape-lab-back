// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const { dataOutro } = require('./dataMessages')
const { rooms } = require('./roomServer')

const userReadyOutro = (idRoom, socketID) => {
  const existingRoom = rooms[idRoom] || null

  if (!existingRoom) return { error: 'No Room' }

  return existingRoom.introReady(socketID)
}

const initSocketsOutro = (io, socket) => {
  // eslint-disable-next-line consistent-return
  socket.on('outro-startMessages', () => {
    const existingRoom = rooms[socket.idRoom] || null

    if (!existingRoom) return { error: 'No Room' }
    existingRoom.introIndexMessage = -1

    io.to(socket.idRoom).emit('outro-startMessages')
  })

  socket.on('outro-recevedMessage', () => {
    const data = userReadyOutro(socket.idRoom, socket.id)

    // launch
    if (data.canSendNextMessage && dataOutro.length > data.indexMessage) {
      const infoMessage = dataOutro[data.indexMessage]
      setTimeout(() => {
        io.to(socket.idRoom).emit('outro-message', infoMessage)
      }, infoMessage.delayLastMilis)
    } else if (dataOutro.length <= data.indexMessage) {
      const lastMessage = dataOutro[data.indexMessage - 1]
      setTimeout(() => {
        io.to(socket.idRoom).emit('outro-end')
      }, lastMessage?.endTimeMilis - lastMessage?.startTimeMilis)
    }
  })
}

module.exports = { initSocketsOutro }
