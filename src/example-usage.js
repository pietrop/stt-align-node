const alignJSONText = require('./index.js').alignSTT;
const baseTextAccurateTranscription =
  'There TEST00 TEST0 a day, about 10 years TEST1 TEST2 ago, when I asked a TEST3 friend to hold a baby TEST4 TEST5 TEST6 robot upside TEST7 down. ';
const automatedSttTranscription = {
  words: [
    { start: 13.05, end: 13.21, text: 'there' },
    { start: 13.21, end: 13.38, text: 'is' },
    { start: 13.38, end: 13.44, text: 'a' },
    { start: 13.44, end: 13.86, text: 'day' },
    { start: 13.86, end: 14.13, text: 'about' },
    { start: 14.13, end: 14.37, text: 'ten' },
    { start: 14.37, end: 14.61, text: 'years' },
    { start: 14.61, end: 15.15, text: 'ago' },
    { start: 15.44, end: 15.67, text: 'when' },
    { start: 15.67, end: 15.82, text: 'i' },
    { start: 15.82, end: 16.19, text: 'asked' },
    { start: 16.19, end: 16.27, text: 'a' },
    { start: 16.27, end: 16.65, text: 'friend' },
    { start: 16.65, end: 16.74, text: 'to' },
    { start: 16.74, end: 17.2, text: 'hold' },
    { start: 17.23, end: 17.32, text: 'a' },
    { start: 17.32, end: 17.63, text: 'baby' },
    { start: 17.63, end: 18.13, text: 'dinosaur' },
    { start: 18.17, end: 18.61, text: 'robot' },
    { start: 18.72, end: 19.17, text: 'upside' },
    { start: 19.17, end: 19.56, text: 'down' },
  ],
};

const result = alignJSONText(automatedSttTranscription, baseTextAccurateTranscription);
console.log(result);
