"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../Toscanini");

test("ava_maria_pg1 tests", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/ava_maria_pg1.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const range = toscanini.getPitchRange();
    const actualMin = range["minPitch"];
    const actualMax = range["maxPitch"];
    const expectedMin = 15; //Eb
    const expectedMax = 68;
    t.deepEqual(actualMin, expectedMin, "getPitchRange min");
    t.deepEqual(actualMax, expectedMax, "getPitchRange max");
  }

  {
    const actual = toscanini.getInstrumentNames();
    const expected = [ "Voice", "Piano" ];
    t.deepEqual(actual, expected, "getInstrumentNames");
  }

  {
    const actual = toscanini.getPitchRange("Voice")["minPitch"];
    const expected = 53; //F
    t.deepEqual(actual, expected, "getPitchRange Voice min");
  }

  {
    const actual = toscanini.getPitchRange("Voice")["maxPitch"];
    const expected = 65; //F
    t.deepEqual(actual, expected, "getPitchRange Voice max");
  }

  {
    const actual = toscanini.getKeySignatures();
    const expected = ["Bb"];
    t.deepEqual(actual, expected, "getKeySignatures");
  }

  {
    const actual = toscanini.getTimeSignatures();
    const expected = [[4, 4]];
    t.deepEqual(actual, expected, "getTimeSignatures");
  }
  t.end();
});
