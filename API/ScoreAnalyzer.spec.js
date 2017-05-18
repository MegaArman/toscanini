// node ScoreAnalyzer.spec.js to run this test - simple as that!
// ...but if you want pretty output use npm run test or npm t
"use strict";
const fs = require("fs");
const test = require("tape").test;
const ScoreAnalyzer = require("./ScoreAnalyzer");

test("avamariapg1 tests", function(t)
{
  let musicXML = fs.readFileSync("./scores/avamariapg1.xml");
  const scoreAnalyzer =  ScoreAnalyzer(musicXML);

  {
    const range = scoreAnalyzer.getPitchRange();
    const actualMin = range["minPitch"];
    const actualMax = range["maxPitch"];
    const expectedMin = 15; //Eb
    const expectedMax = 68;
    t.deepEqual(actualMin, expectedMin, "getPitchRange min");	
    t.deepEqual(actualMax, expectedMax, "getPitchRange max");
  }

  {
    const actual = scoreAnalyzer.getInstrumentNames();
    const expected = [ "Voice", "Piano" ];
    t.deepEqual(actual, expected, "getInstrumentNames");
  }

  {
    const actual = scoreAnalyzer.getPitchRange("Voice")["minPitch"];
    const expected = 53; //F
    t.deepEqual(actual, expected, "getPitchRange Voice min");
  }

  {
    const actual = scoreAnalyzer.getPitchRange("Voice")["maxPitch"];
    const expected = 65; //F
    t.deepEqual(actual, expected, "getPitchRange Voice max");
  }

  {
    const actual = ["Bb"];
    const expected = scoreAnalyzer.getKeySignatures();
    t.deepEqual(actual, expected, "getKeySignatures");
  }

  t.end();
});

test("vivaldi_winter tests", function(t)
{
  let musicXML = fs.readFileSync("./scores/vivaldi_winter.xml");
  const scoreAnalyzer =  ScoreAnalyzer(musicXML);

  {
    const actual = scoreAnalyzer.getInstrumentNames();
    const expected =[ "Solo Violin", "Violin I",
                      "Violin II", "Viola", "Violoncello",
                      "Contrabass", "Harpsichord" ];
    t.deepEqual(actual, expected, "getInstrumentNames");
  }

  {
    const actual = scoreAnalyzer.getPitchRange("Viola")["maxPitch"];
    const expected = 62; //D5
    t.deepEqual(actual, expected, "getPitchRange Viola max");
  }

  {
    const actual = scoreAnalyzer.getPitchRange("Solo Violin")["maxPitch"];
    const expected = 79; //G6
    t.deepEqual(actual, expected, "getPitchRange Solo Violin max");
  }

  t.end();
});

test("two_parts", function(t)
{
  let musicXML = fs.readFileSync("./scores/two_parts.xml");
  const scoreAnalyzer = ScoreAnalyzer(musicXML);

  {
    const actual = scoreAnalyzer.getInstrumentsWithMelody("BGBC");
    const expected = ["Violin"];
    t.deepEqual(actual, expected, "getInstrumentsWithMelody");
  }

  {
    const actual = scoreAnalyzer.getInstrumentsWithMelody("GD");
    const expected = ["Flute"];
    t.deepEqual(actual, expected, "getInstrumentsWithMelody");
  }

  t.end();
});

test("two_tempos", function(t)
{
  let musicXML = fs.readFileSync("./scores/two_tempos.xml");
  const scoreAnalyzer =  ScoreAnalyzer(musicXML);

  {
    const actual = scoreAnalyzer.getTempos();
    const expected = [105, 90];
    t.deepEqual(actual, expected, "getTempos");
  }

  { //confirms for single instrument we can use the same queries
    const actual = scoreAnalyzer.getPitchRange("Flute")["minPitch"];
    const expected = scoreAnalyzer.getPitchRange()["minPitch"];
    t.deepEqual(actual, expected, "getTempos");
  }

  t.end();
});

test("AccidentalsEverywhere", function(t)
{
  let musicXML = fs.readFileSync("./scores/AccidentalsEverywhere.xml");
  const scoreAnalyzer = ScoreAnalyzer(musicXML);

  {
    const actual = scoreAnalyzer.getAccidentals();
    const expected = 8;
    t.deepEqual(actual, expected, "getAccidentals");
  }

  t.end();
});
