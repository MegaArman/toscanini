// node Toscanini.spec.js to run this test - simple as that!
// ...but if you want pretty output use npm run test or npm t
"use strict";
const fs = require("fs");
const test = require("tape").test;
const Toscanini = require("./Toscanini");

test("ava_maria_pg1 tests", (t) =>
{
  const musicXML = fs.readFileSync("./scores/ava_maria_pg1.xml");
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
    const actual = ["Bb"];
    const expected = toscanini.getKeySignatures();
    t.deepEqual(actual, expected, "getKeySignatures");
  }

  t.end();
});

test("vivaldi_winter tests", (t) =>
{
  const musicXML = fs.readFileSync("./scores/vivaldi_winter.xml");
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
    const actual = [[4, 4], [3, 8]];
    const expected = toscanini.getTimeSignatures("Violin I");
    t.deepEqual(actual, expected, "getTimeSignatures Violin I");
  }

  {
    const actual = [[4, 4], [3, 8]];
    const expected = toscanini.getTimeSignatures();
    t.deepEqual(actual, expected, "getTimeSignatures score");
  }

  {
    const actual = [68, 60, 33, 78, 45, 40];
    const expected = toscanini.getTempos("Viola");
    t.deepEqual(actual, expected, "getTempos Viola");
  }

  {
    const actual = [68, 60, 33, 78, 45, 40];
    const expected = toscanini.getTempos();
    t.deepEqual(actual, expected, "getTempos score");
  }
  t.end();
});

test("two_parts", (t) =>
{
  const musicXML = fs.readFileSync("./scores/two_parts.xml");
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

test("two_tempos", (t) =>
{
  const musicXML = fs.readFileSync("./scores/two_tempos.xml");
  const toscanini =  Toscanini(musicXML);

  {
    const actual = toscanini.getTempos();
    const expected = [105, 90];
    t.deepEqual(actual, expected, "getTempos");
  }

  { //confirms for single instrument we can use the same queries
    const actual = toscanini.getPitchRange("Flute")["minPitch"];
    const expected = toscanini.getPitchRange()["minPitch"];
    t.deepEqual(actual, expected, "getTempos");
  }

  t.end();
});

test("two_time_signatures", (t) =>
{
  const musicxml = fs.readFileSync("./scores/time_signature_change.xml");
  const toscanini = Toscanini(musicxml);

  {
    const actual = toscanini.getTimeSignatures();
    const expected = [[4,4], [9,8]];
    t.deepEqual(actual, expected, "getTimeSignatures");
  }
  t.end();
});
