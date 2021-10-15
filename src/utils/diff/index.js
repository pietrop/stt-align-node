const convertTextStringToArrayList = require('../convert-text-string-to-array-list');
const diffGetOpcodes = require('../diff-get-opcodes');

/**
 *
 * @param {json} sttWords - stt transcript json
 * @param {array} sttWords.words
 * @param {float} sttWords.words[0].start
 * @param {float} sttWords.words[0].end
 * @param {float} sttWords.words[0].text
 * @param {string} transcriptText - plain text corrected transcript, base text
 * @returns ?
 */
function diff(sttWords, transcriptText) {
  const transcriptTextArray = convertTextStringToArrayList(transcriptText);
  const diffResults = diffGetOpcodes(sttWords, transcriptTextArray);
  return diffResults;
}

module.exports = diff;
