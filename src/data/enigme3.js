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
      normalImg: 'vetement-base',
      botImg: 'vetement-base-stock',
      description: 'description vêtement',
    },
    {
      type: 'housing',
      slug: 'appartement',
      name: 'appartement',
      normalImg: 'appartement-base',
      botImg: 'appartement-base-stock',
      description: 'description appartement',
    },
    {
      type: 'vehicle',
      slug: 'voiture',
      name: 'belle voiture',
      normalImg: 'voiture-base',
      botImg: 'voiture-base-stock',
      description: 'description véhicule',
    },
  ],
  settings: {
    questionsToDisplay: 6,
    rulesToDetectBot: 3,
    product: {
      vehicle: {
        name: 'kilometrage : ',
        value: 50000,
        unit: 'km',
      },
      housing: {
        name: 'surface : ',
        value: 50, // m2
        unit: 'm2',
      },
      clothing: {
        name: 'marque : ',
        value: ['adidos', 'ralphLaurus', 'h&n'],
      },
    },
  },
})

const pricesData = {
  clothing: {
    'h&n': {
      min: 5,
      max: 100,
    },
    adidos: {
      min: 20,
      max: 300,
    },
    ralphLaurus: {
      min: 80,
      max: 700,
    },
  },
  vehicle: {
    more: {
      min: 800,
      max: 50000,
    },
    less: {
      min: 1000,
      max: 70000,
    },
  },
  housing: {
    more: {
      min: 50000,
      max: 300000,
    },
    less: {
      min: 20000,
      max: 200000,
    },
  },
}

module.exports = {
  enigme3Data,
  pricesData,
}
