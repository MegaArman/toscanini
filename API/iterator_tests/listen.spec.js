"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Iterator  = require("../lib/Iterator");

test("key_change.xml", (t) =>
{

  //TODO : remove actual and expected???
  const musicXML =
    fs.readFileSync(path
      .resolve(__dirname, "../scores/key_change.xml")).toString();
  const i =  Iterator(musicXML);

  t.deepEqual(i.selectInstrument("Piano"), true, "has Flute");

  while (i.hasNext())
  {
    console.log(i.next());
  }

  t.end();
});


