const factoryScoreSearcher = require("../API/ScoreSearcher.proto");

// similar to a "constructor"
function ScoreSearcher(musicObj)
{
  return factoryScoreSearcher(musicObj);
}

module.exports = ScoreSearcher;
