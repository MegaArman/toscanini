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

test("two_parts.xml", (t) =>
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

test("with other things", (t) =>
{
  const musicXML = fs.readFileSync(
    path.resolve(__dirname, "../scores/ava_maria_pg1.xml")).toString();
  const i =  Iterator(musicXML);

  i.selectInstrument("Voice");
  console.log(i.next());
  console.log(i.next());
  t.end();
});
