/**
 * TODO: Replaced
 * TODO: Doesn't work coz current algo doesn't handle case when a word is replaced
 * as a special case. It just treats it as the other cases. And estimates new timecodes for it.
 * Ideally we'd want to preserve the timecodes
 * TODO: add replace all
 */
const alignJSONText = require('../index.js').alignSTT;

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

describe('Replace - utterance recognised in STT replaced by words changed in base text human corrected one', () => {
  test('replaced one -  where start time of replaced is the same as the end time of prevous one', () => {
    // const baseTextAccurateTranscription ='There was a day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. ';

    const baseTextAccurateTranscription =
      'There was a MONTH, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. ';

    const expectedResult = {
      words: [
        { end: 13.21, start: 13.05, text: 'There' },
        { end: 13.38, start: 13.21, text: 'was' },
        { end: 13.44, start: 13.38, text: 'a' },
        { end: 13.86, start: 13.44, text: 'MONTH,' }, //<-- replaced
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

  // TODO: this one doesn't work. current behaviour, is that when replacing
  // it goes and grab the timecode of the previous words.
  // This is fine-ish~ but introduces deterioration in the accuracy of the timcodes
  test.skip('replaced one - where start time of replaced is different from the end time of prevous one', () => {
    // const baseTextAccurateTranscription ='There was a day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. ';

    const baseTextAccurateTranscription =
      'There was a day, about 10 years ago, REPLACED I asked a friend to hold a baby dinosaur robot upside down. ';

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
        { end: 15.67, start: 15.44, text: 'REPLACED' }, //<-- replaced
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

  test.skip('replaced - two consecutive ', () => {
    // const baseTextAccurateTranscription ='There was a day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. ';

    const baseTextAccurateTranscription =
      'There was a day, about 10 years ago, REPLACED REPLACED2 asked a friend to hold a baby dinosaur robot upside down. ';

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
        { end: 15.67, start: 15.44, text: 'REPLACED' }, //<-- replaced
        { end: 15.82, start: 15.67, text: 'REPLACED2' }, //<-- replaced
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

  // TODO: this is an edge case, but it also doesn't work
  test.skip('replaced -  replaced all - with custom start time', () => {
    // const baseTextAccurateTranscription ='There was a day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. ';

    const baseTextAccurateTranscription =
      'REPLACED1 REPLACED2 REPLACED3 REPLACED4 REPLACED5 REPLACED6 REPLACED7 REPLACED8 REPLACED9 REPLACED10 REPLACED11 REPLACED12 REPLACED13 REPLACED14 REPLACED15 REPLACED16 REPLACED17 REPLACED18 REPLACED19 REPLACED20 REPLACED21';
    const customStartTime = 13;
    const expectedResult = {
      words: [
        { end: 13.21, start: customStartTime, text: 'REPLACED1' }, //<-- replaced
        { end: 13.38, start: 13.21, text: 'REPLACED2' }, //<-- replaced
        { end: 13.44, start: 13.38, text: 'REPLACED3' }, //<-- replaced
        { end: 13.86, start: 13.44, text: 'REPLACED4' }, //<-- replaced
        { end: 14.13, start: 13.86, text: 'REPLACED5' }, //<-- replaced
        { end: 14.37, start: 14.13, text: 'REPLACED6' }, //<-- replaced
        { end: 14.61, start: 14.37, text: 'REPLACED7' }, //<-- replaced
        { end: 15.15, start: 14.61, text: 'REPLACED8' }, //<-- replaced
        { end: 15.67, start: 15.44, text: 'REPLACED9' }, //<-- replaced
        { end: 15.82, start: 15.67, text: 'REPLACED10' }, //<-- replaced
        { end: 16.19, start: 15.82, text: 'REPLACED11' }, //<-- replaced
        { end: 16.27, start: 16.19, text: 'REPLACED12' }, //<-- replaced
        { end: 16.65, start: 16.27, text: 'REPLACED13' }, //<-- replaced
        { end: 16.74, start: 16.65, text: 'REPLACED14' }, //<-- replaced
        { end: 17.2, start: 16.74, text: 'REPLACED15' }, //<-- replaced
        { end: 17.32, start: 17.23, text: 'REPLACED16' }, //<-- replaced
        { end: 17.63, start: 17.32, text: 'REPLACED17' }, //<-- replaced
        { end: 18.13, start: 17.63, text: 'REPLACED18' }, //<-- replaced
        { end: 18.61, start: 18.17, text: 'REPLACED19' }, //<-- replaced
        { end: 19.17, start: 18.72, text: 'REPLACED19' }, //<-- replaced
        { end: 19.56, start: 19.17, text: 'REPLACED20' }, //<-- replaced
      ],
    };

    const result = alignJSONText(
      automatedSttTranscription,
      baseTextAccurateTranscription,
      customStartTime
    );
    expect(result).toEqual(expectedResult.words);
  });
  // TODO: this is an edge case, but it also doesn't work
  test.skip('replaced -  replaced all - without custom start time', () => {
    // const baseTextAccurateTranscription ='There was a day, about 10 years ago, when I asked a friend to hold a baby dinosaur robot upside down. ';

    const baseTextAccurateTranscription =
      'REPLACED1 REPLACED2 REPLACED3 REPLACED4 REPLACED5 REPLACED6 REPLACED7 REPLACED8 REPLACED9 REPLACED10 REPLACED11 REPLACED12 REPLACED13 REPLACED14 REPLACED15 REPLACED16 REPLACED17 REPLACED18 REPLACED19 REPLACED20 REPLACED21';

    const expectedResult = {
      words: [
        { end: 13.21, start: 13.05, text: 'REPLACED1' }, //<-- replaced
        { end: 13.38, start: 13.21, text: 'REPLACED2' }, //<-- replaced
        { end: 13.44, start: 13.38, text: 'REPLACED3' }, //<-- replaced
        { end: 13.86, start: 13.44, text: 'REPLACED4' }, //<-- replaced
        { end: 14.13, start: 13.86, text: 'REPLACED5' }, //<-- replaced
        { end: 14.37, start: 14.13, text: 'REPLACED6' }, //<-- replaced
        { end: 14.61, start: 14.37, text: 'REPLACED7' }, //<-- replaced
        { end: 15.15, start: 14.61, text: 'REPLACED8' }, //<-- replaced
        { end: 15.67, start: 15.44, text: 'REPLACED9' }, //<-- replaced
        { end: 15.82, start: 15.67, text: 'REPLACED10' }, //<-- replaced
        { end: 16.19, start: 15.82, text: 'REPLACED11' }, //<-- replaced
        { end: 16.27, start: 16.19, text: 'REPLACED12' }, //<-- replaced
        { end: 16.65, start: 16.27, text: 'REPLACED13' }, //<-- replaced
        { end: 16.74, start: 16.65, text: 'REPLACED14' }, //<-- replaced
        { end: 17.2, start: 16.74, text: 'REPLACED15' }, //<-- replaced
        { end: 17.32, start: 17.23, text: 'REPLACED16' }, //<-- replaced
        { end: 17.63, start: 17.32, text: 'REPLACED17' }, //<-- replaced
        { end: 18.13, start: 17.63, text: 'REPLACED18' }, //<-- replaced
        { end: 18.61, start: 18.17, text: 'REPLACED19' }, //<-- replaced
        { end: 19.17, start: 18.72, text: 'REPLACED19' }, //<-- replaced
        { end: 19.56, start: 19.17, text: 'REPLACED20' }, //<-- replaced
      ],
    };

    const result = alignJSONText(
      automatedSttTranscription,
      baseTextAccurateTranscription,
      customStartTime
    );
    expect(result).toEqual(expectedResult.words);
  });
});
