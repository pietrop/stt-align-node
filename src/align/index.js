const interpolateWordsTimes = require('./interpolateWordsTimes/index.js');
// const linear = require('everpolate').linear;
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

function interpolate(wordsList) {
  const wordsListWithIndexes = wordsList.map((w, index) => {
    return { ...w, index };
  });

  const wordsWithoutTime = wordsListWithIndexes.map((word, index) => {
    if (!word.start && !word.end) {
      return { ...word, index };
    }
  });
  const wordsWithTime = wordsListWithIndexes.map((word, index) => {
    if (word.start && word.end) {
      return { ...word, index };
    }
  });

  const wordsListGroupedConsecutiveWithTime = groupingConsecutive(wordsWithTime);
  const wordsListGroupedConsecutive = groupingConsecutive(wordsWithoutTime);

  const wordsListGroupedConsecutiveInterpolated = wordsListGroupedConsecutive.map((group) => {
    if (group.length === 1) {
      const word = group[0];
      const wordIndex = word.index;
      const wordStartTime = wordsListWithIndexes[wordIndex - 1].end;
      const wordEndTime = wordsListWithIndexes[wordIndex + 1].start;
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

      const lineStartTime = wordsListWithIndexes[firstWordIndex - 1].end;
      const lineEndTime = wordsListWithIndexes[lastWordIndex + 1].start;
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

  // re-sort the word's
  return interpolatedWords.sort((a, b) => (a.index > b.index ? 1 : -1));
}

function alignRefTextWithSTT(opCodes, sttWords, transcriptWords) {
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
    if (matchType === 'equal') {
      // slice does not not include the end - hence +1
      let sttDataSegment = sttWords.slice(sttStartIndex, sttEndIndex);
      transcriptData.splice(baseTextStartIndex, sttDataSegment.length, ...sttDataSegment);
    }
  });
  // # replace words with originals
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
