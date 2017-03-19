// node ScoreSearcher.spec.js to run this test - simple as that!
// ...but if you want pretty output use npm run test or npm t
"use strict";
const fs = require("fs");
const test = require("tape").test;
const ScoreSearcher = require("./ScoreSearcher");

test("avamariapg1 tests", function(t)
{
  let musicXML = fs.readFileSync("../scores/avamariapg1.xml");
  const scoreSearcher =  ScoreSearcher(musicXML);

  {
    const actual = scoreSearcher.getMaxPitch();
    const expected = 68; //Abn
    t.deepEqual(actual, expected, "getMaxPitch");
  }

  {
    const actual = scoreSearcher.getMinPitch();
    const expected = 15; //Eb
    t.deepEqual(actual, expected, "getMinPitch");
  }

  {
    const actual = scoreSearcher.getInstrumentNames();
    const expected = [ "Voice", "Piano" ];
    t.deepEqual(actual, expected, "getInstrumentNames");
  }

  {
    const actual = scoreSearcher.getMaxPitch("Voice");
    const expected = 65; //F
    t.deepEqual(actual, expected, "getMaxPitch");
  }

  {
    const actual = scoreSearcher.getMinPitch("Voice");
    const expected = 53; //F
    t.deepEqual(actual, expected, "getMinPitch");
  }

  {
    const actual = ["Bb"];
    const expected = scoreSearcher.getKeySignatures();
    t.deepEqual(actual, expected, "getKeySignatures");
  }

  t.end();
});

test("vivaldi_winter tests", function(t)
{
  let musicXML = fs.readFileSync("../scores/vivaldi_winter.xml");
  const scoreSearcher =  ScoreSearcher(musicXML);

  {
    const actual = scoreSearcher.getInstrumentNames();
    const expected =[ "Solo Violin", "Violin I",
                      "Violin II", "Viola", "Violoncello",
                      "Contrabass", "Harpsichord" ];
    t.deepEqual(actual, expected, "getInstrumentNames");
  }

  {
    const actual = scoreSearcher.getMaxPitch("Viola");
    const expected = 62; //D5
    t.deepEqual(actual, expected, "getMaxPitch");
  }

  {
    const actual = scoreSearcher.getMaxPitch("Solo Violin");
    const expected = 79; //G6
    t.deepEqual(actual, expected, "getMaxPitch");
  }

  t.end();
});

test("two_parts", function(t)
{
  let musicXML = fs.readFileSync("../scores/two_parts.xml");
  const scoreSearcher = ScoreSearcher(musicXML);

  {
    const actual = scoreSearcher.getInstrumentsWithMelody("BGBC");
    const expected = ["Violin"];
    t.deepEqual(actual, expected, "getInstrumentsWithMelody");
  }

  {
    const actual = scoreSearcher.getInstrumentsWithMelody("GD");
    const expected = ["Flute"];
    t.deepEqual(actual, expected, "getInstrumentsWithMelody");
  }

  t.end();
});

test("two_tempos", function(t)
{
  let musicXML = fs.readFileSync("../scores/two_tempos.xml");
  const scoreSearcher =  ScoreSearcher(musicXML);

  {
    const actual = scoreSearcher.getTempos();
    const expected = [105, 90];
    t.deepEqual(actual, expected, "getTempos");
  }

  { //confirms for single instrument we can use the same queries
    const actual = scoreSearcher.getMinPitch("Flute");
    const expected = scoreSearcher.getMinPitch();
    t.deepEqual(actual, expected, "getTempos");
  }

  t.end();
});

test("AccidentalsEverywhere", function(t)
{
  let musicXML = fs.readFileSync("../scores/AccidentalsEverywhere.xml");
  const scoreSearcher = ScoreSearcher(musicXML);

  {
    const actual = scoreSearcher.notesInRange("", 64, 24); //Highest to lowest note
    const expected = 100;
    t.deepEqual(actual, expected, "notesInRange");
  }

  t.end();
});
