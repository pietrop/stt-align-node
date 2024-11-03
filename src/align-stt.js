const convertTextStringToArrayList = require("./utils/convert-text-string-to-array-list");
const makeWord = require("./utils/make-word");
const compareTwoWords = require("./utils/compare-two-words");
const wordDuration = require("./utils/word-duration");

/**
 * 
 * @example <caption>Example usage</caption>
 
const baseText = "But we'll back with more from our correspondents' next Saturday morning as usual.";
const sttData = {
    words: [
        { start: 1672.9, end: 1673.14, text: "But" },
        { start: 1673.14, end: 1673.24, text: "we'll" },
        { start: 1673.24, end: 1673.52, text: "back" },
        { start: 1673.52, end: 1673.64, text: "with" },
        { start: 1673.64, end: 1673.81, text: "more" },
        { start: 1673.81, end: 1674, text: "from" },
        { start: 1674, end: 1674.07, text: "our" },
        { start: 1674.07, end: 1674.95, text: "correspondents'" },
        { start: 1674.95, end: 1675.24, text: "next" },
        { start: 1675.24, end: 1675.66, text: "Saturday" },
        { start: 1675.66, end: 1676.08, text: "morning" },
        { start: 1676.08, end: 1676.22, text: "as" },
        { start: 1676.22, end: 1676.73, text: "usual." },
        { start: 1676.97, end: 1677.16, text: "Do" }
    ]
};

const alignmentResult = alignSTT(sttData, baseText);
console.log(JSON.stringify(alignmentResult, null, 2));
 */
function alignSTT(sttTranscript, baseTranscriptText, optionalSegmentStartTime = 0) {
    //  Edge case
    if (baseTranscriptText === '') {
        return []// sttTranscript.words.map(word => makeWord(word.text, word.start, word.end));
    }
    const transcriptWordsList = convertTextStringToArrayList(baseTranscriptText);
    const sttWords = sttTranscript.words;
    //  Edge case - there are no sttWords, we compute estimated words using `wordDuration` heuristics
    if (!Boolean(sttWords)) {
        let endTime = optionalSegmentStartTime;
        return transcriptWordsList.map((word) => {
            const startTime = endTime;
            const wordEndTime = startTime + wordDuration(word);
            endTime = wordEndTime;
            return makeWord(word, startTime, endTime)
        })
    }
    const sttWordsList = convertTextStringToArrayList(sttWords.map(word => word.text.trim()).join(' '));

    const m = transcriptWordsList.length;
    const n = sttWordsList.length;


    // Step 1: Create a (m+1) x (n+1) DP matrix initialized with zeros
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    // Step 2: Initialize the DP matrix
    // Fill the first column: cost of deleting each word from the base transcript
    for (let i = 1; i <= m; i++) dp[i][0] = i; // Deletion costs
    for (let j = 1; j <= n; j++) dp[0][j] = j; // Insertion costs

    // Step 3: Fill the DP matrix using a nested loop
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = compareTwoWords(transcriptWordsList[i - 1], sttWordsList[j - 1]) ? 0 : 1; // Match or substitution
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,     // Deletion
                dp[i][j - 1] + 1,     // Insertion
                dp[i - 1][j - 1] + cost // Match or substitution
            );
        }
    }


    // Step 4: Backtrack to determine the alignment   
    let i = m, j = n;
    const alignment = [];
    // Traverse the DP matrix from the bottom-right corner to the top-left
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0) {
            if (compareTwoWords(transcriptWordsList[i - 1], sttWordsList[j - 1])) {
                // Case 1 - Match: Words are the same
                alignment.push({ baseWord: transcriptWordsList[i - 1], sttWord: sttWords[j - 1] });
                i--;
                j--;
            } else if (dp[i][j] === dp[i - 1][j - 1] + 1) {
                // Case 2 - Substitution: Words are different, but we're aligning them anyway with a penalty
                alignment.push({ baseWord: transcriptWordsList[i - 1], sttWord: sttWords[j - 1] });
                i--;
                j--;
            } else if (dp[i][j] === dp[i - 1][j] + 1) {
                // Case 3 - Deletion: A word in the base text has no corresponding word in the STT
                // we had the base text word but there's not timecode to transpose from STT
                alignment.push({ baseWord: transcriptWordsList[i - 1], sttWord: null });
                i--;
            } else if (dp[i][j] === dp[i][j - 1] + 1) {
                // Case 4 - Insertion: A word in the STT has no corresponding word in the base text
                // Skip this word in the STT transcript
                j--;
            }
        } else if (i > 0) {
            // Case 5 - Only base words left, handle as deletions
            alignment.push({ baseWord: transcriptWordsList[i - 1], sttWord: null });
            i--;
        } else if (j > 0) {
            // Case 6 - Only STT words left, handle as insertions
            j--; // Skip, since base text is the source of truth
        }
    }

    // Reverse the alignment array to get the correct order
    alignment.reverse();

    // Step 5: Create the final output with time codes
    const output = [];
    let lastEnd = optionalSegmentStartTime || 0; // Starting point for interpolation

    // Iterate over the aligned words and assign time codes
    for (const { baseWord, sttWord } of alignment) {
        if (baseWord) {
            if (sttWord) {
                // Case 1: Matched or substituted word - use STT word timing
                output.push(makeWord(baseWord, sttWord.start, sttWord.end));
                lastEnd = sttWord.end; // Update last end time
            } else {
                // Case 2: Deleted word - interpolate time codes
                const previousTime = output.length > 0 ? output[output.length - 1].end : lastEnd;
                const nextWord = sttWords.find(word => word.start >= previousTime);
                const nextTime = nextWord ? nextWord.start : null;

                const start = previousTime;
                const end = nextTime ? nextTime : (start + wordDuration(baseWord)); // Use next word's start time or estimate duration

                output.push(makeWord(baseWord, start, end));
                lastEnd = end; // Update last end time
            }
        }

    }

    return output;
}

module.exports = alignSTT;