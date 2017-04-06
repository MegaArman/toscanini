// node ScoreSearcher.spec.js to run this test - simple as that!
// ...but if you want pretty output use npm run test or npm t
"use strict";
const fs = require("fs");
const test = require("tape").test;
const ScoreSearcher = require("./ScoreSearcher");

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

  {
    const actual = scoreSearcher.notesInRange("", 55, 24); //Highest to lowest note
    const expected = 62;
    console.log("Actual: " + actual);
    t.deepEqual(actual, expected, "notesInRange");
  }

  t.end();
});
