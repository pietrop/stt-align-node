const difflib = require('difflib');
const normaliseWord = require('./normalise-word/index.js');
const countDiffs = require('./count-diffs/index.js');
const getDiffsList = require('./diffs-list/index.js');
const alignRefTextWithSTT = require('./align/index.js');
const calculateWordDuration = require('./calculate-word-duration/index.js');
const diffsListToHtml = require('./diffs-list-to-html/index.js').diffsListToHtml;
const diffsListToHtmlContentOnly = require('./diffs-list-to-html/html-content-only.js').diffsListToHtmlContentOnly;

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

  const matcher = new difflib.SequenceMatcher(null, sttWordsStripped, transcriptWordsStripped);
  const opCodes = matcher.getOpcodes();
  return opCodes;
}

function removeNewLinesFromRefText(refText) {
  return refText.trim().replace(/\n\n/g, ' ').replace(/\n/g, ' ');
}

function convertRefTextToList(refText) {
  const transcriptTextWithoutLineBreaks = removeNewLinesFromRefText(refText);
  const transcriptTextArray = transcriptTextWithoutLineBreaks.split(' ');
  return transcriptTextArray;
}

/**
 *
 * @param {json} sttWords - stt transcript json
 * @param {array} sttWords.words
 * @param {float} sttWords.words[0].start
 * @param {float} sttWords.words[0].end
 * @param {float} sttWords.words[0].text
 * @param {string} transcriptText - plain text corrected transcript, base text
 */
function diff(sttWords, transcriptText) {
  const transcriptTextArray = convertRefTextToList(transcriptText);
  const diffResults = diffGetOpcodes(sttWords, transcriptTextArray);
  return diffResults;
}

function alignSTT(sttWords, transcriptText) {
  const sttWordsList = sttWords.words;
  const opCodes = diff(sttWordsList, transcriptText);
  const transcriptWords = convertRefTextToList(transcriptText);
  const alignedResults = alignRefTextWithSTT(opCodes, sttWordsList, transcriptWords);
  return alignedResults;
}

///////////////////////////////////////////////////////////////

function diffsListAsHtml(sttWords, transcriptText, mediaUrl) {
  const sttWordsList = handleBaseTextWords(sttWords);
  const opCodes = diff(sttWordsList, transcriptText);
  const transcriptWords = convertRefTextToList(transcriptText);
  const alignedResults = getDiffsList(opCodes, sttWordsList, transcriptWords);
  return diffsListToHtml(alignedResults, mediaUrl);
}

/**
 *
 * @param {array} sttWords  - array of word objects
 * @param {string} sttWords - plain text of the base transcript
 * @param {string} transcriptText - STT transcript text
 */
function diffsList(sttWords, transcriptText) {
  const sttWordsList = handleBaseTextWords(sttWords);
  const opCodes = diff(sttWordsList, transcriptText);
  const transcriptWords = convertRefTextToList(transcriptText);
  const alignedResults = getDiffsList(opCodes, sttWordsList, transcriptWords);
  return alignedResults;
}

/**
 *
 * @param {array} sttWords  - array of word objects
 * @param {string} sttWords - plain text of the base transcript
 * handles base text, either as string
 * or as a array of word objects
 * by converting base text plain text transcript
 * into array of word objects, with mock time attributes
 * to be able to use other functions to calculate diffs, wer etc..
 * @returns list of word objects
 */
function handleBaseTextWords(sttWords) {
  let sttWordsList;
  if (typeof sttWords === 'string') {
    sttWordsList = sttWords.split(' ').map((word, index) => {
      return {
        text: word,
        start: 0,
        end: 0,
        id: index,
        index,
      };
    });
  } else {
    sttWordsList = sttWords.words;
  }
  return sttWordsList;
}

/**
 *
 * @param {array} sttWords  - array of word objects
 * @param {string} sttWords - plain text of the base transcript
 * @param {string} transcriptText - STT transcript text
 */
function diffsCount(sttWords, transcriptText) {
  const sttWordsList = handleBaseTextWords(sttWords);

  const opCodes = diff(sttWordsList, transcriptText);
  const transcriptWords = convertRefTextToList(transcriptText);
  const alignedResults = countDiffs(opCodes, sttWordsList, transcriptWords);
  const { replace, insert, baseTextTotalWordCount } = alignedResults;
  alignedResults.wer = calculateWer({ replace, insert, deleteValue: alignedResults['delete'], baseTextTotalWordCount });
  return alignedResults;
}

// https://en.wikipedia.org/wiki/Word_error_rate
function calculateWer({ replace, insert, deleteValue, baseTextTotalWordCount }) {
  return (replace + deleteValue + insert) / baseTextTotalWordCount;
}

/**
 *
 * @param {array} sttWords  - array of word objects
 * @param {string} sttWords - plain text of the base transcript
 * @param {string} transcriptText - STT transcript text
 */
function diffsListAsHtmlContentOnly(sttWords, transcriptText) {
  const sttWordsList = handleBaseTextWords(sttWords);
  const opCodes = diff(sttWordsList, transcriptText);
  const transcriptWords = convertRefTextToList(transcriptText);
  const alignedResults = getDiffsList(opCodes, sttWordsList, transcriptWords);
  return diffsListToHtmlContentOnly(alignedResults);
}

module.exports = alignSTT;
module.exports.alignSTT = alignSTT;
module.exports.diffsList = diffsList;
module.exports.diffsListToHtmlContentOnly = diffsListToHtmlContentOnly;
module.exports.diffsCount = diffsCount;
module.exports.calculateWordDuration = calculateWordDuration;
module.exports.diffsListToHtml = diffsListToHtml;
module.exports.diffsListAsHtml = diffsListAsHtml;
module.exports.diffsListAsHtmlContentOnly = diffsListAsHtmlContentOnly;
