_mostly chatGPT generated - see `src/align-stt.js` for source code_

# High-Level Mental Model Overview
The code is designed to align words from an automatic speech recognition (ASR) transcript (STT - Speech-to-Text) with a base reference text. This is often used to synchronize subtitles or captions with spoken words in audio or video. The goal is to match each word in the reference text to a corresponding word in the STT output while preserving timing information, using a dynamic programming approach to minimize the overall cost of word mismatches.

**Main Conceptual Steps:**
1. **Convert Text to Word Lists**: Both the base reference text and the STT words are converted into lists of words for easy comparison.
2. **Create a Dynamic Programming (DP) Matrix**: The DP matrix helps to efficiently determine the optimal alignment of words between the two lists.
3. **Fill the DP Matrix**: The algorithm populates the matrix using a cost function that accounts for word matches, insertions, and deletions.
4. **Backtrack to Align Words**: Using the filled DP matrix, the algorithm traces back from the end to the beginning to reconstruct the best word alignment.
5. **Generate Output with Timing**: The aligned words are then processed to create output with time codes, ensuring proper synchronization.

---

### Pseudocode Algorithm
Here's a simplified pseudocode representation of the algorithm:

```plaintext
function alignSTT(sttTranscript, baseTranscriptText, optionalSegmentStartTime):
    if baseTranscriptText is empty:
        return empty list

    // Convert base text and STT words to word lists
    transcriptWordsList = convert baseTranscriptText to word list
    sttWords = extract words from sttTranscript
    if sttWords is not available:
        // Handle case where there are no STT words
        return list of words with estimated timings

    // Convert STT words to a word list
    sttWordsList = convert sttWords to word list

    // Get lengths of both word lists
    m = length of transcriptWordsList
    n = length of sttWordsList

    // Step 1: Create and initialize a DP matrix
    dp = 2D array of size (m+1) x (n+1), filled with zeros
    for i from 1 to m:
        dp[i][0] = i  // Cost of deleting words from base text
    for j from 1 to n:
        dp[0][j] = j  // Cost of inserting words from STT

    // Step 2: Fill the DP matrix
    for i from 1 to m:
        for j from 1 to n:
            cost = 0 if words match, else 1
            dp[i][j] = minimum of:
                - dp[i-1][j] + 1 (deletion cost)
                - dp[i][j-1] + 1 (insertion cost)
                - dp[i-1][j-1] + cost (match or substitution)

    // Step 3: Backtrack to find the optimal alignment
    alignment = empty list
    i = m, j = n
    while i > 0 or j > 0:
        if both i and j > 0:
            if words match:
                add matched words to alignment
                i--, j--
            else if substitution cost:
                add substituted words to alignment
                i--, j--
            else if deletion cost:
                add base word with no STT word to alignment
                i--
            else if insertion cost:
                skip STT word
                j--
        else if i > 0:
            // Remaining base words
            add base word with no STT word to alignment
            i--
        else if j > 0:
            // Remaining STT words
            skip STT word
            j--

    reverse the alignment list

    // Step 4: Generate output with time codes
    output = empty list
    lastEnd = optionalSegmentStartTime
    for each pair in alignment:
        if base word exists:
            if STT word exists:
                use STT word's timing
                update lastEnd
            else:
                // Estimate timing for deleted word
                interpolate timing using previous and next word
                update lastEnd
        add word with timing to output

    return output
```

---

### Summary of What the Code Does
1. **Preprocess Input**: Convert the base and STT text into word lists, handling any edge cases (like missing STT words).
2. **Build a Cost Matrix**: Use dynamic programming to create a matrix that helps to identify the best way to align the words, minimizing the cost of insertions, deletions, and substitutions.
3. **Backtrack to Align Words**: Use the DP matrix to trace back and determine the optimal word alignments.
4. **Assign Time Codes**: Generate the final output, ensuring each word in the base text has an appropriate time code, whether from the STT data or an estimated value.

This approach ensures that the base text is aligned with the STT transcript efficiently, preserving the timing information critical for synchronization in multimedia content.


---
## Explanation of How the Dynamic Programming (DP) Matrix Works

The **dynamic programming matrix** is a key part of this algorithm, used to solve the problem of aligning two sequences of words (from the base transcript and the STT transcript) in an optimal way. The matrix helps to find the least costly way to transform one word sequence into the other through a combination of **insertions**, **deletions**, and **substitutions**. Here's a detailed explanation of how it works:



