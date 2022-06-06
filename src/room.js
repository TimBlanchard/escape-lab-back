/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
//
// ROOM
//

const _ = require('lodash')
const {
  ENIGME1_RESPONSES, MESSAGE_NAME_FACTURE, MESSAGES_LIST, MESSAGE_NAME,
} = require('./data/enigme1')
const { POPUPS } = require('./data/enigme2')
const { generateConfig } = require('./data/enigme3-generateConfig')

const STEPS_GAME = ['Intro', 'Enigme1', 'Enigme2', 'Enigme3', 'Outro']

const INIT_ENIGME_1 = {
  recalled: false,
  step: 0,
  numbersEntered: [],
  lastIndexNumbers: -1,
  messages: {
    contact: MESSAGE_NAME,
    id: 1,
    messages: [],
  },
}

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
    this.enigme1 = _.cloneDeep(INIT_ENIGME_1)

    // enigme 2
    this.enigme2 = {
      popups: _.cloneDeep(POPUPS),
      lastSend: -1,
      lastOrder: 0,
    }

    // enigme 3
    this.enigme3 = {
      config: null,
    }
  }

  // =============== //
  //    Connexion    //
  // =============== //
  addUser({ socketID, isMainScreen = false, isPlayer = false }) {
    if (!socketID) return { error: 'No ID room' }
    if (this.users.length >= 3) return { error: 'Room is full' }
    if (this.stepGame >= 4) return { error: 'La partie est fini' }

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
    this.enigme1 = {
      ..._.cloneDeep(INIT_ENIGME_1),
      recalled: true,
      time: new Date(),
    }
  }

  setNumber(num) {
    this.enigme1.numbersEntered.push(num)

    const CURRENT_RESPONSE = ENIGME1_RESPONSES[this.enigme1.step]
    const CURRENT_RESPONSE_LENGTH = CURRENT_RESPONSE.length
    if (!CURRENT_RESPONSE) return

    if (CURRENT_RESPONSE === this.enigme1.numbersEntered.slice(-CURRENT_RESPONSE_LENGTH).join('')) {
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
          this.enigme1.step = 4
          this.enigme1.messages.messages.push(MESSAGES_LIST[1])
          break
        case 3: // 1-0 wrongCode
          this.enigme1.step = 4
          this.enigme1.messages.messages.push(MESSAGES_LIST[1])
          break
        case 4: // 1-1
          this.enigme1.step = 6
          break
        case 5: // '1-wrongCode
          this.enigme1.step = 6
          break
        case 6: // 1-2
          this.enigme1.step = 8
          this.enigme1.messages.messages.push(MESSAGES_LIST[2])
          break
        case 7: // '1-3-wrong'
          this.enigme1.step = 8
          this.enigme1.messages.messages.push(MESSAGES_LIST[2])
          break
        case 8: // 2-0
          this.enigme1.step = 10
          // this.enigme1.messages.messages.push(MESSAGES_LIST[3])
          break
        case 9: // 2-0
          this.enigme1.step = 10
          // this.enigme1.messages.messages.push(MESSAGES_LIST[3])
          break
        case 10: // 2-1
          this.enigme1.step = 11
          break
        case 11: // 2-2-end
          break

        default:
          console.error('ERROR 1 set number')
          this.enigme1.step += 1
          break
      }

      this.enigme1.lastIndexNumbers = _.clone(this.enigme1.numbersEntered.length)

      // eslint-disable-next-line consistent-return
      return { send: true, step: this.enigme1.step, messages: this.enigme1.messages }
    } if (
      (this.enigme1.numbersEntered.length - this.enigme1.lastIndexNumbers)
      % CURRENT_RESPONSE_LENGTH === 0
    ) {
      switch (this.enigme1.step) {
        case 0: // 0-intro
          this.enigme1.step = 1
          // this.enigme1.messages.messages.push(MESSAGES_LIST[0])
          break
        case 1: // 0-wrong
          this.enigme1.step = 1
          break
        case 2: // 1-0
          this.enigme1.step = 3
          break
        case 3: // 1 wrongcode
          this.enigme1.step = 3
          break
        case 4: // 1-1
          this.enigme1.step = 5
          break
        case 5: // '1-wrongCode
          this.enigme1.step = 5
          break
        case 6: // 1-2
          this.enigme1.step = 7
          break
        case 7: // '1-3-wrong'
          this.enigme1.step = 8
          this.enigme1.messages.messages.push(MESSAGES_LIST[2])
          break
        case 8: // 2-0
          this.enigme1.step = 9
          break
        case 9: // 2-1
          this.enigme1.step = 9
          break
        case 10: // 2-1
          this.enigme1.step = 11
          break
        case 11: // 2-2-end
          break

        default:
          console.error('ERROR 2 : set Number')
          this.enigme1.step += 1
          break
      }

      this.enigme1.lastIndexNumbers = _.clone(this.enigme1.numbersEntered.length)

      return { send: true, step: this.enigme1.step, messages: this.enigme1.messages }
    }
    return { send: false }
  }

  enigme1End() {
    const message = _.clone(MESSAGES_LIST[3])
    const time = (new Date() - this.enigme1.time) / 60000
    message.content = message.content.replace('{{time}}', (Math.round(time * 25)).toString())

    const messages = [
      {
        contact: MESSAGE_NAME_FACTURE,
        id: 2,
        messages: [message],
      },
      this.enigme1.messages,
    ]
    return { messages }
  }

  // =============== //
  //     Enigme2     //
  // =============== //

  setOwnerData(direction, id) {
    this.enigme2.lastOrder += 1

    const rng = Math.floor(Math.random() * 2)
    // console.log('RNG VAUT :: ', rng)
    // const index = id
    const currentPopup = this.enigme2.popups[this.enigme2.popups.findIndex((el) => el.id === id)]
    if (!currentPopup) return this.enigme2.popups
    currentPopup.exitDirection = direction

    currentPopup.order = -this.enigme2.lastOrder
    // console.log('CURRENT POPUP VAUT :: ', currentPopup)

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
    // console.log(this.enigme2.popups, direction, id)
    return this.enigme2.popups
  }

  newPopup(duration) {
    if (this.enigme2.lastSend >= this.enigme2.popups.length) return this.enigme2.popups
    this.enigme2.lastSend += 1
    this.enigme2.lastOrder += 1

    const newPopup = this.enigme2.popups[this.enigme2.lastSend]
    if (!newPopup) return { popups: this.enigme2.popups, idNewPopup: newPopup?.id }
    newPopup.order = -this.enigme2.lastOrder
    newPopup.owner = 'MainScreen'
    newPopup.duration = duration

    // console.log('send popups', this.enigme2.popups)
    return { popups: this.enigme2.popups, idNewPopup: newPopup.id }
  }

  restartEnigme2() {
    this.enigme2 = {
      popups: _.cloneDeep(POPUPS),
      lastSend: -1,
      lastOrder: 0,
    }

    return this.enigme2
  }

  // =============== //
  //     Enigme3     //
  // =============== //

  initConfigEnigme3() {
    this.enigme3.config = generateConfig()

    return this.enigme3
  }
}

module.exports = { Room, STEPS_GAME }
