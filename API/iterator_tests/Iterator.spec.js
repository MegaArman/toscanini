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
  const iterator =  Iterator(musicXML);
  iterator.selectInstrument("Flute");

  {
    const actual = iterator.hasPrev();
    const expected = false;
    t.deepEqual(actual, expected, "hasPrev false");
  }

  {
    const actual = iterator.hasNext();
    const expected = true;
    t.deepEqual(actual, expected, "hasNext true");
  }

  {
    const actual = { beat: 1, duration: 1, note: "C4" };
    const expected = iterator.next();
    t.deepEqual(actual, expected, "next");
  }
  
  {
    const actual = iterator.hasNext();
    const expected = true;
    t.deepEqual(actual, expected, "hasNext true");
  }

  {
    const actual = { beat: 2, duration: 1, note: "Bb4" };
    const expected = iterator.next();
    t.deepEqual(actual, expected, "next");
  }
 
  {
    const actual = { beat: 3, duration: 2, note: "G5" };
    const expected = iterator.next();
    t.deepEqual(actual, expected, "next");
  }

  {
    const actual = { beat: 1, duration: 4, rest: true };
    const expected = iterator.next();
    t.deepEqual(actual, expected, "next");
  } 

  {
    const actual = iterator.hasNext();
    const expected = false;
    t.deepEqual(actual, expected, "hasNext false");
  }

  {
    t.throws(iterator.next, "next exception");
  }


  {
    const actual = iterator.hasPrev();
    const expected = true;
    t.deepEqual(actual, expected, "hasPrev true");
  }

  //prev
  {
    const actual = { beat: 3, duration: 2, note: "G5" };
    const expected = iterator.prev();
    t.deepEqual(actual, expected, "prev");
  }
  
  {
    const actual = { beat: 2, duration: 1, note: "Bb4" };
    const expected = iterator.prev();
    t.deepEqual(actual, expected, "prev");
  }
 
  {
    const actual = { beat: 1, duration: 1, note: "C4" };
    const expected = iterator.prev();
    t.deepEqual(actual, expected, "prev");
  }

  {
    const actual = iterator.hasPrev();
    const expected = false;
    t.deepEqual(actual, expected, "hasPrev false");
  }

  {
    t.throws(iterator.prev, "prev exception");
  }
  t.end();
});

test("two_parts.xml", (t) =>
{
  const musicXML = fs.readFileSync(
    path.resolve(__dirname, "../scores/two_monophonic_parts.xml")).toString();
  const iterator =  Iterator(musicXML);

  t.deepEqual(iterator.selectInstrument("flute"), false, "has flute false");
  t.deepEqual(iterator.selectInstrument("Flute"), true, "has Flute true");
  t.deepEqual(iterator.hasPrev(), false, "hasPrev false");
  t.deepEqual(iterator.hasNext(), true, "hasNext true");
  t.deepEqual(iterator.next(), 
              { beat: 1, duration: 2, note: "G4" }, "Flute next");

  t.deepEqual(iterator.selectInstrument("Violin"), true, "has Violin true");
  t.deepEqual(iterator.next(), 
              { beat: 1, duration: 2, note: "D5" }, "Violin next");
  t.end();
});
