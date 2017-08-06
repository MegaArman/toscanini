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

  //These tests exercise backup and forward tags?

  i.selectInstrument("Classical Guitar");
  t.deepEqual(i.next(), {notes: [{duration: 4, noteType: "whole", pitch: "C4"}],
                         beat: 1}, "next is voice 1");
  t.deepEqual(i.next(), {notes: [{ duration: 2, noteType: "half", pitch: "F3"}],
                         beat: 3}, "next is voice2");

  t.deepEqual(i.next(), {notes: [{duration: 2, noteType: "half", pitch: "G4"}, 
                                 {duration: 4, noteType: "whole", pitch: "E3"}],
                         beat: 1 }, "next is both voices");

  t.deepEqual(i.next(),
              {notes: [{ duration: 2, noteType: "half", pitch: "D4"}], 
               beat: 3}, "next");

  t.end();
});
