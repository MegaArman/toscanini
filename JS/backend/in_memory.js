"use strict";
const fs = require("fs");
const ScoreSearcher = require("./ScoreSearcher");

const xml1 = fs.readFileSync("../scores_json/Beethoven-Symphony No. 4 Mov. 1.json");
const xml2 = fs.readFileSync("../scores_json/Beethoven-Symphony No. 4 Mov. 4.json");
const jsObj1 = JSON.parse(xml1);
const jsObj2 = JSON.parse(xml2);

function run()
{
  console.time("");
  for (let i = 0; i < 100; i++)
  {
    let scoreSearcher1 = ScoreSearcher(jsObj1);
    // scoreSearcher1.getMaxPitch();
    let scoreSearcher2 = ScoreSearcher(jsObj2);
    // scoreSearcher2.getMaxPitch();
  }

  console.timeEnd("");
}

run();
