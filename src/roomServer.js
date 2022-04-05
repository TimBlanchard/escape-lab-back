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

    return { idRoom, listUsers: room.users, newUser: { type: 'mainScreen', socketID } }
  }
}
const userDisconnected = ({ socketID, idRoom }) => {
  const existingRoom = rooms.find(roomObj => roomObj.id.trim().toLowerCase() === idRoom?.trim()?.toLowerCase())

  if (!existingRoom) return { error: 'No Room'}

  existingRoom.removeUser(socketID)

  return { idRoom: existingRoom.id, listUsers: existingRoom.users }
}

module.exports = { userConnected, userDisconnected }