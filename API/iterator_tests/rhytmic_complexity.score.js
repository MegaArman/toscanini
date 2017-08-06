"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Iterator  = require("../lib/Iterator");

test("rhythmic_complexity.xml", (t) =>
{
  const musicXML =
    fs.readFileSync(path
      .resolve(__dirname, "../scores/rhythmic_complexity.xml")).toString();
  const i =  Iterator(musicXML);

  t.deepEqual(i.selectInstrument("Violin"), true, "has violin");
  t.deepEqual(i.next(), 
    {notes: [{duration: 3, noteType: "dot half", pitch: "G4"}], beat: 1}, 
    "dotted half");
  t.end();
});


