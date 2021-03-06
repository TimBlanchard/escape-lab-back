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
  const idRoom = props.idRoom?.toLowerCase()

  const existingRoom = rooms[idRoom] || null

  if (existingRoom) {
    return existingRoom.addUser(props)
  } if (isMainScreen) {
    const idNewRoom = generateUID()
    const room = new Room(idNewRoom, socketID)
    rooms[idNewRoom] = room

    return {
      idRoom: room.id, listUsers: room.users, newUser: { type: 'mainScreen', socketID }, isStart: room.isStart, stepGame: room.stepGame,
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

const restartEnigme1 = (idRoom) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.restartEnigme1()
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
const getSucessEnigme2 = (idRoom) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const { popups } = existingRoom.enigme2

  let rightResponses = 0
  popups.forEach(
    (currentValue) => {
      const rightPlayer1 = currentValue.isSpam && currentValue.owner === 'Player1'
      const rightPlayer2 = !currentValue.isSpam && currentValue.owner === 'Player2'

      if (rightPlayer1 || rightPlayer2) rightResponses += 1
    },
  )

  const success = (rightResponses / popups.length) > 0.95

  return success
}

const getNewOwnerDataEnigme2 = (idRoom, direction, id) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.setOwnerData(direction, id)
  return data
}

const newPopupEnigme2 = (idRoom, duration) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.newPopup(duration)
  return data
}

const restartEnigme2 = (idRoom) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.restartEnigme2()
  return data
}
const setSettimeoutEnigme2 = (idRoom, array) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.setSettimeoutEnigme2(array)

  return data
}

//
// Enigme 3
//
const setConfigEnigme3 = (idRoom) => {
  const existingRoom = rooms[idRoom] || null
  if (!existingRoom) return { error: 'No Room' }

  const data = existingRoom.initConfigEnigme3()
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
  restartEnigme1,
  getDataEnigme2,
  getSucessEnigme2,
  getNewOwnerDataEnigme2,
  newPopupEnigme2,
  restartEnigme2,
  setSettimeoutEnigme2,
  setConfigEnigme3,
}
