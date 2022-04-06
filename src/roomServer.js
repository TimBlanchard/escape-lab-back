const rooms = []

const { generateUID } = require('./helpers/generateUID')

const { Room } = require('./room')

const userConnected = (props) => {
  // {room, isMainScreen, isPlayer}
  const {idRoom, socketID} = props

  const existingRoom = rooms.find(roomObj => roomObj.id.trim().toLowerCase() === idRoom?.trim()?.toLowerCase())

  if (existingRoom) {
    return existingRoom.addUser(props)
  } else {
    const idRoom = generateUID()
    const room = new Room(idRoom, socketID)
    rooms.push(room)

    return { idRoom, listUsers: room.users, newUser: { type: 'mainScreen', socketID }, isStart: room.isStart }
  }
}
const userDisconnected = ({ socketID, idRoom }) => {
  const existingRoom = rooms.find(roomObj => roomObj.id.trim().toLowerCase() === idRoom?.trim()?.toLowerCase())

  if (!existingRoom) return { error: 'No Room'}

  existingRoom.removeUser(socketID)

  return { idRoom: existingRoom.id, listUsers: existingRoom.users }
}

const setUserReady = ({ socketID, idRoom }) => {
  const existingRoom = rooms.find(roomObj => roomObj.id.trim().toLowerCase() === idRoom?.trim()?.toLowerCase())
  if (!existingRoom) return { error: 'No Room'}

  const dataIsReady = existingRoom.setUserReady(socketID)

  return dataIsReady
}

const setStepGame = (idRoom, step) => {
  const existingRoom = rooms.find(roomObj => roomObj.id.trim().toLowerCase() === idRoom?.trim()?.toLowerCase())
  if (!existingRoom) return { error: 'No Room'}

  const data = existingRoom.setStepGame(step)

  return data
}

module.exports = { userConnected, userDisconnected, setUserReady, setStepGame }