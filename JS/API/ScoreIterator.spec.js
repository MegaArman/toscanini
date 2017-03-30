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

  t.deepEqual(scoreIterator.getPosition(), -1, "getPosition");

  //Measure 1:
  t.deepEqual(scoreIterator.next(), [{"pitch": 45, "duration": 1}], "next");
  t.deepEqual(scoreIterator.next(), [{"pitch": 50, "duration": 1}], "next");
  t.deepEqual(scoreIterator.hasNext(), true, "hasNext");
  t.deepEqual(scoreIterator.next(), [{"pitch": 47, "duration": 1},
                                     {"pitch": 50, "duration": 1}], "next");
  t.deepEqual(scoreIterator.next(), [{"pitch": 52, "duration": 1}], "next");

  //Measure 2:
  t.deepEqual(scoreIterator.next(), [{"pitch": 41, "duration": 2},
                                     {"pitch": 47, "duration": 1}], "m2 next");
  t.deepEqual(scoreIterator.next(), [{"pitch": 41, "duration": 1},
                                     {"pitch": 45, "duration": 1}], "m2 next");
  t.deepEqual(scoreIterator.next(), 2);

  //end position
  t.deepEqual(scoreIterator.getPosition(), 6, "getPosition at end");

  //post end
  t.deepEqual(scoreIterator.hasNext(), false, "hasNext");

  //Measure 2:
  // t.deepEqual(scoreIterator.prev(), 2);
  t.deepEqual(scoreIterator.prev(), [{"pitch": 41, "duration": 1},
                                     {"pitch": 45, "duration": 1}], "m2 prev");

  t.deepEqual(scoreIterator.prev(), [{"pitch": 41, "duration": 1},
                                     {"pitch": 47, "duration": 1}], "m2 prev");
  t.deepEqual(scoreIterator.hasPrev(), true, "hasPrev");


  //Measure 1:
  t.deepEqual(scoreIterator.prev(), [{"pitch": 52, "duration": 1}], "m2 prev");
  t.deepEqual(scoreIterator.prev(), [{"pitch": 47, "duration": 1},
                                     {"pitch": 50, "duration": 1}], "m2 prev");
  t.deepEqual(scoreIterator.prev(), [{"pitch": 50, "duration": 1}], "m2 prev");
  t.deepEqual(scoreIterator.prev(), [{"pitch": 45, "duration": 1}], "m2 prev");

  //pre start
  t.deepEqual(scoreIterator.hasPrev(), false, "hasPrev");
  t.deepEqual(scoreIterator.getPosition(), 0, "getPosition back to start");

  //setPosition
  scoreIterator.setPosition(3);
  t.deepEqual(scoreIterator.getPosition(), 3, "setPosition");


  t.end();
});
