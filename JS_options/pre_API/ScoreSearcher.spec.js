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
          const expected = [ 'Choir Aahs', 'Grand Piano' ];
          const actual = Object.keys(avaMaria.getInstrumentObjects());
          t.deepEqual(actual, expected, 'instrument names');
        }

        {//test getMaxPitchOf
          const actual = avaMaria.getMaxPitchOf('Choir Aahs');
          const expected = 65; //F
          t.deepEqual(actual, expected, 'getMaxPitchOf');
        }

        {//test getMinPitchOf
          const actual = avaMaria.getMinPitchOf('Choir Aahs');
          const expected = 53; //F
          t.deepEqual(actual, expected, 'getMinPitchOf');
        }

        t.end();
     });
  });
});
