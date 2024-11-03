const normalizeWord = require("../normalize-word");

function compareTwoWords(wordTextOne, wordTextTwo) {
    if(!Boolean(wordTextOne)){
       return null 
    }
    if(!Boolean(wordTextTwo)){
        return null
    }
    return normalizeWord(wordTextOne) === normalizeWord(wordTextTwo)
}

module.exports = compareTwoWords;