// Load the http module to create an http server.
const fs = require("fs");
const ScoreSearcher = require("./ScoreSearcher.js");

const musicXML = fs.readFileSync("../scores/vivaldi_winter.xml");
const scoreSearcher = ScoreSearcher(musicXML);
const minPitch = scoreSearcher.getMinPitch().toString();
const maxPitch = scoreSearcher.getMaxPitch().toString();
const instrumentNames = scoreSearcher.getInstrumentNames().toString();

result["minPitch"] = minPitch;
result["maxPitch"] = maxPitch;
result["instrumentNames"] = instrumentNames;

