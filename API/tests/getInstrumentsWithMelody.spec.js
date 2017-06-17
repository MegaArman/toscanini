"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../Toscanini");

test("two_parts", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/two_parts.xml"));
  const toscanini = Toscanini(musicXML);

  {
    const actual = toscanini.getInstrumentsWithMelody("BGBC");
    const expected = ["Violin"];
    t.deepEqual(actual, expected, "getInstrumentsWithMelody");
  }

  {
    const actual = toscanini.getInstrumentsWithMelody("GD");
    const expected = ["Flute"];
    t.deepEqual(actual, expected, "getInstrumentsWithMelody");
  }

  t.end();
});
