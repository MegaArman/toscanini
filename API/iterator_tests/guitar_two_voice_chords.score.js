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
  t.deepEqual(i.next(), {beat: 1, duration: 16,
                         note: ["C4"]}, "next is voice 1");
  t.deepEqual(i.next(), 
              { beat: 3, duration: 8, note: ["F3"]}, "next is voice2");

  t.deepEqual(i.next(), { beat: 1, duration: 8, note: [ "G4", "E3" ] },
              "next is both voices");

  t.deepEqual(i.next(),
              { beat: 3, duration: 8, note: ["D4"]} , "next");

  t.end();
});
