"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Iterator  = require("../lib/Iterator");

test("rhythmic_complexity.xml", (t) =>
{

  //TODO : remove actual and expected???
  const musicXML =
    fs.readFileSync(path
      .resolve(__dirname, "../scores/rhythmic_complexity.xml")).toString();
  const i =  Iterator(musicXML);

  t.deepEqual(i.selectInstrument("Violin"), true, "has violin");
  t.deepEqual(i.next(), {}, "dotted half");
  t.end();
});


