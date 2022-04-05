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
    this.isReady = []
    this.isPlaying = false
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
        this.users[key] = null
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
  }


  setUserReady(socketID) {
    if (!this.isReady.includes(socketID)) {
      this.isReady.push(socketID)
    }

    const canStart = this.isReady.length >= 3

    if (canStart) {
      this.isPlaying = true
      this.isReady = []
    }

    return { isReadyLength : this.isReady.length, canStart }
  }
}

module.exports = { Room }