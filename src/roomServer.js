const rooms = {}

const { generateUID } = require('./helpers/generateUID')

const { Room } = require('./room')

// if dev create Room dev1
const IS_DEV = process.env.ENV === 'development'
if (IS_DEV) {
  rooms.dev1 = new Room('dev1')
}

const userConnected = (props) => {
  // {room, isMainScreen, isPlayer}
  const { socketID, isMainScreen } = props
  const idRoom = props.idRoom.toLowerCase()

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
  return { error: 'Ce code ne corespond à aucune partie' }
}
const userDisconnected = ({ socketID, idRoom }) => {
  const existingRoom = rooms[idRoom] || null

  if (!existingRoom) return { error: 'No Room' }

  existingRoom.removeUser(socketID)

  if (existingRoom.users.length === 0) {
    delete rooms[idRoom]

    if (IS_DEV && rooms.length === 0) {
      rooms.push(new Room('dev1'))
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

//
// Enigme 1
//
const enigme1EnteredNumber = (idRoom, v) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.setNumber(v)

  return data
}

const enigme1End = (idRoom, v) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.enigme1End(v)

  return data
}

//
// Enigme 2
//
const getDataEnigme2 = (idRoom) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.enigme2

  return data
}

const getNewOwnerDataEnigme2 = (idRoom, direction, id) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.setOwnerData(direction, id)
  return data
}

const newPopupEnigme2 = (idRoom) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.newPopup()
  return data
}

module.exports = {
  rooms,
  userConnected,
  userDisconnected,
  setUserReady,
  setStepGame,
  getStepGame,
  setUserReadyEnigme,
  enigme1EnteredNumber,
  enigme1End,
  getDataEnigme2,
  getNewOwnerDataEnigme2,
  newPopupEnigme2,
}
