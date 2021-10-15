/**
 * Currently not in use
 *
 * using neighboring words to set missing start and end time when present
 * @param {array} wordsList  - dpe words list
 * @returns dpe words list
 */
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

module.exports = interpolationOptimization;
