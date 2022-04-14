// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars

const { enigme3Data } = require('./data/enigme3')

function generateConfig() {
  // CHOOSE SELLER WILL BE BOT OR NOT
  const sellerType = Math.random() < 0.5 ? 'bot' : 'normal'

  // CHOOSE TRUE RULES
  const trueRulesNumber = sellerType === 'bot' ? enigme3Data().settings.rulesToDetectBot : 2
  const trueRules = enigme3Data().rules.sort(() => Math.random() - Math.random()).slice(0, trueRulesNumber)

  // CHOOSE RANDOM PRODUCT
  const product = enigme3Data().products[Math.floor(Math.random() * enigme3Data().products.length)]
  // check if has normal or bot image
  const image = trueRules.some((obj) => obj.slug === 'stock') ? product.botImg : product.normalImg
  // generate mainCriteria (subtype)
  const mainCriteria = enigme3Data().settings.product[product.type][Math.floor(Math.random() * enigme3Data().products.length)]

  const productGenerated = { name: product.name, description: product.description, img: image, mainCriteria, type: product.type }

  return { trueRules, sellerType, product: productGenerated, settings: enigme3Data().settings }
}

const initSocketsEnigme3 = (io, socket) => {
  const config = generateConfig()
  socket.on('sendEnigme3Config', () => {
    io.to(socket.idRoom).emit('sendEnigme3Config', config)
  })
}

module.exports = { initSocketsEnigme3 }
