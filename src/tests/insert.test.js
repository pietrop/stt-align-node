const wordDuration = require("../utils/word-duration");
/**
 * Inserted
 * Inserted, is when a word in the base text human accurate corrected text was not in the STT results.
 * And is therefore considered as inserted.
 */
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
const alignJSONText = require('../index.js').alignSTT;
describe('Inserted - not present in STT, added in human corrected base text', () => {
  test('Inserted one - take start time from previous, and end time from following', () => {
    const baseTextAccurateTranscription =
      'There was a INSERTED day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. ';

    const expectedResult = {
      words: [
        { end: 13.21, start: 13.05, text: 'There' },
        { end: 13.38, start: 13.21, text: 'was' },
        { end: 13.44, start: 13.38, text: 'a' },
        { end: 13.44, start: 13.44, text: 'INSERTED' },
        { end: 13.86, start: 13.44, text: 'day,' },
        { end: 14.13, start: 13.86, text: 'about' },
        { end: 14.37, start: 14.13, text: '10' },
        { end: 14.61, start: 14.37, text: 'years' },
        { end: 15.15, start: 14.61, text: 'ago,' },
        { end: 15.67, start: 15.44, text: 'when' },
        { end: 15.82, start: 15.67, text: 'I' },
        { end: 16.19, start: 15.82, text: 'asked' },
        { end: 16.27, start: 16.19, text: 'a' },
        { end: 16.65, start: 16.27, text: 'friend' },
        { end: 16.74, start: 16.65, text: 'to' },
        { end: 17.2, start: 16.74, text: 'hold' },
        { end: 17.32, start: 17.23, text: 'a' },
        { end: 17.63, start: 17.32, text: 'baby' },
        { end: 18.13, start: 17.63, text: 'dinosaur' },
        { end: 18.61, start: 18.17, text: 'robot' },
        { end: 19.17, start: 18.72, text: 'upside' },
        { end: 19.56, start: 19.17, text: 'down.' },
      ],
    };

    const result = alignJSONText(automatedSttTranscription, baseTextAccurateTranscription);
    expect(result).toEqual(expectedResult.words);
  });

  // TODO: currently this seems to be broken
  // it inserts these two words at the beginning
  test('Inserted two - two consecutive words - take start time from previous, and end time from following', () => {
    const baseTextAccurateTranscription =
      'There was a INSERTED NEW day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. ';

    const expectedResult = {
      words: [
        { end: 13.21, start: 13.05, text: 'There' },
        { end: 13.38, start: 13.21, text: 'was' },
        { end: 13.44, start: 13.38, text: 'a' },
        { end: 13.44, start: 13.44, text: 'INSERTED' }, //<--
        { end: 13.44, start: 13.44, text: 'NEW' }, //<--
        { end: 13.86, start: 13.44, text: 'day,' },
        { end: 14.13, start: 13.86, text: 'about' },
        { end: 14.37, start: 14.13, text: '10' },
        { end: 14.61, start: 14.37, text: 'years' },
        { end: 15.15, start: 14.61, text: 'ago,' },
        { end: 15.67, start: 15.44, text: 'when' },
        { end: 15.82, start: 15.67, text: 'I' },
        { end: 16.19, start: 15.82, text: 'asked' },
        { end: 16.27, start: 16.19, text: 'a' },
        { end: 16.65, start: 16.27, text: 'friend' },
        { end: 16.74, start: 16.65, text: 'to' },
        { end: 17.2, start: 16.74, text: 'hold' },
        { end: 17.32, start: 17.23, text: 'a' },
        { end: 17.63, start: 17.32, text: 'baby' },
        { end: 18.13, start: 17.63, text: 'dinosaur' },
        { end: 18.61, start: 18.17, text: 'robot' },
        { end: 19.17, start: 18.72, text: 'upside' },
        { end: 19.56, start: 19.17, text: 'down.' },
      ],
    };

    const result = alignJSONText(automatedSttTranscription, baseTextAccurateTranscription);
    expect(result).toEqual(expectedResult.words);
  });

  test('Inserted two - two non consecutive words - take start time from previous, and end time from following', () => {
    const baseTextAccurateTranscription =
      'There was a NEW  day, about 10 years ago, when INSERTED I asked a friend to hold a baby dinosaur robot upside down. ';

    const expectedResult = {
      words: [
        { end: 13.21, start: 13.05, text: 'There' },
        { end: 13.38, start: 13.21, text: 'was' },
        { end: 13.44, start: 13.38, text: 'a' },
        { end: 13.44, start: 13.44, text: 'NEW' }, //<--
        { end: 13.86, start: 13.44, text: 'day,' },
        { end: 14.13, start: 13.86, text: 'about' },
        { end: 14.37, start: 14.13, text: '10' },
        { end: 14.61, start: 14.37, text: 'years' },
        { end: 15.15, start: 14.61, text: 'ago,' },
        { end: 15.67, start: 15.44, text: 'when' },
        { end: 15.67, start: 15.67, text: 'INSERTED' }, //<---
        { end: 15.82, start: 15.67, text: 'I' },
        { end: 16.19, start: 15.82, text: 'asked' },
        { end: 16.27, start: 16.19, text: 'a' },
        { end: 16.65, start: 16.27, text: 'friend' },
        { end: 16.74, start: 16.65, text: 'to' },
        { end: 17.2, start: 16.74, text: 'hold' },
        { end: 17.32, start: 17.23, text: 'a' },
        { end: 17.63, start: 17.32, text: 'baby' },
        { end: 18.13, start: 17.63, text: 'dinosaur' },
        { end: 18.61, start: 18.17, text: 'robot' },
        { end: 19.17, start: 18.72, text: 'upside' },
        { end: 19.56, start: 19.17, text: 'down.' },
      ],
    };

    const result = alignJSONText(automatedSttTranscription, baseTextAccurateTranscription);
    expect(result).toEqual(expectedResult.words);
  });

  test('Inserted  - first', () => {
    const baseTextAccurateTranscription =
      'NEW There was a day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. ';

    const expectedResult = {
      words: [
        { end: 13.05, start: 0, text: 'NEW' }, //<--
        { end: 13.21, start: 13.05, text: 'There' },
        { end: 13.38, start: 13.21, text: 'was' },
        { end: 13.44, start: 13.38, text: 'a' },
        { end: 13.86, start: 13.44, text: 'day,' },
        { end: 14.13, start: 13.86, text: 'about' },
        { end: 14.37, start: 14.13, text: '10' },
        { end: 14.61, start: 14.37, text: 'years' },
        { end: 15.15, start: 14.61, text: 'ago,' },
        { end: 15.67, start: 15.44, text: 'when' },
        { end: 15.82, start: 15.67, text: 'I' },
        { end: 16.19, start: 15.82, text: 'asked' },
        { end: 16.27, start: 16.19, text: 'a' },
        { end: 16.65, start: 16.27, text: 'friend' },
        { end: 16.74, start: 16.65, text: 'to' },
        { end: 17.2, start: 16.74, text: 'hold' },
        { end: 17.32, start: 17.23, text: 'a' },
        { end: 17.63, start: 17.32, text: 'baby' },
        { end: 18.13, start: 17.63, text: 'dinosaur' },
        { end: 18.61, start: 18.17, text: 'robot' },
        { end: 19.17, start: 18.72, text: 'upside' },
        { end: 19.56, start: 19.17, text: 'down.' },
      ],
    };

    const result = alignJSONText(automatedSttTranscription, baseTextAccurateTranscription);
    expect(result).toEqual(expectedResult.words);
  });

  test('Inserted  - first - with custom start time', () => {
    const baseTextAccurateTranscription =
      'NEW There was a day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. ';
    const customStartTime = 13;
    const expectedResult = {
      words: [
        { end: 13.05, start: customStartTime, text: 'NEW' }, //<--
        { end: 13.21, start: 13.05, text: 'There' },
        { end: 13.38, start: 13.21, text: 'was' },
        { end: 13.44, start: 13.38, text: 'a' },
        { end: 13.86, start: 13.44, text: 'day,' },
        { end: 14.13, start: 13.86, text: 'about' },
        { end: 14.37, start: 14.13, text: '10' },
        { end: 14.61, start: 14.37, text: 'years' },
        { end: 15.15, start: 14.61, text: 'ago,' },
        { end: 15.67, start: 15.44, text: 'when' },
        { end: 15.82, start: 15.67, text: 'I' },
        { end: 16.19, start: 15.82, text: 'asked' },
        { end: 16.27, start: 16.19, text: 'a' },
        { end: 16.65, start: 16.27, text: 'friend' },
        { end: 16.74, start: 16.65, text: 'to' },
        { end: 17.2, start: 16.74, text: 'hold' },
        { end: 17.32, start: 17.23, text: 'a' },
        { end: 17.63, start: 17.32, text: 'baby' },
        { end: 18.13, start: 17.63, text: 'dinosaur' },
        { end: 18.61, start: 18.17, text: 'robot' },
        { end: 19.17, start: 18.72, text: 'upside' },
        { end: 19.56, start: 19.17, text: 'down.' },
      ],
    };

    const result = alignJSONText(
      automatedSttTranscription,
      baseTextAccurateTranscription,
      customStartTime
    );
    expect(result).toEqual(expectedResult.words);
  });

  // this one works, but not sure where the 13.025 number comes from?
  test('Insert 2 first', () => {
    const baseTextAccurateTranscription =
      'TEST1 TEST2 There was a  day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down.';

    const customStartTime = 13.025;
    const expectedResult = {
      words: [
        { end: 13.05, start: 13.025, text: 'TEST1' }, //<--
        { end: 13.05, start: 13.05, text: 'TEST2' }, //<--
        { end: 13.21, start: 13.05, text: 'There' },
        { end: 13.38, start: 13.21, text: 'was' },
        { end: 13.44, start: 13.38, text: 'a' },
        { end: 13.86, start: 13.44, text: 'day,' },
        { end: 14.13, start: 13.86, text: 'about' },
        { end: 14.37, start: 14.13, text: '10' },
        { end: 14.61, start: 14.37, text: 'years' },
        { end: 15.15, start: 14.61, text: 'ago,' },
        { end: 15.67, start: 15.44, text: 'when' },
        { end: 15.82, start: 15.67, text: 'I' },
        { end: 16.19, start: 15.82, text: 'asked' },
        { end: 16.27, start: 16.19, text: 'a' },
        { end: 16.65, start: 16.27, text: 'friend' },
        { end: 16.74, start: 16.65, text: 'to' },
        { end: 17.2, start: 16.74, text: 'hold' },
        { end: 17.32, start: 17.23, text: 'a' },
        { end: 17.63, start: 17.32, text: 'baby' },
        { end: 18.13, start: 17.63, text: 'dinosaur' },
        { end: 18.61, start: 18.17, text: 'robot' },
        { end: 19.17, start: 18.72, text: 'upside' },
        { end: 19.56, start: 19.17, text: 'down.' },
      ],
    };

    const result = alignJSONText(
      automatedSttTranscription,
      baseTextAccurateTranscription,
      customStartTime
    );
    expect(result).toEqual(expectedResult.words);
  });

  test('Inserted - last word', () => {
    const baseTextAccurateTranscription =
      'There was a  day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. NEW';

    const expectedResult = {
      words: [
        { end: 13.21, start: 13.05, text: 'There' },
        { end: 13.38, start: 13.21, text: 'was' },
        { end: 13.44, start: 13.38, text: 'a' },
        { end: 13.86, start: 13.44, text: 'day,' },
        { end: 14.13, start: 13.86, text: 'about' },
        { end: 14.37, start: 14.13, text: '10' },
        { end: 14.61, start: 14.37, text: 'years' },
        { end: 15.15, start: 14.61, text: 'ago,' },
        { end: 15.67, start: 15.44, text: 'when' },
        { end: 15.82, start: 15.67, text: 'I' },
        { end: 16.19, start: 15.82, text: 'asked' },
        { end: 16.27, start: 16.19, text: 'a' },
        { end: 16.65, start: 16.27, text: 'friend' },
        { end: 16.74, start: 16.65, text: 'to' },
        { end: 17.2, start: 16.74, text: 'hold' },
        { end: 17.32, start: 17.23, text: 'a' },
        { end: 17.63, start: 17.32, text: 'baby' },
        { end: 18.13, start: 17.63, text: 'dinosaur' },
        { end: 18.61, start: 18.17, text: 'robot' },
        { end: 19.17, start: 18.72, text: 'upside' },
        { end: 19.56, start: 19.17, text: 'down.' },
        { end:19.56+ wordDuration('NEW'), start: 19.56, text: 'NEW' },
      ],
    };

    const result = alignJSONText(automatedSttTranscription, baseTextAccurateTranscription);
    expect(result).toEqual(expectedResult.words);
  });

  test('Inserted - 2 last', () => {
    const baseTextAccurateTranscription =
      'There was a  day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. NEW INSERTED';

    const expectedResult = {
      words: [
        { end: 13.21, start: 13.05, text: 'There' },
        { end: 13.38, start: 13.21, text: 'was' },
        { end: 13.44, start: 13.38, text: 'a' },
        { end: 13.86, start: 13.44, text: 'day,' },
        { end: 14.13, start: 13.86, text: 'about' },
        { end: 14.37, start: 14.13, text: '10' },
        { end: 14.61, start: 14.37, text: 'years' },
        { end: 15.15, start: 14.61, text: 'ago,' },
        { end: 15.67, start: 15.44, text: 'when' },
        { end: 15.82, start: 15.67, text: 'I' },
        { end: 16.19, start: 15.82, text: 'asked' },
        { end: 16.27, start: 16.19, text: 'a' },
        { end: 16.65, start: 16.27, text: 'friend' },
        { end: 16.74, start: 16.65, text: 'to' },
        { end: 17.2, start: 16.74, text: 'hold' },
        { end: 17.32, start: 17.23, text: 'a' },
        { end: 17.63, start: 17.32, text: 'baby' },
        { end: 18.13, start: 17.63, text: 'dinosaur' },
        { end: 18.61, start: 18.17, text: 'robot' },
        { end: 19.17, start: 18.72, text: 'upside' },
        { end: 19.56, start: 19.17, text: 'down.' },
        { end:19.56+ wordDuration('NEW'), start: 19.56, text: 'NEW' },
        { end: 19.56+ wordDuration('NEW')+ wordDuration('INSERTED'), start: 19.56+ wordDuration('NEW'), text: 'INSERTED' },
      ],
    };

    const result = alignJSONText(automatedSttTranscription, baseTextAccurateTranscription);
    expect(result).toEqual(expectedResult.words);
  });
});
