//Proof of concept that JSON can be used to save queries on behalf of the user
"use strict";
const fs = require("fs");
const test = require("tape").test;
const ScoreSearcher = require("./ScoreSearcher");

test("vivaldi_winter tests", function(t)
{
  let musicXML = fs.readFileSync("../scores/vivaldi_winter.xml");
  let queries = JSON.parse(fs.readFileSync("./queries.json"));
  const scoreSearcher =  ScoreSearcher(musicXML);

  for (let query of queries)
  {
    const actual = scoreSearcher[query["function"]](...query["args"]);
    const expected = query["return"];

    t.deepEqual(actual, expected, query["function"]);
  }

  t.end();
});
