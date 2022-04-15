/* eslint-disable no-param-reassign */
const { default: srtParser2 } = require('srt-parser-2')
const fs = require('fs')
const { convertTimeToMilis } = require('./helpers/convertTimeToMilis')

const changeData = (data) => {
  let lastTime = 0
  data.map((d) => {
    // parse time
    d.startTimeMilis = convertTimeToMilis(d.startTime)
    d.endTimeMilis = convertTimeToMilis(d.endTime)
    d.delayLastMilis = d.startTimeMilis - lastTime
    lastTime = d.startTimeMilis

    // parse message
    const textSplit = d.text.split(/: (.+)?/, 2)
    d.user = textSplit[0].replace(/ /g, '')
    d.message = textSplit[1].trim()
    d.isWriting = textSplit[1].includes('[writing]')

    return d
  })

  return data
}

// eslint-disable-next-line new-cap
const parser = new srtParser2()
const contentIntro = fs.readFileSync('./src/assets/Intro.srt').toString()
const contentOutro = fs.readFileSync('./src/assets/Intro.srt').toString()

const dataIntro = changeData(parser.fromSrt(contentIntro))
const dataOutro = changeData(parser.fromSrt(contentOutro))

module.exports = { dataIntro, dataOutro }
