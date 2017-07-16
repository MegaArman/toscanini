"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Iterator  = require("../lib/Iterator");

test("basic.xml", (t) =>
{

  //TODO : remove actual and expected???
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/basic.xml")).toString();
  const i =  Iterator(musicXML);

  t.deepEqual(i.selectInstrument("Flute"), true, "has Flute");
  t.deepEqual(i.hasPrev(), false, "hasPrev false");
  t.deepEqual(i.hasNext(), true, "hasNext true");
  t.deepEqual(i.next(), { beat: 1, duration: 1, note: "C4" }, "next");
  t.deepEqual(i.hasNext(), true, "hasNext true");
  
  //next
  t.deepEqual(i.next(), { beat: 2, duration: 1, note: "Bb4" }, "next");
  t.deepEqual(i.next(), { beat: 3, duration: 2, note: "G5" }, "next");
  t.deepEqual(i.next(), { beat: 1, duration: 4, rest: true }, "next");
  t.deepEqual(i.hasNext(), false, "hasNext false");
  t.throws(i.next, "next exception");

  t.deepEqual(i.hasPrev(), true, "hasPrev true");

  //prev
  t.deepEqual(i.prev(), { beat: 3, duration: 2, note: "G5" }, "prev");
  t.deepEqual(i.prev(), { beat: 2, duration: 1, note: "Bb4" }, "prev");
  t.deepEqual(i.prev(), { beat: 1, duration: 1, note: "C4" }, "prev");
  t.deepEqual(i.hasPrev(), false, "hasPrev false");

  t.throws(i.prev, "prev exception");
  t.end();
});

test("two_monophonic_parts.xml", (t) =>
{
  const musicXML = fs.readFileSync(
    path.resolve(__dirname, "../scores/two_monophonic_parts.xml")).toString();
  const i =  Iterator(musicXML);

  t.deepEqual(i.selectInstrument("flute"), false, "has flute false");

  t.deepEqual(i.selectInstrument("Flute"), true, "has Flute true");
  t.deepEqual(i.hasPrev(), false, "hasPrev false");
  t.deepEqual(i.hasNext(), true, "hasNext true");
  t.deepEqual(i.next(), { beat: 1, duration: 2, note: "G4" }, "Flute next");

  t.deepEqual(i.selectInstrument("Violin"), true, "has Violin true");
  t.deepEqual(i.next(), { beat: 1, duration: 2, note: "D5" }, "Violin next");
  t.end();
});

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
