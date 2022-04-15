/* eslint-disable no-restricted-syntax */
//
// ROOM
//
const STEPS_GAME = ['Intro', 'Enigme1', 'Enigme2', 'Enigme3', 'Outro']

class Room {
  constructor(id, mainScreen = null) {
    this.id = id
    this.users = {
      mainScreen,
      player1: null,
      player2: null,
      length: mainScreen ? 1 : 0,
    }
    // connexion
    this.isReady = []
    this.isStart = false
    this.stepGame = null
    this.isReadyEnigme = []

    // intro
    this.introIndexMessage = -1
  }

  // =============== //
  //    Connexion    //
  // =============== //
  addUser({ socketID, isMainScreen = false, isPlayer = false }) {
    if (!socketID) return { error: 'No ID room' }
    if (this.users.length >= 3) return { error: 'Room is full' }

    const RETURN = {
      idRoom: this.id, listUsers: this.users, isStart: this.isStart, stepGame: this.stepGame,
    }

    if (!this.users.mainScreen && isMainScreen) {
      this.users.mainScreen = socketID
      this.setLengthUsers()

      return { ...RETURN, newUser: { type: 'MainScreen', socketID } }
    } if (isPlayer) {
      if (!this.users.player1) {
        this.users.player1 = socketID
        this.setLengthUsers()

        return { ...RETURN, newUser: { type: 'Player1', socketID } }
      } if (!this.users.player2) {
        this.users.player2 = socketID
        this.setLengthUsers()

        return { ...RETURN, newUser: { type: 'Player2', socketID } }
      }

      return { error: 'Room is full of player' }
    }

    return { error: 'Room has already mainScreen' }
  }

  removeUser(socketID) {
    for (const key in this.users) {
      if (this.users[key] === socketID) {
        this.users[key] = null
      }
    }

    // if use is on isReady
    if (this.isReady.includes(socketID)) {
      const indexUser = this.isReady.findIndex((v) => v === socketID)
      this.isReady.splice(indexUser, 1)
    }

    this.setLengthUsers()

    return { idRoom: this.id, listUsers: this.users }
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

  // set step game
  setStepGame(stepGame) {
    // eslint-disable-next-line no-restricted-globals
    this.stepGame = isNaN(stepGame) ? this.stepGame + 1 : stepGame

    return { stepGame: STEPS_GAME[this.stepGame] }
  }

  getStepGame() {
    return STEPS_GAME[this.stepGame]
  }

  // =============== //
  //      Intro      //
  // =============== //
  setUserReady(socketID) {
    if (!this.isReady.includes(socketID)) {
      this.isReady.push(socketID)
    }

    const canStart = this.isReady.length >= 2

    if (canStart) {
      this.isStart = true
      this.isReady = []
    }

    return { isReadyLength: this.isReady.length, canStart, isReadyPlayer: this.isReady }
  }

  setUserReadyEnigme(socketID) {
    if (!this.isReadyEnigme.includes(socketID)) {
      this.isReadyEnigme.push(socketID)
    }

    const canStart = this.isReadyEnigme.length >= 3

    if (canStart) {
      this.isReadyEnigme = []
    }

    return {
      isReadyEnigmeLength: this.isReadyEnigme.length,
      canStart,
      isReadyEnigmePlayer: this.isReadyEnigme,
    }
  }

  introReady(socketID) {
    if (!this.isReady.includes(socketID)) {
      this.isReady.push(socketID)
    }

    const canSendNextMessage = this.isReady.length >= 2

    if (canSendNextMessage) {
      this.isReady = []
      this.introIndexMessage += 1
    }

    return { canSendNextMessage, indexMessage: this.introIndexMessage }
  }

  // =============== //
  //     Enigme1     //
  // =============== //

  // TODO

  // =============== //
  //     Enigme2     //
  // =============== //

  // TODO

  // =============== //
  //     Enigme3     //
  // =============== //

  // TODO
}

module.exports = { Room, STEPS_GAME }
