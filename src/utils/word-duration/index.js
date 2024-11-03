// Heuristic function to calculate word duration
function wordDuration(word) {
    return 0.08475 + (0.05379 * word.length);
}

module.exports = wordDuration;