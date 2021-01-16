// const alignSTT = require('stt-align-node').alignSTT;
const { diffsListAsHtmlContentOnly } = require('../src/index.js');
const fs = require('fs');

// file path relative to this file.
const transcriptStt = require('../sample/data/ted-talk/ted-talk-kate-kaldi.json').retval;
// file path relative to root
const transcriptText = fs.readFileSync('./sample/data/ted-talk/ted-talk-kate.txt').toString();
const url = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';
const result = diffsListAsHtmlContentOnly(transcriptStt, transcriptText);
// do something with the result
console.log(result);

fs.writeFileSync('./sample/output/ted-talk-kate-diffs-content-only.html', result);
