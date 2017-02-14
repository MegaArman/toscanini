"use strict";
const xml2js = require("xml2js");
const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
const factoryScoreSearcher = require("./ScoreSearcher.proto.js");

// similar to a "constructor"
module.exports = (MusicXML) =>
{
  let scoreSearcher;

  parser.parseString(MusicXML, function (err, jsObj)
  {
    if (err) throw err;
    scoreSearcher = factoryScoreSearcher(jsObj);
  });

  return scoreSearcher;
};
