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
  t.deepEqual(i.next(), 
              { beat: 1, duration: 1, 
                noteType: "quarter", pitch: ["C4"] }, "next");
  t.deepEqual(i.hasNext(), true, "hasNext true");
  
  //next
  t.deepEqual(i.next(), 
              { beat: 2, duration: 1,
                noteType: "quarter", pitch: ["Bb4"] }, "next");
  t.deepEqual(i.next(), { beat: 3, duration: 2,
                          noteType: "half", pitch: ["G5"] }, "next");
  t.deepEqual(i.next(), { beat: 1, duration: 4, noteType: "undefined", 
                          rest: true }, "next");
  t.deepEqual(i.hasNext(), false, "hasNext false");
  t.throws(i.next, "next exception");

  t.deepEqual(i.hasPrev(), true, "hasPrev true");

  //prev
  t.deepEqual(i.prev(), { beat: 3, duration: 2, noteType: "half",
                          pitch: ["G5"] }, "prev");
  t.deepEqual(i.prev(), { beat: 2, duration: 1, noteType: "quarter",
                          pitch: ["Bb4"] }, "prev");
  t.deepEqual(i.prev(), { beat: 1, duration: 1, noteType: "quarter",
                          pitch: ["C4"] }, "prev");
  t.deepEqual(i.hasPrev(), false, "hasPrev false");

  t.throws(i.prev, "prev exception");
  t.end();
});
