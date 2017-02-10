"use strict";
const fs = require("fs");
const ScoreSearcher = require("./ScoreSearcher");

const jsObj1 = fs.readFileSync("../scores_json/Beethoven-Symphony No. 4 Mov. 1.json");
const jsObj2 = fs.readFileSync("../scores_json/Beethoven-Symphony No. 4 Mov. 4.json");

function run()
{
  console.time("");
  for (let i = 0; i < 5; i++)
  {
    let scoreSearcher1 = ScoreSearcher(JSON.parse(jsObj1));
    let scoreSearcher2 = ScoreSearcher(JSON.parse(jsObj2));
  }

  console.timeEnd("");
}

run();
