const rooms = {}

const { generateUID } = require('./helpers/generateUID')

const { Room } = require('./room')

// if dev create Room DEV001
const IS_DEV = process.env.ENV === 'development'
if (IS_DEV) {
  rooms.DEV001 = new Room('DEV001')
}

const userConnected = (props) => {
  // {room, isMainScreen, isPlayer}
  const { idRoom, socketID, isMainScreen } = props

  const existingRoom = rooms[idRoom] || null

  if (existingRoom) {
    return existingRoom.addUser(props)
  } if (isMainScreen) {
    const idNewRoom = generateUID()
    const room = new Room(idNewRoom, socketID)
    rooms[idNewRoom] = room

    return {
      idRoom: room.id, listUsers: room.users, newUser: { type: 'mainScreen', socketID }, isStart: room.isStart,
    }
  }
  return { error: 'Player can\'t create room' }
}
const userDisconnected = ({ socketID, idRoom }) => {
  const existingRoom = rooms[idRoom] || null

  if (!existingRoom) return { error: 'No Room' }

  existingRoom.removeUser(socketID)

  if (existingRoom.users.length === 0) {
    delete rooms[idRoom]

    if (IS_DEV && rooms.length === 0) {
      rooms.push(new Room('DEV001'))
    }
  }

  return { idRoom: existingRoom.id, listUsers: existingRoom.users }
}

const setUserReady = ({ socketID, idRoom }) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const dataIsReady = existingRoom.setUserReady(socketID)

  return dataIsReady
}

const setUserReadyEnigme = ({ socketID, idRoom }) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const dataIsReady = existingRoom.setUserReadyEnigme(socketID)

  return dataIsReady
}
const getStepGame = (idRoom) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.getStepGame()

  return data
}

const setStepGame = (idRoom, step) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.setStepGame(step)

  return data
}

module.exports = {
  rooms,
  userConnected,
  userDisconnected,
  setUserReady,
  setUserReadyEnigme,
  getStepGame,
  setStepGame,
}
