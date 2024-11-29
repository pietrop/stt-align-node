function makeWord(wordText, startTime, endTime){
    return {
        text: wordText,
        start: startTime,
        end: endTime
    }
}

module.exports = makeWord;