const convertTimeToMilis = (time = '00:00:00,000') => {
  let milis = 0

  const parse1 = time.split(',')
  const parse2 = parse1[0].split(':')

  // add milis
  milis += parseInt(parse1[1], 10)
  // add minutes
  milis += parseInt(parse2[2], 10) * 1000
  // add hours
  milis += parseInt(parse2[1], 10) * 60 * 1000

  return milis
}

module.exports = { convertTimeToMilis }
