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
      {notes: [{duration: 1, noteType: "quarter", pitch: "B3"},
               {duration: 1, noteType: "quarter", pitch: "D4"}],
       beat: 3}, "next is a chord");
  
  i.next();
  i.next();

  t.deepEqual(i.getMeasureNum(), 2, "getMeasureNum 2");
  t.deepEqual(i.next(),
    {notes: [{duration: 1, noteType: "quarter",  pitch: "F#3"}, 
             {duration: 1, noteType: "quarter", pitch: "A3"}, 
             {duration: 1, noteType: "quarter", pitch: "B3"}],
     beat: 2 } , "next is a chord");

  t.deepEqual(i.getNumberOfMeasures(), 2, "getNumberOfMeasures");
  t.end();
});

