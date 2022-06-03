/* eslint-disable no-lonely-if */
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars

const { enigme3Data, pricesData } = require('./enigme3')
const { randomNum } = require('../helpers/randomNum')

function generateConfig() {
  // CHOOSE SELLER WILL BE BOT OR NOT
  const sellerType = Math.random() < 0.5 ? 'bot' : 'normal'

  // CHOOSE TRUE RULES
  const trueRulesNumber = sellerType === 'bot' ? enigme3Data().settings.rulesToDetectBot : 2
  const trueRules = enigme3Data()
    .rules.sort(() => Math.random() - Math.random())
    .slice(0, trueRulesNumber)

  // CHOOSE RANDOM PRODUCT
  const product = enigme3Data().products[randomNum(0, enigme3Data().products.length)]

  // check if has normal or bot image
  const image = trueRules.some((obj) => obj.slug === 'stock') ? product.botImg : product.normalImg

  // generate product subtype
  const subtype = enigme3Data().settings.product[product.type]
  let subtypeText
  let subtypeInterval
  if (product.type === 'clothing') {
    // select random value in marque array
    const val = subtype.value[randomNum(0, subtype.value.length)]
    subtypeText = subtype.name + val
    subtypeInterval = pricesData[product.type][val]
  } else {
    // choose randomly if will be value more or less
    if (Math.random() < 0.5) {
      // more than val
      const val = subtype.value + randomNum(1, subtype.value * 0.4)
      subtypeText = subtype.name + val.toString() + subtype.unit
      subtypeInterval = pricesData[product.type].more
    } else {
      // less than value
      const val = subtype.value - randomNum(1, subtype.value * 0.4)
      subtypeText = subtype.name + val.toString() + subtype.unit
      subtypeInterval = pricesData[product.type].less
    }
  }
  const productGenerated = {
    name: product.name,
    description: product.description,
    img: image,
    type: product.type,
    subtype: { text: subtypeText, interval: subtypeInterval },
    criteria: product.criteria,
  }

  // data pass as sockets
  return {
    trueRules, sellerType, product: productGenerated, settings: enigme3Data().settings,
  }
}

module.exports = { generateConfig }
