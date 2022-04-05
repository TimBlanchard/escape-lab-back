const rooms = []

//
// Generate UID
//
function generateUID() {
  // I generate the UID from two parts here 
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ('000' + firstPart.toString(36)).slice(-3);
  secondPart = ('000' + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

//
// ROOM
//
class Room {
  constructor(id, mainScreen) {
    this.id = id
    this.users = {
      mainScreen,
      player1: null,
      player2: null,
      length: 1
    }
  }

  addUser ({ socketID, isMainScreen = false, isPlayer = false }) {
    if (!socketID) return { error: 'No ID room'}
    if (this.users.length >= 3) return { error: 'Room is full'}

    if (!this.users.mainScreen && isMainScreen) {
      this.users.mainScreen = socketID
      this.setLengthUsers()

      return { idRoom: this.id, listUsers: this.users, newUser: { type: 'mainScreen', socketID } }
    } else if (isPlayer) {
      if (!this.users.player1) {
        this.users.player1 = socketID
        this.setLengthUsers()

        return { idRoom: this.id, listUsers: this.users, newUser: { type: 'player1', socketID } }
      } else if (!this.users.player2) {
        this.users.player2 = socketID
        this.setLengthUsers()

        return { idRoom: this.id, listUsers: this.users, newUser: { type: 'player2', socketID } }
      }

      return { error: 'Room is full of player'}
    }

    return { error: 'Room has already mainScreen'}
  }

  removeUser(socketID) {
    for (const key in this.users) {
      if (this.users[key] === socketID) {
        this.users[key] === null
      }
    }

    this.setLengthUsers()

    return { idRoom: this.id, listUsers: this.users }
  }

  returnDataRoom() {
    return // TODO
  }

  setLengthUsers() {
    let length = 0
   for (const key in this.users) {
     if (key !== 'length' && this.users[key]) {
      length += 1
     }
   }

   this.users.length = length

   console.log(this.users)
  }
}

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