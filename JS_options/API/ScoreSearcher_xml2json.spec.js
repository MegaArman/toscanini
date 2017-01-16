// // uses the faster xml2json parser (not browser compatible!),
// // but note that this may not work on Windows environments...
// // purpose being for a backend app
// 'use strict';
// const fs = require('fs');
// const test = require('tape').test;
// const ScoreSearcher = require('./ScoreSearcher');
//
// const parser = require('xml2json');
// test('avamariapg1 tests', function(t){
//   fs.readFile('../scores/avamariapg1.xml', function(err, data) {
//
//     const jsonstring = parser.toJson(data);
//     const result = JSON.parse(jsonstring);
//
//     const avaMaria = new ScoreSearcher(result);
//
//     {
//       const actual = avaMaria.getMaxPitch();
//       const expected = 68; //Ab
//       t.deepEqual(actual, expected, 'highest pitch');
//     }
//
//     {
//       const actual = avaMaria.getMinPitch();
//       const expected = 15; //Eb
//       t.deepEqual(actual, expected, 'lowest pitch');
//     }
//
//     {
//       const expected = [ 'Voice', 'Piano' ];
//       const actual = Object.keys(avaMaria.getInstrumentObjects());
//       t.deepEqual(actual, expected, 'instrument names');
//     }
//
//     {
//       const actual = avaMaria.getMaxPitchOf('Voice');
//       const expected = 65; //F
//       t.deepEqual(actual, expected, 'getMaxPitchOf');
//     }
//
//     {
//       const actual = avaMaria.getMinPitchOf('Voice');
//       const expected = 53; //F
//       t.deepEqual(actual, expected, 'getMinPitchOf');
//     }
//
//     {
//       const actual = ['Bb'];
//       const expected = avaMaria.getKeySignatures();
//       t.deepEqual(actual, expected, 'getKeySignatures');
//     }
//
//     t.end();
//   });
// });
//
// test('vivaldi_winter tests', function(t){
//   fs.readFile('../scores/vivaldi_winter.xml', function(err, data) {
//
//     const jsonstring = parser.toJson(data);
//     const result = JSON.parse(jsonstring);
//
//     const vivaldi = new ScoreSearcher(result);
//
//     {
//       const expected =[ 'Solo Violin', 'Violin I',
//                         'Violin II', 'Viola', 'Violoncello',
//                         'Contrabass', 'Harpsichord' ];
//       const actual = Object.keys(vivaldi.getInstrumentObjects());
//       t.deepEqual(actual, expected, 'instrument names');
//     }
//
//     {
//       const actual = vivaldi.getMaxPitchOf('Viola');
//       const expected = 62; //D5
//       t.deepEqual(actual, expected, 'getMaxPitchOf');
//     }
//
//     {
//       const actual = vivaldi.getMaxPitchOf('Solo Violin');
//       const expected = 79; //G6
//       t.deepEqual(actual, expected, 'getMaxPitchOf');
//     }
//
//     t.end();
//   });
// });
//
// test('two_parts', function(t){
//   fs.readFile('../scores/two_parts.xml', function(err, data) {
//
//     const jsonstring = parser.toJson(data);
//     const result = JSON.parse(jsonstring);
//
//
//     const twoParts = new ScoreSearcher(result);
//
//     {
//       const actual = twoParts.getInstrumentsWithMelody('BGBC');
//       const expected = ['Violin'];
//       t.deepEqual(actual, expected, 'getInstrumentsWithMelody BGBC');
//     }
//
//     {
//       const actual = twoParts.getInstrumentsWithMelody('GD');
//       const expected = ['Flute']; //G6
//       t.deepEqual(actual, expected, 'getInstrumentsWithMelody GD');
//     }
//
//     t.end();
//   });
// });
//
// test('two_tempos', function(t){
//   fs.readFile('../scores/two_tempos.xml', function(err, data) {
//     const jsonstring = parser.toJson(data);
//     const result = JSON.parse(jsonstring);
//
//     const twoParts = new ScoreSearcher(result);
//
//     {
//       const actual = twoParts.getTempos();
//       const expected = [105, 90];
//       t.deepEqual(actual, expected, 'getTempos');
//     }
//
//     t.end();
//   });
// });
