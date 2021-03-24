// const linear = require('everpolate').linear;
// a: The starting value
// b: The destination value
// n: The normal value (between 0 and 1) to control the Linear Interpolation
// https://gist.github.com/Anthodpnt/f4ad9127a3c5479d1c0e8ff5ed79078e#file-lerp-js-L86
// function linear(a, b, n) {
//   return (1 - n) * a + n * b;
// }
const linearInterpolation = require('./simple-linear-interpolation.js');

// using neighboring words to set missing start and end time when present
function interpolationOptimization(wordsList) {
  return wordsList.map((word, index) => {
    let wordTmp = word;
    // setting the start time of each unmatched word to the previous word’s end time - when present
    // does not first element in list edge case

    if ('start' in word && index !== 0) {
      let previousWord = wordsList[index - 1];
      if ('end' in previousWord) {
        wordTmp = {
          start: previousWord.end,
          end: word.end,
          text: word.text,
        };
      }
    }
    // TODO: handle first item ?
    // setting the end time of each unmatched word to the next word’s start time - when present
    // does handle last element in list edge case
    if ('end' in word && index !== wordsList.length - 1) {
      let nextWord = wordsList[index + 1];
      if ('start' in nextWord) {
        wordTmp = {
          end: nextWord.start,
          start: word.start,
          text: word.text,
        };
      }
    }
    // TODO: handle last item ?
    return wordTmp;
  });
}

// after the interpolation, some words have overlapping timecodes.
// the end time of the previous word is greater then the start of the current word
// altho negligible when using in a transcript editor context
// we want to avoid this, coz it causes issues when using the time of the words to generate
// auto segmented captions. As it results in sentence
// boundaries overlapping on screen during playback
function adjustTimecodesBoundaries(words) {
  return words.map((word, index, arr) => {
    // excluding first element
    if (index != 0) {
      const previousWord = arr[index - 1];
      const currentWord = word;
      if (previousWord.end > currentWord.start) {
        word.start = previousWord.end;
      }

      return word;
    }

    return word;
  });
}

function interpolate(wordsList) {
  const calculate = linearInterpolation(wordsList);

  console.log(calculate({ start: 1.5 })); // y -> 1.5
  // console.log(calculate({ end: 13.4 })); // x -> 1.5
}

function alignRefTextWithSTT(opCodes, sttWords, transcriptWords) {
  // # create empty list to receive data
  // transcriptData = [{} for _ in range(len(transcriptWords))]
  let transcriptData = [];
  // empty objects as place holder
  transcriptWords.forEach(() => {
    transcriptData.push({});
  });

  // console.log('opCodes', opCodes);
  opCodes.forEach((opCode) => {
    let matchType = opCode[0];
    let sttStartIndex = opCode[1];
    let sttEndIndex = opCode[2];
    let baseTextStartIndex = opCode[3];

    if (matchType === 'equal') {
      // slice does not not include the end - hence +1
      let sttDataSegment = sttWords.slice(sttStartIndex, sttEndIndex);
      transcriptData.splice(baseTextStartIndex, sttDataSegment.length, ...sttDataSegment);
    }
    // # replace words with originals
  });
  // # populate transcriptData with matching words
  const transcriptDataTransposedWordsText = transcriptData.map((wordObject, index) => {
    const wordO = { ...wordObject };
    wordO.text = transcriptWords[index];
    return wordO;
  });
  // # fill in missing timestamps
  return interpolate(transcriptDataTransposedWordsText);
}

module.exports = alignRefTextWithSTT;
