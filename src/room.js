/* eslint-disable no-restricted-syntax */
//
// ROOM
//
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

    // intro
    this.introIndexMessage = -1
    this.enigme2 = {
      popups: [
        {
          id: 1,
          text: 'popup 1',
          owner: 'MainScreen',
          incomingDirection: null,
          exitDirection: null,
        },
        {
          id: 2,
          text: 'popup 2',
          owner: null,
          incomingDirection: null,
          exitDirection: null,
        },
        {
          id: 3,
          text: 'popup 3',
          owner: null,
          incomingDirection: null,
          exitDirection: null,
        },
        {
          id: 4,
          text: 'popup 4',
          owner: null,
          incomingDirection: null,
          exitDirection: null,
        },
        {
          id: 5,
          text: 'popup 5',
          owner: null,
          incomingDirection: null,
          exitDirection: null,
        },
        {
          id: 6,
          text: 'popup 6',
          owner: null,
          incomingDirection: null,
          exitDirection: null,
        },
      ],
    }
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
    this.stepGame = stepGame

    return { stepGame }
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

  setOwnerData(direction, id) {
    const rng = Math.floor(Math.random() * 2)
    console.log('RNG VAUT :: ', rng)
    // const index = id
    const currentPopup = this.enigme2.popups.filter((el) => el.id === id)[0]
    currentPopup.exitDirection = direction
    console.log('CURRENT POPUP VAUT :: ', currentPopup)

    switch (currentPopup.exitDirection) {
      case 'bottom':
        currentPopup.owner = rng ? 'Player1' : 'Player2'
        currentPopup.incomingDirection = 'top'
        break
      case 'left':
        if (currentPopup.owner === 'Player1') {
          currentPopup.owner = 'Player2'
        } else {
          currentPopup.owner = 'Player1'
        }
        currentPopup.incomingDirection = 'right'

        break
      case 'right':
        if (currentPopup.owner === 'Player1') {
          currentPopup.owner = 'Player2'
        } else {
          currentPopup.owner = 'Player1'
        }
        currentPopup.incomingDirection = 'left'
        break
      default:
        break
    }
    console.log(this.enigme2.popups, direction, id)
    return this.enigme2.popups
  }

  // =============== //
  //     Enigme3     //
  // =============== //

  // TODO
}

module.exports = { Room }
