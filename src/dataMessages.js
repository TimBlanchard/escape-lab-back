var { default: srtParser2 } = require('srt-parser-2')
const fs = require('fs');
const { convertTimeToMilis } = require('./helpers/convertTimeToMilis');

const changeTimeData = (data) => {
  let lastTime = 0
  data.map((d) => {
    d.startTimeMilis = convertTimeToMilis(d.startTime)
    d.endTimeMilis = convertTimeToMilis(d.endTime)
    d.delayLastMilis = d.startTimeMilis  - lastTime
    lastTime = d.startTimeMilis

    return d
  })

  return data
}

var parser = new srtParser2()
const contentIntro = fs.readFileSync('./src/assets/Intro.srt').toString();
const contentOutro = fs.readFileSync('./src/assets/Intro.srt').toString();

var dataIntro = changeTimeData(parser.fromSrt(contentIntro));
var dataOutro = changeTimeData(parser.fromSrt(contentOutro));

module.exports = { dataIntro, dataOutro }