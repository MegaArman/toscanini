"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("vivaldi_winter tests", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/vivaldi_winter.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = toscanini.getInstrumentNames();
    const expected =[ "Solo Violin", "Violin I",
                      "Violin II", "Viola", "Violoncello",
                      "Contrabass", "Harpsichord" ];
    t.deepEqual(actual, expected, "getInstrumentNames");
  }

  {
    const actual = toscanini.getPitchRange("Viola")["maxPitch"];
    const expected = 62; //D5
    t.deepEqual(actual, expected, "getPitchRange Viola max");
  }

  {
    const actual = toscanini.getPitchRange("Solo Violin")["maxPitch"];
    const expected = 79; //G6
    t.deepEqual(actual, expected, "getPitchRange Solo Violin max");
  }

  {
    const actual = ["Ab", "Eb"];
    const expected = toscanini.getKeySignatures("Violin I");
    t.deepEqual(actual, expected, "getKeySignatures Violin I");
  }

  {
    const actual = ["Ab", "Eb"];
    const expected = toscanini.getKeySignatures();
    t.deepEqual(actual, expected, "getKeySignatures score");
  }

  {
    const actual = [ { beatType: 4, beats: 4 }, { beatType: 8, beats: 3 } ];
    const expected = toscanini.getTimeSignatures("Violin I");
    t.deepEqual(actual, expected, "getTimeSignatures Violin I");
  }

  {
    const actual = [ { beatType: 4, beats: 4 }, { beatType: 8, beats: 3 } ];
    const expected = toscanini.getTimeSignatures();
    t.deepEqual(actual, expected, "getTimeSignatures score");
  }

  //{
  //  const actual = [68, 60, 33, 78, 45, 40];
  //  const expected = toscanini.getTempos("Viola");
  //  t.deepEqual(actual, expected, "getTempos Viola");
  //}

  {
    const actual = [68, 60, 33, 78, 45, 40];
    const expected = toscanini.getTempos();
    t.deepEqual(actual, expected, "getTempos score");
  }

  t.end();
});
