//Currently the 'import' statement is not widely supported, hence 'require' suffices
let fs = require('fs'),
    xml2js = require('xml2js');
let parser = new xml2js.Parser();
let ScoreSearcher = require('./ScoreSearcher.js');

fs.readFile('./super_basic.xml', function(err, data) {     //data is the whole score as a string!!!
    let basicPieceRaw;

    parser.parseString(data, function (err, result) {
        basicPieceRaw = result;

        const basicPiece = new ScoreSearcher(basicPieceRaw);
        basicPiece.findPitches();
        console.log('Done');
    });
});
