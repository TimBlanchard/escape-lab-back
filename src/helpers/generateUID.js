/* eslint-disable no-bitwise */
//
// Generate UID
//
function generateUID() {
  return (`${(Math.random() * 36 ** 8 << 0).toString(36).replaceAll(/(0|o|O)/g, '')}`).slice(-4)
}

module.exports = { generateUID }
