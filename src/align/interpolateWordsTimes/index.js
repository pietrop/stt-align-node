function interpolateWordsTimes(lineText, lineStartTime, lineEndTime, firstWordIndex) {
  // TODO: refactor to split via regex on space
  const wordsList = lineText.split(' ');
  if (lineStartTime === lineEndTime) {
    return wordsList.map((word) => {
      return { start: lineStartTime, end: lineEndTime, text: word };
    });
  } else {
    const numberOfWords = wordsList.length; //10
    console.log('numberOfWords', numberOfWords);
    const duration = lineEndTime - lineStartTime; //35
    const unit = duration / numberOfWords; //3.5
    const list = new Array(numberOfWords);
    list[0] = lineStartTime;
    let acc = 0;
    const newList = Array.from(list, (x, i) => {
      acc += unit;
      return acc;
    });
    const newListWithOffset = newList.map((l) => {
      return l + lineStartTime;
    });
    console.log('newListWithOffset', newListWithOffset);
    const wordsListWordsResults = newListWithOffset.map((time, index) => {
      return {
        text: wordsList[index],
        start: time,
        end: time,
        index: index + firstWordIndex,
      };
    });
    return wordsListWordsResults;
  }
}

module.exports = interpolateWordsTimes;

const lineText =
  'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.';
const lineStartTime = 20;
const lineEndTime = 30;
const firstWordIndex = 10;

const interpolatedWords = interpolateWordsTimes(
  lineText,
  lineStartTime,
  lineEndTime,
  firstWordIndex
);

console.log('interpolatedWords', interpolatedWords);
