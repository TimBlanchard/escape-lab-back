/* eslint-disable no-restricted-syntax */
//
// ROOM
//

const { ENIGME1_RESPONSES, MESSAGE_NAME, MESSAGES_LIST } = require('./data/enigme1')

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

    // enigme 1
    this.enigme1 = {
      recalled: false,
      step: 0,
      numbersEntered: [],
      messages: {
        contact: MESSAGE_NAME,
        messages: [],
      },
    }
  }

  // =============== //
  //    Connexion    //
  // =============== //
  addUser({ socketID, isMainScreen = false, isPlayer = false }) {
    if (!socketID) return { error: 'No ID room' }
    if (this.users.length >= 3) return { error: 'Room is full' }

    const RETURN = {
      idRoom: this.id,
      listUsers: this.users,
      isStart: this.isStart,
      stepGame: STEPS_GAME[this.stepGame],
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
    this.isStart = true

    return { stepGame: STEPS_GAME[this.stepGame], stepGameNumber: this.stepGame }
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

  setRecall() {
    this.enigme1.recalled = true
  }

  setNumber(num) {
    this.enigme1.numbersEntered.push(num)
    console.log('new number', num, this.enigme1.numbersEntered, this.enigme1.step)

    // s'il n'y a pas de message
    const CURRENT_RESPONSE = ENIGME1_RESPONSES[this.enigme1.step]
    if (!CURRENT_RESPONSE) return { send: false }

    // s'il n'y a pas de
    if (CURRENT_RESPONSE.length !== this.enigme1.numbersEntered.length) return { send: false }

    // TODO if
    console.log('number IF ', CURRENT_RESPONSE, this.enigme1.numbersEntered.join(''), CURRENT_RESPONSE === this.enigme1.numbersEntered.join(''))

    if (CURRENT_RESPONSE === this.enigme1.numbersEntered.join('')) {
      switch (this.enigme1.step) {
        case 0: // 0-intro
          this.enigme1.step = 2
          this.enigme1.messages.messages.push(MESSAGES_LIST[0])
          break
        case 1: // 0-wrong
          this.enigme1.step = 2
          this.enigme1.messages.messages.push(MESSAGES_LIST[0])
          break
        case 2: // 1-0
          this.enigme1.step = 3
          this.enigme1.messages.messages.push(MESSAGES_LIST[1])
          break
        case 3: // 1-1
          this.enigme1.step = 5
          break
        case 4: // '1-wrongCode
          this.enigme1.step = 5
          break
        case 5: // 1-2
          this.enigme1.step = 7
          this.enigme1.messages.messages.push(MESSAGES_LIST[2])
          break
        case 6: // '1-3-wrong'
          this.enigme1.step = 7
          this.enigme1.messages.messages.push(MESSAGES_LIST[2])
          break
        case 7: // 2-0
          this.enigme1.step = 8
          this.enigme1.messages.messages.push(MESSAGES_LIST[3])
          break
        case 8: // 2-1
          this.enigme1.step = 9
          break
        case 9: // 2-2-end
          break

        default:
          console.error('ERROR 1 set number')
          this.enigme1.step += 1
          break
      }

      this.enigme1.numbersEntered = []

      console.log('send TRUE', { send: true, step: this.enigme1.step, messages: this.enigme1.messages })
      return { send: true, step: this.enigme1.step, messages: this.enigme1.messages }
    }

    switch (this.enigme1.step) {
      case 0: // 0-intro
        this.enigme1.step = 1
        // this.enigme1.messages.messages.push(MESSAGES_LIST[0])
        break
      case 1: // 0-wrong
        this.enigme1.step = 1
        break
      case 2: // 1-0
        this.enigme1.step = 2
        break
      case 3: // 1-1
        this.enigme1.step = 4
        break
      case 4: // '1-wrongCode
        this.enigme1.step = 1
        break
      case 5: // 1-2
        this.enigme1.step = 6
        break
      case 6: // '1-3-wrong'
        this.enigme1.step = 7
        break
      case 7: // 2-0
        this.enigme1.step = 7
        break
      case 8: // 2-1
        this.enigme1.step = 8
        break
      case 9: // 2-2-end
        break

      default:
        console.error('ERROR 2 : set Number')
        this.enigme1.step += 1
        break
    }

    this.enigme1.numbersEntered = []

    console.log('send false', { send: true, step: this.enigme1.step, messages: this.enigme1.messages })
    return { send: true, step: this.enigme1.step, messages: this.enigme1.messages }
  }

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
