const interpolateWordsTimes = require('./interpolateWordsTimes/index.js');
const linear = require('everpolate').linear;
// https://stackoverflow.com/questions/22627125/grouping-consecutive-elements-together-using-javascript
function groupingConsecutive(data) {
  return data.reduce(function (a, b, i, v) {
    if (b !== undefined) {
      // ignore undefined entries
      if (v[i - 1] === undefined) {
        // if this is the start of a new run
        a.push([]); // then create a new subarray
      }
      a[a.length - 1].push(b); // append current value to subarray
    }
    return a; // return state for next iteration
  }, []); // initial top-level array
}
// };
// const linear = (x, y, a) => x * (1 - a) + y * a;
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

function interpolate(wordsList, optionalSegmentStartTime = 0) {
  const wordsListWithIndexes = wordsList.map((w, index) => {
    return { ...w, index };
  });

  const wordsWithoutTime = wordsListWithIndexes.map((word, index) => {
    if (!word.start && !word.end) {
      return { ...word, index };
    }
  });
  // console.log('wordsWithoutTime', wordsWithoutTime);
  const wordsWithTime = wordsListWithIndexes.map((word, index) => {
    if (word.start && word.end) {
      return { ...word, index };
    }
  });
  // console.log('wordsWithTime', wordsWithTime);

  const wordsListGroupedConsecutiveWithTime = groupingConsecutive(wordsWithTime);
  const wordsListGroupedConsecutive = groupingConsecutive(wordsWithoutTime);

  const wordsListGroupedConsecutiveInterpolated = wordsListGroupedConsecutive.map((group) => {
    if (group.length === 1) {
      const word = group[0];
      const wordIndex = word.index;
      // handle if previous word does not have timecode
      // eg handle if previous word is first word without timecode
      let wordStartTime;
      if (wordsListWithIndexes[wordIndex - 1]) {
        wordStartTime = wordsListWithIndexes[wordIndex - 1].end;
      } else {
        // TODO: should only apply if it's first word in list
        // index === 0
        wordStartTime = optionalSegmentStartTime;
      }
      // Handle edge case, when last word in the list
      // eg with inserted word at the end
      let wordEndTime;
      if (wordsListWithIndexes[wordIndex + 1]) {
        wordEndTime = wordsListWithIndexes[wordIndex + 1].start;
      } else {
        // const currentWordStart = wordsListWithIndexes[wordIndex].start;
        // const currentWordEnd = wordsListWithIndexes[wordIndex].end;
        // const duration = currentWordEnd - currentWordStart;
        wordEndTime = wordStartTime;
      }

      word.start = wordStartTime;
      word.end = wordEndTime;
      return [word];
    } else {
      // TODO: if first word then zero
      // TODO: if last word - not sure yet
      const firstWordIndex = group[0].index;
      const lastWordIndex = group[group.length - 1].index;
      const lineText = group
        .map((w) => {
          return w.text;
        })
        .join(' ');

      let lineStartTime;
      if (wordsListWithIndexes[firstWordIndex - 1]) {
        lineStartTime = wordsListWithIndexes[firstWordIndex - 1].end;
      } else {
        // TODO: should only apply if it's first word in list
        // index === 0
        lineStartTime = optionalSegmentStartTime;
      }

      // TODO: handling edge case, see above
      let lineEndTime;
      if (wordsListWithIndexes[lastWordIndex + 1]) {
        lineEndTime = wordsListWithIndexes[lastWordIndex + 1].start;
      } else {
        lineEndTime = lineStartTime;
      }

      const interpolatedWords = interpolateWordsTimes(
        lineText,
        lineStartTime,
        lineEndTime,
        firstWordIndex
      );
      return interpolatedWords;
    }
  });

  // recombining words
  const interpolatedWords = [
    wordsListGroupedConsecutiveWithTime.flat(),
    wordsListGroupedConsecutiveInterpolated.flat(),
  ].flat();

  // console.log('interpolatedWords', interpolatedWords);

  // re-sort the word's
  const sortedWords = interpolatedWords.sort((a, b) => (a.index > b.index ? 1 : -1));
  // console.log('sortedWords', sortedWords);
  // removing indexes?
  // return sortedWords;
  return sortedWords.map(({ start, end, text }) => {
    return { start, end, text };
  });
}

function alignRefTextWithSTT(opCodes, sttWords, transcriptWords, optionalSegmentStartTime = 0) {
  // # create empty list to receive data
  // transcriptData = [{} for _ in range(len(transcriptWords))]
  let transcriptData = [];
  // empty objects as place holder
  transcriptWords.forEach(() => {
    transcriptData.push({});
  });

  opCodes.forEach((opCode) => {
    let matchType = opCode[0];
    let sttStartIndex = opCode[1];
    let sttEndIndex = opCode[2];
    let baseTextStartIndex = opCode[3];
    // console.log('matchType', matchType);
    if (matchType === 'equal') {
      // slice does not not include the end - hence +1
      let sttDataSegment = sttWords.slice(sttStartIndex, sttEndIndex);
      transcriptData.splice(baseTextStartIndex, sttDataSegment.length, ...sttDataSegment);
    }
    // if (matchType === 'insert') {
    //   console.log(opCode);
    // }
  });
  // # replace words with originals
  // # populate transcriptData with matching words
  const transcriptDataTransposedWordsText = transcriptData.map((wordObject, index) => {
    const wordO = { ...wordObject };
    wordO.text = transcriptWords[index];
    return wordO;
  });
  // # fill in missing timestamps
  return interpolate(transcriptDataTransposedWordsText, optionalSegmentStartTime);
}

module.exports = alignRefTextWithSTT;
