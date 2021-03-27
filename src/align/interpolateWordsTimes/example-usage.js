const interpolateWordsTimes = require('./index.js');

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
