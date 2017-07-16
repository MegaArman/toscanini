"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Iterator  = require("../lib/Iterator");

test(("guitar_one_voice_chords"), (t) =>
{
  const musicXML = fs.readFileSync(
    path.resolve(__dirname, 
     "../scores/guitar_one_voice_chords.xml")).toString();
  const i =  Iterator(musicXML);
  
  i.selectInstrument("Classical Guitar");
  i.next();
  i.next();
  t.deepEqual(i.next(), 
    { beat: 3, duration: 1, note: ["B3", "D4"] }, "next is a chord");
  i.next();
  i.next();
  t.deepEqual(i.next(),
    { beat: 2, duration: 1, note: ["F#3", "A3", "B3"] } , "next is a chord");

  t.end();
});

