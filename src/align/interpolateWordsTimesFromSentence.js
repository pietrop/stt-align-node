/**
 * from https://gist.github.com/pietrop/fdac1672d757ae09de5ef5abac7f8bf5
 */
/*
* originally from https://github.com/pietrop/srtParserComposer/blob/master/srtJsonToWordLinesJson.js()
* refactored 
* Module to convert srtJson to nested array of line word objects.
Line to word timecode accuracty.
Original code modified from Popcorn srt parser.
https://github.com/mozilla/popcorn-js/blob/master/parsers/parserSRT/popcorn.parserSRT.js
input example
```js
 {
    "startTime": 4.89,
    "endTime": 3.30,
    "text": "There’s this door on the 10th floor I just\nhate so much.\n"
  }
  ```
output looks something like this 
```
[
  [
    {
      "start": 4.89,
      "end": 1.88,
      "text": "There’s"
    },
    {
      "start": 4.46,
      "end": 2.74,
      "text": "this"
    },
    {
      "start": 4.029999999999999,
      "end": 2.3099999999999996,
      "text": "door"
    },
    ....
  ]
  ...
]
```
*/

/**
 * takes in a srtJson and converts it into an array of lines containing word objects with
 * word level timing.
 */
// function convertTowordsLines(srtJson){
//     // console.log(srtJson)
//   var resultLines = [];
//     for(var i=0; i<srtJson.length ; i++){
//       var line = [];
//       var srtJsonLine = srtJson[i];

//       // console.log("-----")
//       // console.log(srtJsonLine)
//       var arOfWords= convertOneSrtLine(srtJsonLine)//cb
//       // line = ;
//       resultLines.push(arOfWords);
//     }
//     return resultLines;
//   }

/*
 * Converts one srtJson line into array of words with accourate time attributes.
 */

/**
 *
 * @param {string} lineText - text of the line sentence
 * @param {float} lineStartTime - start time for the sentence
 * @param {float} lineEndTime - end time for the sentence
 */
function interpolateWordsTimesFromSentence(lineText, lineStartTime, lineEndTime) {
  //cb
  var resultWords = [];

  var words = lineText.split(' ');
  var wordCount = words.length;
  var numberOfLettersInALine = 0;
  //to calculate numberOfLettersInALine iterate over array of words and add up lenght of each.
  for (var j = 0; j < words.length; j++) {
    var oneWord = words[j];
    var numberOfLettersInOneWord = oneWord.length;
    numberOfLettersInALine += numberOfLettersInOneWord;
  }

  //line duration in seconds
  var lineDuration = lineEndTime - lineStartTime;
  // Define Word level granularity
  var averageWordDuration = lineDuration / wordCount;
  //word counter resets for every new line
  var wordCounter = 0;
  for (var k = 0; k < words.length; k++) {
    var word = words[k];
    var wordDuration = word.length * averageWordDuration;
    var wordStartTime = lineStartTime + wordCounter * averageWordDuration;
    var wordEndTime = wordStartTime + wordDuration;
    var correspondingWord = words[wordCounter];
    var wordO = createWord(wordStartTime, wordEndTime, correspondingWord);
    // console.log(wordO)
    resultWords.push(wordO);
    wordCounter += 1;
  }
  return resultWords;
  // console.log(result)
}

/**
 * Helper function
 */
function createWord(start, end, text) {
  word = {};
  word.start = start;
  word.end = end;
  word.text = text;
  return word;
}

module.exports = interpolateWordsTimesFromSentence;
