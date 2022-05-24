const enigme3Data = () => ({
  rules: [
    { slug: 'price', name: 'le prix du produit' },
    { slug: 'stock', name: 'l\'image du produit' },
    { slug: 'payment', name: 'le moyen de paiment' },
    { slug: 'criteria', name: 'la différence entre les caractéristiques annoncées par le vendeur et celles de l\'annonce' },
    { slug: 'availability', name: 'l\'impatience du vendeur' },
    { slug: 'profile', name: 'le profil du vendeur' },
    { slug: 'special-characters', name: 'les caractères spéciaux affichés sur l\'annonce' },
    { slug: 'sending', name: 'la provenance UPS du produit' },
  ],
  products: [/*{
      type: 'clothing',
      slug: 'pull',
      name: 'A vendre pull en laine',
      normalImg: 'vetement-base',
      botImg: 'vetement-base-stock',
      description: 'Pull en laine TRÈS BON ÉTAT<br/>'
        + 'Porté très rarement<br/>',
      criteria: {
        good: {
          size: 'S',
          condition: 'très bon état',
          material: 'laine',
          color: 'noir',
        },
        wrong: {
          size: 'XL',
          condition: 'très bon état',
          material: 'laine',
          color: 'noir',
        },
      },
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
      criteria: {
        good: {
          furnished: 'meublé',
          energyClass: 'E',
          piecesNumber: '3',
          location: 'Paris',
        },
        wrong: {
          furnished: 'non meublé',
          energyClass: 'E',
          piecesNumber: '1',
          location: 'Paris',
        },
      },
    },*/
    {
      type: 'vehicle',
      slug: 'voiture',
      name: 'A vendre Renault Clio',
      normalImg: 'voiture-base',
      botImg: 'voiture-base-stock',
      description: ['VEND CLIO IV TRÈS BON ÉTAT', 'Contrôle technique du 27/12/2021 ok', '5 portes', '70 cv', 'Prix à débattre'],
      criteria: {
        good: {
          seatsNumber: '4',
          power: '120 ch',
          modelYear: '2012',
          model: 'renault clio',
        },
        wrong: {
          seatsNumber: '4',
          power: '30 ch',
          modelYear: '2012',
          model: 'renault clio',
        },
      },
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
