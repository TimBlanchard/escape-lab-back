const readline = require('readline')
const { rooms } = require('./roomServer')

const initKeys = () => {
  readline.emitKeypressEvents(process.stdin)
  if (process.stdin.isTTY) process.stdin.setRawMode(true)

  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit()
    } else if (key.name === 'r') {
      console.log('============== ROOMS ==============')
      console.log(rooms)
      console.log('===================================')
    }
  })
  console.log('Press r to see rooms')
}

module.exports = { initKeys }
