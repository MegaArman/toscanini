// node ScoreSearcher.spec.js to run this test - simple as that!
// ...but if you want pretty output use npm test
'use strict';
const fs = require('fs');
const xml2js = require('xml2js');
const test = require('tape').test;
const ScoreSearcher = require('./ScoreSearcher');

const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

test('avamariapg1 tests', function(t){
  fs.readFile('../scores/avamariapg1.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
      const avaMaria = new ScoreSearcher(result);

      {
        const actual = avaMaria.getMaxPitch();
        const expected = 68; //Ab
        t.deepEqual(actual, expected, 'highest pitch');
      }

      {
        const actual = avaMaria.getMinPitch();
        const expected = 15; //Eb
        t.deepEqual(actual, expected, 'lowest pitch');
      }

      {
        const expected = [ 'Voice', 'Piano' ];
        const actual = Object.keys(avaMaria.getInstrumentObjects());
        t.deepEqual(actual, expected, 'instrument names');
      }

      {
        const actual = avaMaria.getMaxPitchOf('Voice');
        const expected = 65; //F
        t.deepEqual(actual, expected, 'getMaxPitchOf');
      }

      {
        const actual = avaMaria.getMinPitchOf('Voice');
        const expected = 53; //F
        t.deepEqual(actual, expected, 'getMinPitchOf');
      }

      {
        const actual = ['Bb'];
        const expected = avaMaria.getKeySignatures();
        t.deepEqual(actual, expected, 'getKeySignatures');
      }

      t.end();
   });
  });
});

test('vivaldi_winter tests', function(t){
  fs.readFile('../scores/vivaldi_winter.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
      const vivaldi = new ScoreSearcher(result);

      {
        const expected =[ 'Solo Violin', 'Violin I',
                          'Violin II', 'Viola', 'Violoncello',
                          'Contrabass', 'Harpsichord' ];
        const actual = Object.keys(vivaldi.getInstrumentObjects());
        t.deepEqual(actual, expected, 'instrument names');
      }

      {
        const actual = vivaldi.getMaxPitchOf('Viola');
        const expected = 62; //D5
        t.deepEqual(actual, expected, 'getMaxPitchOf');
      }

      {
        const actual = vivaldi.getMaxPitchOf('Solo Violin');
        const expected = 79; //G6
        t.deepEqual(actual, expected, 'getMaxPitchOf');
      }

      t.end();
    });
  });
});

test('two_parts', function(t){
  fs.readFile('../scores/two_parts.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
      const twoParts = new ScoreSearcher(result);

      {
        const actual = twoParts.getInstrumentsWithMelody('GD');
        const expected = ['Flute']; //G6
        t.deepEqual(actual, expected, 'getInstrumentsWithMelody');
      }

      t.end();
    });
  });
});