### Structure of the DP Matrix
- The matrix, `dp`, is a 2D array with dimensions `(m + 1) x (n + 1)`, where:
  - `m` is the number of words in the `transcriptWordsList` (the base reference text).
  - `n` is the number of words in the `sttWordsList` (the STT-generated text).
- Each cell `dp[i][j]` in the matrix represents the **minimum cost** to align the first `i` words of `transcriptWordsList` with the first `j` words of `sttWordsList`.

---

### Initialization of the DP Matrix
1. **First Row (Base Text Empty)**:
   - `dp[0][j] = j` for all `j`. 
   - This means if the base text has no words (an empty sequence), it would cost `j` insertions to transform the base text into the STT text of length `j`. 
   - Example: If you need to add 5 words to an empty base text, the cost is 5.

2. **First Column (STT Text Empty)**:
   - `dp[i][0] = i` for all `i`.
   - This means if the STT text has no words, it would cost `i` deletions to transform the base text of length `i` into an empty sequence.
   - Example: If you have to delete 3 words from the base text to match an empty STT sequence, the cost is 3.

---

### Filling the DP Matrix
- The algorithm iterates over each cell `dp[i][j]` and calculates the cost using a comparison between the `i-th` word from `transcriptWordsList` and the `j-th` word from `sttWordsList`.

**Key Components in Each Cell Calculation**:
1. **Cost of a Match or Substitution**:
   - If the words match (using the `compareTwoWords` function), the cost is 0.
   - If the words do not match, the cost is 1 (penalty for substitution).

2. **Recurrence Relation**:
   - `dp[i][j] = min(`
     - `dp[i-1][j] + 1` → **Deletion**: Removing the `i-th` word from `transcriptWordsList`. The cost is the cost of aligning the first `i-1` words of `transcriptWordsList` with `j` words of `sttWordsList` plus 1.
     - `dp[i][j-1] + 1` → **Insertion**: Inserting the `j-th` word from `sttWordsList`. The cost is the cost of aligning the first `i` words of `transcriptWordsList` with `j-1` words of `sttWordsList` plus 1.
     - `dp[i-1][j-1] + cost` → **Match or Substitution**: Aligning the `i-th` word from `transcriptWordsList` with the `j-th` word from `sttWordsList`. The cost is `dp[i-1][j-1]` plus the match/substitution cost.

---

### Example Calculation
Let's consider a simple example with these sequences:

**Base Text (TranscriptWordsList)**: ["we'll", "back", "more"]  
**STT Text (STTWordsList)**: ["well", "back", "moore"]

#### Step 1: Initialize the Matrix
```
    | ""   well  back  moore
  --------------------------
 "" | 0     1     2     3
we'll| 1
back | 2
more | 3
```

#### Step 2: Fill the Matrix
- **dp[1][1]**: Compare "we'll" with "well". They are not identical, so the cost is 1.
  - `dp[1][1] = min(dp[0][1] + 1, dp[1][0] + 1, dp[0][0] + 1) = min(2, 2, 1) = 1`
- **dp[1][2]**: Compare "we'll" with "back". They are different, so the cost is 1.
  - `dp[1][2] = min(dp[0][2] + 1, dp[1][1] + 1, dp[0][1] + 1) = min(3, 2, 2) = 2`
- **dp[1][3]**: Compare "we'll" with "moore". They are different, so the cost is 1.
  - `dp[1][3] = min(dp[0][3] + 1, dp[1][2] + 1, dp[0][2] + 1) = min(4, 3, 3) = 3`

(Continue filling for `dp[2][j]` and `dp[3][j]`...)

---

### Backtracking to Find the Optimal Alignment
Once the matrix is filled, the algorithm backtracks from `dp[m][n]` (bottom-right corner) to `dp[0][0]` (top-left corner) to find the sequence of operations (match, substitution, insertion, deletion) that led to the minimum cost.

- **If a match/substitution**: Both `i` and `j` are decremented.
- **If a deletion**: Only `i` is decremented.
- **If an insertion**: Only `j` is decremented.

---

### Purpose of the DP Matrix
The DP matrix systematically explores all possible ways to align the two word sequences and uses the concept of **optimal substructure** to ensure the alignment has the lowest possible cost. By doing so, it guarantees that the base text and STT transcript are aligned in a way that makes sense, even if there are slight differences in wording or word order.