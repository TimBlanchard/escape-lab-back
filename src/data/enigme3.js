const enigme3Data = () => ({
  rules: [
    { slug: 'price' },
    { slug: 'stock' },
    { slug: 'payment' },
    { slug: 'criteria' },
    { slug: 'availability' },
    { slug: 'profile' },
    { slug: 'special-characters' },
    { slug: 'sending' },
  ],
  products: [
    {
      type: 'clothing',
      slug: 'pull',
      name: 'Pull en laine',
      normalImg: 'image normale vêtement',
      botImg: 'image stock vêtement',
      description: 'description vêtement',
    },
    {
      type: 'housing',
      slug: 'appartement',
      name: 'appartement',
      normalImg: 'image normale appartement',
      botImg: 'image stock appartement',
      description: 'description appartement',
    },
    {
      type: 'vehicle',
      slug: 'voiture',
      name: 'belle voiture',
      normalImg: 'image normale véhicule',
      botImg: 'image stock véhicule',
      description: 'description véhicule',
    },
  ],
  settings: {
    questionsToDisplay: 6,
    rulesToDetectBot: 3,
    prices: {
      clothing: [10, 500],
      vehicle: [1000, 200000],
      housing: [40000, 500000],
    },
  },
})

module.exports = {
  enigme3Data,
}
