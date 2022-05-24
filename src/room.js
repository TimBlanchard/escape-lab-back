/* eslint-disable no-restricted-syntax */
//
// ROOM
//

const {
  ENIGME1_RESPONSES, MESSAGE_NAME, MESSAGE_NAME_FACTURE, MESSAGES_LIST,
} = require('./data/enigme1')

const STEPS_GAME = ['Intro', 'Enigme1', 'Enigme2', 'Enigme3', 'Outro']

const INIT_ENIGME_1 = {
  recalled: false,
  step: 0,
  numbersEntered: [],
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
    this.enigme1 = {
      ...INIT_ENIGME_1,
    }
    // this.enigme2 = {
    //   popups: []
    // }
    this.enigme2 = {
      popups: [
        {
          id: 1,
          from: 'De : mail@e.cudo.com.au',
          subject: 'Objet : ʀÉᴄᴜᴘÉʀᴇᴢ ᴠᴏᴛʀᴇ ʀÉᴄᴏᴍᴘᴇɴꜱᴇ ɪᴘʜᴏɴᴇ 13 ᴏꜰꜰᴇʀᴛ',
          text: 'ʀÉᴄᴜᴘÉʀᴇᴢ ᴠᴏᴛʀᴇ ʀÉᴄᴏᴍᴘᴇɴꜱᴇ ɪᴘʜᴏɴᴇ 13 ᴏꜰꜰᴇʀᴛ.',
          owner: 'MainScreen',
          incomingDirection: null,
          exitDirection: null,
        },
        {
          id: 2,
          from: 'De : Caf de Paris (noreply@emailing.caf.fr)',
          subject: 'Objet : Déclarez vos revenus trimestriels',
          text: 'Pour lire ce message en ligne, rendez-vous sur cette page. Ceci est un message automatique, merci de ne pas y répondre…',
          owner: null,
          incomingDirection: null,
          exitDirection: null,
        },
        {
          id: 3,
          from: 'De : Caf de Paris (noreply@emailing.caf.fr)',
          subject: 'Objet : Déclarez vos revenus trimestriels',
          text: 'Pour lire ce message en ligne, rendez-vous sur cette page. Ceci est un message automatique, merci de ne pas y répondre…',
          owner: null,
          incomingDirection: null,
          exitDirection: null,
        },
        {
          id: 4,
          from: 'De : Caf de Paris (noreply@emailing.caf.fr)',
          subject: 'Objet : Déclarez vos revenus trimestriels',
          text: 'Pour lire ce message en ligne, rendez-vous sur cette page. Ceci est un message automatique, merci de ne pas y répondre…',
          owner: null,
          incomingDirection: null,
          exitDirection: null,
        },
        {
          id: 5,
          from: 'De : mail@e.cudo.com.au',
          subject: 'Objet : ʀÉᴄᴜᴘÉʀᴇᴢ ᴠᴏᴛʀᴇ ʀÉᴄᴏᴍᴘᴇɴꜱᴇ ɪᴘʜᴏɴᴇ 13 ᴏꜰꜰᴇʀᴛ',
          text: 'ʀÉᴄᴜᴘÉʀᴇᴢ ᴠᴏᴛʀᴇ ʀÉᴄᴏᴍᴘᴇɴꜱᴇ ɪᴘʜᴏɴᴇ 13 ᴏꜰꜰᴇʀᴛ.',
          owner: null,
          incomingDirection: null,
          exitDirection: null,
        },
        {
          id: 6,
          from: 'De : mail@e.cudo.com.au',
          subject: 'Objet : ʀÉᴄᴜᴘÉʀᴇᴢ ᴠᴏᴛʀᴇ ʀÉᴄᴏᴍᴘᴇɴꜱᴇ ɪᴘʜᴏɴᴇ 13 ᴏꜰꜰᴇʀᴛ',
          text: 'ʀÉᴄᴜᴘÉʀᴇᴢ ᴠᴏᴛʀᴇ ʀÉᴄᴏᴍᴘᴇɴꜱᴇ ɪᴘʜᴏɴᴇ 13 ᴏꜰꜰᴇʀᴛ.',
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
      ...INIT_ENIGME_1,
      recalled: true,
    }
  }

  setNumber(num) {
    this.enigme1.numbersEntered.push(num)

    // s'il n'y a pas de message
    const CURRENT_RESPONSE = ENIGME1_RESPONSES[this.enigme1.step]
    if (!CURRENT_RESPONSE) return { send: false }

    // s'il n'y a pas de
    if (CURRENT_RESPONSE.length !== this.enigme1.numbersEntered.length) return { send: false }

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

      this.enigme1.numbersEntered = []

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

    this.enigme1.numbersEntered = []

    return { send: true, step: this.enigme1.step, messages: this.enigme1.messages }
  }

  enigme1End() {
    const messages = [
      {
        contact: MESSAGE_NAME_FACTURE,
        id: 2,
        messages: [MESSAGES_LIST[3]],
      },
      this.enigme1.messages,
    ]
    return { messages }
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
