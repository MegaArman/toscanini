"use strict";
const fs = require("fs");
const test = require("tape").test;
const ScoreIterator = require("./ScoreIterator");

//TODO: test selectInstrument

let musicXML = fs.readFileSync("../scores/guitar.xml");
// {"Classical Guitar":[[{"pitch":45}],[{"pitch":50}],[{"pitch":47},{"pitch":50}],[{"pitch":47}],"2",[{"pitch":41},{"pitch":50}],[{"pitch":41},{"pitch":47}]]}

test("next", function(t)
{
  const scoreIterator =  ScoreIterator(musicXML);

  scoreIterator.selectInstrument("Classical Guitar");
  // t.deepEqual(scoreIterator.next(), [], "next 1");


  t.end();
});
