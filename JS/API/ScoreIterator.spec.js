// node ScoreSearcher.spec.js to run this test - simple as that!
// ...but if you want pretty output use npm run test or npm t
"use strict";
const fs = require("fs");
const test = require("tape").test;
const ScoreIterator = require("./ScoreIterator");

test("two_tempos", function(t)
{
  let musicXML = fs.readFileSync("../scores/guitar.xml");
  const scoreIterator =  ScoreIterator(musicXML);

  {
    scoreIterator.selectInstrument("Classical Guitar");
    const actual = scoreIterator.next();
    const expected = [{"pitch": 45}]; // TODO: durations!

    t.deepEqual(actual, expected, "next");
  }
  // console.log(scoreIterator);

  // console.log(scoreIterator.next());

  t.end();
});
