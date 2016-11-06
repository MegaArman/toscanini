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
        const basicPiece = new ScoreSearcher(result);

        //test finding highest pitch
        const highestActual = basicPiece.getMaxPitch();
        const highestExpected = 68; //Ab

        t.equal(highestActual, highestExpected, 'highest pitch');

        //test finding lowest pitch
        const lowestActual = basicPiece.getMinPitch();
        const lowestExpected = 15; //Eb

        t.equal(lowestActual, lowestExpected, 'lowest pitch');

        //test instrument names
        const actualInstrumentNames = Object.keys(basicPiece.getInstrumentObjects());
        const expectedInstrumentNames = [ 'Choir Aahs', 'Grand Piano' ];

        t.deepEqual(actualInstrumentNames, expectedInstrumentNames, 'instrument names');

        //end
        t.end();
     });
  });
});
