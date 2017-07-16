"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Iterator  = require("../lib/Iterator");

test(("guitar_two_voice_chords"), (t) =>
{
  const musicXML = fs.readFileSync(
    path.resolve(__dirname, 
     "../scores/guitar_two_voice_chords.xml")).toString();
  const i =  Iterator(musicXML);
  
  i.selectInstrument("Classical Guitar");
  i.next();
  t.deepEqual(i.next(), 
    { beat: 9, duration: 8, note: "F3" }, "next is voice2");
  i.next();
  t.deepEqual(i.next(),
    { beat: 5, duration: 1, note: ["B3", "E4"] } , "next is a chord");

  t.end();
});
