var { default: srtParser2 } = require('srt-parser-2')
const fs = require('fs');

var parser = new srtParser2()
const contentIntro = fs.readFileSync('./src/assets/Intro.srt').toString();
const contentOutro = fs.readFileSync('./src/assets/Intro.srt').toString();

var dataIntro = parser.fromSrt(contentIntro);
var dataOutro = parser.fromSrt(contentOutro);

module.exports = { dataIntro, dataOutro }