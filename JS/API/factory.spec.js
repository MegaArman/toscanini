// node ScoreSearcher.spec.js to run this test - simple as that!
// ...but if you want pretty output use npm run test
"use strict";
const fs = require("fs");
const xml2js = require("xml2js");
const test = require("tape").test;
const ScoreSearcher = require("./factory");
const parser =  xml2js.Parser({explicitArray: false, mergeAttrs: true});

test("avamariapg1 tests", function(t){
  let data = fs.readFileSync("../scores/avamariapg1.xml");

  parser.parseString(data, function (err, result) {
    if (err) throw err;

    const scoreSearcher =  ScoreSearcher(result);

    {
      const actual = scoreSearcher.getMaxPitch();
      const expected = 68; //Abn
      t.deepEqual(actual, expected, "highest pitch");
    }

    {
      const actual = scoreSearcher.getMinPitch();
      const expected = 15; //Eb
      t.deepEqual(actual, expected, "lowest pitch");
    }

    {
      const expected = [ "Voice", "Piano" ];
      const actual = Object.keys(scoreSearcher.getInstrumentObjects());
      t.deepEqual(actual, expected, "instrument names");
    }

    {
      const actual = scoreSearcher.getMaxPitchOf("Voice");
      const expected = 65; //F
      t.deepEqual(actual, expected, "getMaxPitchOf");
    }

    {
      const actual = scoreSearcher.getMinPitchOf("Voice");
      const expected = 53; //F
      t.deepEqual(actual, expected, "getMinPitchOf");
    }

    {
      const actual = ["Bb"];
      const expected = scoreSearcher.getKeySignatures();
      t.deepEqual(actual, expected, "getKeySignatures");
    }

    t.end();
 });
});

test("vivaldi_winter tests", function(t){
  let data = fs.readFileSync("../scores/vivaldi_winter.xml");

  parser.parseString(data, function (err, result) {
    if (err) throw err;
    const scoreSearcher =  ScoreSearcher(result);

    {
      const expected =[ "Solo Violin", "Violin I",
                        "Violin II", "Viola", "Violoncello",
                        "Contrabass", "Harpsichord" ];
      const actual = Object.keys(scoreSearcher.getInstrumentObjects());
      t.deepEqual(actual, expected, "instrument names");
    }

    {
      const actual = scoreSearcher.getMaxPitchOf("Viola");
      const expected = 62; //D5
      t.deepEqual(actual, expected, "getMaxPitchOf");
    }

    {
      const actual = scoreSearcher.getMaxPitchOf("Solo Violin");
      const expected = 79; //G6
      t.deepEqual(actual, expected, "getMaxPitchOf");
    }

    t.end();
  });
});

test("two_parts", function(t){
  let data = fs.readFileSync("../scores/two_parts.xml");

  parser.parseString(data, function (err, result) {
    if (err) throw err;

    const scoreSearcher = ScoreSearcher(result);

    {
      const actual = scoreSearcher.getInstrumentsWithMelody("BGBC");
      const expected = ["Violin"];
      t.deepEqual(actual, expected, "getInstrumentsWithMelody BGBC");
    }

    {
      const actual = scoreSearcher.getInstrumentsWithMelody("GD");
      const expected = ["Flute"];
      t.deepEqual(actual, expected, "getInstrumentsWithMelody GD");
    }

    t.end();
  });
});

test("two_tempos", function(t){
  let data = fs.readFileSync("../scores/two_tempos.xml");

  parser.parseString(data, function (err, result) {
    if (err) throw err;

    const scoreSearcher =  ScoreSearcher(result);

    {
      const actual = scoreSearcher.getTempos();
      const expected = [105, 90];
      t.deepEqual(actual, expected, "getTempos");
    }

    t.end();
  });
});
