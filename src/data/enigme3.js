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
      name: 'A vendre pull en laine',
      normalImg: 'vetement-base',
      botImg: 'vetement-base-stock',
      description: 'Pull en laine TRÈS BON ÉTAT<br/>'
        + 'Porté très rarement<br/>',
    },
    {
      type: 'housing',
      slug: 'appartement',
      name: 'A vendre appartement très ensoleillé',
      normalImg: 'appartement-base',
      botImg: 'appartement-base-stock',
      description: 'VEND BEL APPARTEMENT<br/>'
        + 'Quartier calme et tranquille<br/>'
        + 'proche de commerces<br/>'
        + 'rénové récemment<br/>'
        + 'Prix à débattre',
    },
    {
      type: 'vehicle',
      slug: 'voiture',
      name: 'A vendre Renault Clio',
      normalImg: 'voiture-base',
      botImg: 'voiture-base-stock',
      description: 'VEND CLIO IV TRÈS BON ÉTAT<br/>'
        + 'Contrôle technique du 27/12/2021 ok<br/>'
        + '5 portes<br/>'
        + '70 cv<br/>'
        + 'Prix à débattre',
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

const criteriaData = {
  clothing: {
    size: ['taille S', 'taille M', 'taille L', 'taille XL'],
    condition: ['très bon état', 'bon état'],
    material: ['laine', 'cachemir', 'jean'],

  },
  vehicle: {
    size: ['taille S', 'taille M', 'taille L', 'taille XL'],
  },
  housing: {
    size: ['taille S', 'taille M', 'taille L', 'taille XL'],
  },

}

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
