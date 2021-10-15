/**
 * Currently not in use
 *
 * after the interpolation, some words have overlapping timecodes.
 * the end time of the previous word is greater then the start of the current word
 * altho negligible when using in a transcript editor context
 * we want to avoid this, coz it causes issues when using the time of the words to generate
 * auto segmented captions. As it results in sentence
 * boundaries overlapping on screen during playback
 * @param {array} words - dpe words list
 * @returns {array} dpe words list
 */

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

module.exports = adjustTimecodesBoundaries;
