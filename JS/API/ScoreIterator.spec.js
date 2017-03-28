"use strict";
const fs = require("fs");
const test = require("tape").test;
const ScoreIterator = require("./ScoreIterator");

//TODO: test selectInstrument
test("guitar", function(t)
{
  let musicXML = fs.readFileSync("../scores/guitar.xml");
  const scoreIterator =  ScoreIterator(musicXML);

// {"Classical Guitar":[[{"pitch":45}],[{"pitch":50}],[{"pitch":47},{"pitch":50}],[{"pitch":47}],"2",[{"pitch":41},{"pitch":50}],[{"pitch":41},{"pitch":47}]]}

  scoreIterator.selectInstrument("Classical Guitar");

  //Measure 1:
  t.deepEqual(scoreIterator.next(), [{"pitch": 45}], "next");
  t.deepEqual(scoreIterator.next(), [{"pitch": 50}], "next");
  t.deepEqual(scoreIterator.next(), [{"pitch": 47}, {"pitch": 50}], "next");
  t.deepEqual(scoreIterator.next(), [{"pitch": 52}], "next");

  //Measure 2:
  t.deepEqual(scoreIterator.next(), [{"pitch": 41}, {"pitch": 47}], "next");
  t.deepEqual(scoreIterator.next(), [{"pitch": 41}, {"pitch": 45}], "next");
  t.deepEqual(scoreIterator.next(), 2);


  t.end();
});
