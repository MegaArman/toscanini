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

      {//test finding highest pitch
        const actual = avaMaria.getMaxPitch();
        const expected = 68; //Ab
        t.deepEqual(actual, expected, 'highest pitch');
      }

      {//test finding lowest pitch
        const actual = avaMaria.getMinPitch();
        const expected = 15; //Eb
        t.deepEqual(actual, expected, 'lowest pitch');
      }

      {//test instrument names
        const expected = [ 'Voice', 'Piano' ];
        const actual = Object.keys(avaMaria.getInstrumentObjects());
        t.deepEqual(actual, expected, 'instrument names');
      }

      {//test getMaxPitchOf
        const actual = avaMaria.getMaxPitchOf('Voice');
        const expected = 65; //F
        t.deepEqual(actual, expected, 'getMaxPitchOf');
      }

      {//test getMinPitchOf
        const actual = avaMaria.getMinPitchOf('Voice');
        const expected = 53; //F
        t.deepEqual(actual, expected, 'getMinPitchOf');
      }

      t.end();
   });
  });
});

test('vivaldi_winter tests', function(t){
  fs.readFile('../scores/vivaldi_winter.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
      const vivaldi = new ScoreSearcher(result);

      {//test instrument names
        const expected =[ 'Solo Violin', 'Violin I',
                          'Violin II', 'Viola', 'Violoncello',
                          'Contrabass', 'Harpsichord' ];
        const actual = Object.keys(vivaldi.getInstrumentObjects());
        t.deepEqual(actual, expected, 'instrument names');
      }

      {//test getMaxPitchOf
        const actual = vivaldi.getMaxPitchOf('Viola');
        const expected = 62; //D5
        t.deepEqual(actual, expected, 'getMaxPitchOf');
      }

      {//test getMaxPitchOf Violin
        const actual = vivaldi.getMaxPitchOf('Solo Violin');
        const expected = 79; //G6
        t.deepEqual(actual, expected, 'getMaxPitchOf');
      }

      t.end();
    });
  });
});
