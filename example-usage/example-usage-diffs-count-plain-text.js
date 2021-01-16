//const diffsCount = require('stt-align-node').diffsCount;
const diffsCount = require('../src/index.js').diffsCount;
const fs = require('fs');

// file path relative to this file.
const transcriptStt = require('../sample/data/ted-talk/ted-talk-kate-kaldi.json').retval.words;
const trainscriptSttText = transcriptStt
  .map((word) => {
    return word.text;
  })
  .join(' ');
// file path relative to root
const transcriptText = fs.readFileSync('./sample/data/ted-talk/ted-talk-kate.txt').toString();

const result = diffsCount(trainscriptSttText, transcriptText);
// do something with the result
console.log(result);

fs.writeFileSync('./sample/output/ted-talk-kate-diffs-from-plain-text-count.json', JSON.stringify(result, null, 2));
