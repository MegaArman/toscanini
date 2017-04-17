// Load the http module to create an http server.
const fs = require("fs");

const musicXML = fs.readFileSync("../scores/vivaldi_winter.xml");
const ScoreSearcher = require("./ScoreSearcher.js");
const scoreSearcher = ScoreSearcher(musicXML);

//GOAL: {"Beethoven": {"flute": {"min": 45, "max": 60"}}}



