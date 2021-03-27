const convertTextStringToArrayList = require('./utils/convert-text-string-to-array-list');
const alignRefTextWithSTT = require('./align/index.js');
const diff = require('./utils/diff');
///////////////////////////////////////////////////////////////
// const countDiffs = require('./extra/count-diffs/index.js');
// const getDiffsList = require('./extra/diffs-list/index.js');
// const calculateWordDuration = require('./utils/calculate-word-duration/index.js');
// const diffsListToHtml = require('./extra/diffs-list-to-html/index.js').diffsListToHtml;
// const diffsListToHtmlContentOnly = require('./extra/diffs-list-to-html/html-content-only.js')
//   .diffsListToHtmlContentOnly;

function alignSTT(sttWords, transcriptText, optionalSegmentStartTime = 0) {
  // Handle edge case, if transcriptText is an empty string
  if (transcriptText === '') {
    return [];
  }
  const sttWordsList = sttWords.words;
  const opCodes = diff(sttWordsList, transcriptText);
  const transcriptWords = convertTextStringToArrayList(transcriptText);
  const alignedResults = alignRefTextWithSTT(
    opCodes,
    sttWordsList,
    transcriptWords,
    optionalSegmentStartTime
  );
  return alignedResults;
}
///////////////////////////////////////////////////////////////

// function diffsListAsHtml(sttWords, transcriptText, mediaUrl) {
//   const sttWordsList = handleBaseTextWords(sttWords);
//   const opCodes = diff(sttWordsList, transcriptText);
//   const transcriptWords = convertTextStringToArrayList(transcriptText);
//   const alignedResults = getDiffsList(opCodes, sttWordsList, transcriptWords);
//   return diffsListToHtml(alignedResults, mediaUrl);
// }

// /**
//  *
//  * @param {array} sttWords  - array of word objects
//  * @param {string} sttWords - plain text of the base transcript
//  * @param {string} transcriptText - STT transcript text
//  */
// function diffsList(sttWords, transcriptText) {
//   const sttWordsList = handleBaseTextWords(sttWords);
//   const opCodes = diff(sttWordsList, transcriptText);
//   const transcriptWords = convertTextStringToArrayList(transcriptText);
//   const alignedResults = getDiffsList(opCodes, sttWordsList, transcriptWords);
//   return alignedResults;
// }

// /**
//  *
//  * @param {array} sttWords  - array of word objects
//  * @param {string} sttWords - plain text of the base transcript
//  * handles base text, either as string
//  * or as a array of word objects
//  * by converting base text plain text transcript
//  * into array of word objects, with mock time attributes
//  * to be able to use other functions to calculate diffs, wer etc..
//  * @returns list of word objects
//  */
// function handleBaseTextWords(sttWords) {
//   let sttWordsList;
//   if (typeof sttWords === 'string') {
//     sttWordsList = sttWords.split(' ').map((word, index) => {
//       return {
//         text: word,
//         start: 0,
//         end: 0,
//         id: index,
//         index,
//       };
//     });
//   } else {
//     sttWordsList = sttWords.words;
//   }
//   return sttWordsList;
// }

// /**
//  *
//  * @param {array} sttWords  - array of word objects
//  * @param {string} sttWords - plain text of the base transcript
//  * @param {string} transcriptText - STT transcript text
//  */
// function diffsCount(sttWords, transcriptText) {
//   const sttWordsList = handleBaseTextWords(sttWords);

//   const opCodes = diff(sttWordsList, transcriptText);
//   const transcriptWords = convertTextStringToArrayList(transcriptText);
//   const alignedResults = countDiffs(opCodes, sttWordsList, transcriptWords);
//   const { replace, insert, baseTextTotalWordCount } = alignedResults;
//   alignedResults.wer = calculateWer({
//     replace,
//     insert,
//     deleteValue: alignedResults['delete'],
//     baseTextTotalWordCount,
//   });
//   return alignedResults;
// }

// // https://en.wikipedia.org/wiki/Word_error_rate
// function calculateWer({ replace, insert, deleteValue, baseTextTotalWordCount }) {
//   return (replace + deleteValue + insert) / baseTextTotalWordCount;
// }

// /**
//  *
//  * @param {array} sttWords  - array of word objects
//  * @param {string} sttWords - plain text of the base transcript
//  * @param {string} transcriptText - STT transcript text
//  */
// function diffsListAsHtmlContentOnly(sttWords, transcriptText) {
//   const sttWordsList = handleBaseTextWords(sttWords);
//   const opCodes = diff(sttWordsList, transcriptText);
//   const transcriptWords = convertTextStringToArrayList(transcriptText);
//   const alignedResults = getDiffsList(opCodes, sttWordsList, transcriptWords);
//   return diffsListToHtmlContentOnly(alignedResults);
// }

module.exports = alignSTT;
module.exports.alignSTT = alignSTT;
// module.exports.diffsList = diffsList;
// module.exports.diffsListToHtmlContentOnly = diffsListToHtmlContentOnly;
// module.exports.diffsCount = diffsCount;
// module.exports.calculateWordDuration = calculateWordDuration;
// module.exports.diffsListToHtml = diffsListToHtml;
// module.exports.diffsListAsHtml = diffsListAsHtml;
// module.exports.diffsListAsHtmlContentOnly = diffsListAsHtmlContentOnly;
