"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Iterator  = require("../lib/Iterator");

test("two_monophonic_parts.xml", (t) =>
{

  //TODO : remove actual and expected???
  const musicXML =
    fs.readFileSync(path
      .resolve(__dirname, "../scores/two_monophonic_parts.xml")).toString();
  const i =  Iterator(musicXML);

  t.deepEqual(i.selectInstrument("Flute"), true, "has Flute");

  t.deepEqual(i.getInstrumentNames(), ["Violin", "Flute"], "getInstrumentNames");
  t.end();
});


