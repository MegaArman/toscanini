// node ToscaniniAnalyzer.spec.js to run this test - simple as that!
// ...but if you want pretty output use npm run test or npm t
"use strict";
const fs = require("fs");
const test = require("tape").test;
const ToscaniniAnalyzer = require("./ToscaniniAnalyzer");

test("avamariapg1 tests", function(t)
{
  let musicXML = fs.readFileSync("./scores/avamariapg1.xml");
  const toscaniniAnalyzer =  ToscaniniAnalyzer(musicXML);

  {
    const range = toscaniniAnalyzer.getPitchRange();
    const actualMin = range["minPitch"];
    const actualMax = range["maxPitch"];
    const expectedMin = 15; //Eb
    const expectedMax = 68;
    t.deepEqual(actualMin, expectedMin, "getPitchRange min");	
    t.deepEqual(actualMax, expectedMax, "getPitchRange max");
  }

  {
    const actual = toscaniniAnalyzer.getInstrumentNames();
    const expected = [ "Voice", "Piano" ];
    t.deepEqual(actual, expected, "getInstrumentNames");
  }

  {
    const actual = toscaniniAnalyzer.getPitchRange("Voice")["minPitch"];
    const expected = 53; //F
    t.deepEqual(actual, expected, "getPitchRange Voice min");
  }

  {
    const actual = toscaniniAnalyzer.getPitchRange("Voice")["maxPitch"];
    const expected = 65; //F
    t.deepEqual(actual, expected, "getPitchRange Voice max");
  }

  {
    const actual = ["Bb"];
    const expected = toscaniniAnalyzer.getKeySignatures();
    t.deepEqual(actual, expected, "getKeySignatures");
  }

  t.end();
});

test("vivaldi_winter tests", function(t)
{
  let musicXML = fs.readFileSync("./scores/vivaldi_winter.xml");
  const toscaniniAnalyzer =  ToscaniniAnalyzer(musicXML);

  {
    const actual = toscaniniAnalyzer.getInstrumentNames();
    const expected =[ "Solo Violin", "Violin I",
                      "Violin II", "Viola", "Violoncello",
                      "Contrabass", "Harpsichord" ];
    t.deepEqual(actual, expected, "getInstrumentNames");
  }

  {
    const actual = toscaniniAnalyzer.getPitchRange("Viola")["maxPitch"];
    const expected = 62; //D5
    t.deepEqual(actual, expected, "getPitchRange Viola max");
  }

  {
    const actual = toscaniniAnalyzer.getPitchRange("Solo Violin")["maxPitch"];
    const expected = 79; //G6
    t.deepEqual(actual, expected, "getPitchRange Solo Violin max");
  }

  t.end();
});

test("two_parts", function(t)
{
  let musicXML = fs.readFileSync("./scores/two_parts.xml");
  const toscaniniAnalyzer = ToscaniniAnalyzer(musicXML);

  {
    const actual = toscaniniAnalyzer.getInstrumentsWithMelody("BGBC");
    const expected = ["Violin"];
    t.deepEqual(actual, expected, "getInstrumentsWithMelody");
  }

  {
    const actual = toscaniniAnalyzer.getInstrumentsWithMelody("GD");
    const expected = ["Flute"];
    t.deepEqual(actual, expected, "getInstrumentsWithMelody");
  }

  t.end();
});

test("two_tempos", function(t)
{
  let musicXML = fs.readFileSync("./scores/two_tempos.xml");
  const toscaniniAnalyzer =  ToscaniniAnalyzer(musicXML);

  {
    const actual = toscaniniAnalyzer.getTempos();
    const expected = [105, 90];
    t.deepEqual(actual, expected, "getTempos");
  }

  { //confirms for single instrument we can use the same queries
    const actual = toscaniniAnalyzer.getPitchRange("Flute")["minPitch"];
    const expected = toscaniniAnalyzer.getPitchRange()["minPitch"];
    t.deepEqual(actual, expected, "getTempos");
  }

  t.end();
});

test("AccidentalsEverywhere", function(t)
{
  let musicXML = fs.readFileSync("./scores/AccidentalsEverywhere.xml");
  const toscaniniAnalyzer = ToscaniniAnalyzer(musicXML);

  {
    const actual = toscaniniAnalyzer.getAccidentals();
    const expected = 8;
    t.deepEqual(actual, expected, "getAccidentals");
  }

  t.end();
});
