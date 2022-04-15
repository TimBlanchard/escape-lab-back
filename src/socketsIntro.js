const { dataIntro } = require('./dataMessages')
const { rooms } = require('./roomServer')

const userReadyIntro = (idRoom, socketID) => {
  const existingRoom = rooms[idRoom] || null

  if (!existingRoom) return { error: 'No Room' }

  return existingRoom.introReady(socketID)
}

const initSocketsIntro = (io, socket) => {
  socket.on('intro-recevedMessage', () => {
    const data = userReadyIntro(socket.idRoom, socket.id)

    // launch
    if (data.canSendNextMessage && dataIntro.length > data.indexMessage) {
      const infoMessage = dataIntro[data.indexMessage]
      setTimeout(() => {
        io.to(socket.idRoom).emit('intro-message', infoMessage)
      }, infoMessage.delayLastMilis)
    } else if (dataIntro.length <= data.indexMessage) {
      const lastMessage = dataIntro[data.indexMessage - 1]
      setTimeout(() => {
        io.to(socket.idRoom).emit('intro-startVideo')
      }, lastMessage?.endTimeMilis - lastMessage?.startTimeMilis)
    }
  })

  socket.on('intro-darkScene', () => {
    io.to(socket.idRoom).emit('intro-darkScene')
  })

  socket.on('intro-endVideo', () => {
    io.to(socket.idRoom).emit('buildEnigme', { stepGame: 'Enigme1' })
  })
}

module.exports = { initSocketsIntro }
