// node ScoreSearcher.spec.js to run this test - simple as that!
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

        //test finding highest pitch
        const highestActual = avaMaria.getMaxPitch();
        const highestExpected = 68; //Ab

        t.deepEqual(highestActual, highestExpected, 'highest pitch');

        //test finding lowest pitch
        const lowestActual = avaMaria.getMinPitch();
        const lowestExpected = 15; //Eb

        t.deepEqual(lowestActual, lowestExpected, 'lowest pitch');

        //test instrument names
        const actualInstrumentNames = Object.keys(avaMaria.getInstrumentObjects());
        const expectedInstrumentNames = [ 'Choir Aahs', 'Grand Piano' ];

        t.deepEqual(actualInstrumentNames,
          expectedInstrumentNames, 'instrument names');

        //test maxPitchFor
        const actualChoirMax = avaMaria.getMaxPitchOf('Choir Aahs');
        const expectedChoirMax = 65; //F

        t.deepEqual(actualChoirMax, expectedChoirMax, 'getMaxPitchOf');

        //test minPitchFor
        const actualChoirMin = avaMaria.getMinPitchOf('Choir Aahs');
        const expectedChoirMin = 53; //F

        t.deepEqual(actualChoirMin, expectedChoirMin, 'getMinPitchOf');

        //end
        t.end();
     });
  });
});
