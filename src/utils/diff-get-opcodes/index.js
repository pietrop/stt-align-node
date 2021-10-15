const difflib = require('difflib');
const normaliseWord = require('../normalise-word/index.js');
/**
 *
 * @param {array} sttData - array of STT words
 * @param {array} transcriptWords - array of base text accurate words
 * @return {array} opCodes - diffs opcodes
 */
function diffGetOpcodes(sttWords, transcriptWords) {
  // # convert words to lowercase and remove numbers and special characters
  // sttWordsStripped = [re.sub('[^a-z]', '', word.lower()) for word in sttWords]
  const sttWordsStripped = sttWords.map((word) => {
    return normaliseWord(word.text);
  });

  // transcriptWordsStripped = [re.sub('[^a-z]', '', word.lower()) for word in transcriptWords]
  const transcriptWordsStripped = transcriptWords.map((word) => {
    return normaliseWord(word);
  });

  // see python difflib version, explnation for SequenceMatcher https://docs.python.org/3/library/difflib.html
  const matcher = new difflib.SequenceMatcher(null, sttWordsStripped, transcriptWordsStripped);
  // see python difflib get_opcodes() version https://docs.python.org/3/library/difflib.html#difflib.SequenceMatcher.get_opcodes
  const opCodes = matcher.getOpcodes();
  return opCodes;
}

module.exports = diffGetOpcodes;
