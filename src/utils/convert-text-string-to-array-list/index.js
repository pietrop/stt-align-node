const removeCarriageReturnFromString = (refText) => {
  return refText.trim().replace(/\n\n/g, ' ').replace(/\n/g, ' ');
};

const removeExtraWhiteSpaces = (text) => {
  return text.trim().replace(/\s\s+/g, ' ');
};

const splitOnWhiteSpaces = (text) => {
  return removeExtraWhiteSpaces(text).split(' ');
};

function convertTextStringToArrayList(refText) {
  const transcriptTextWithoutLineBreaks = removeCarriageReturnFromString(refText);
  // const transcriptTextArray = transcriptTextWithoutLineBreaks.split(' ');
  const transcriptTextArray = splitOnWhiteSpaces(transcriptTextWithoutLineBreaks);
  return transcriptTextArray;
}

module.exports = convertTextStringToArrayList;
// module.exports.removeCarriageReturnFromString = removeCarriageReturnFromString;
// module.exports.removeExtraWhiteSpaces = removeExtraWhiteSpaces;
// module.exports.splitOnWhiteSpaces = splitOnWhiteSpaces;
