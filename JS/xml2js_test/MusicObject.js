//MusicObject===========================
//The purpose of this class is to find basic information about music scores
let fs = require('fs'),
    xml2js = require('xml2js');

class MusicObject
{
  constructor(musicObj)
  {
    this.musicObj = musicObj;
    // console.dir(this.musicObj)
  }

  findPitches()
  {
    //called with every property and it's value
    function process(key,value)
    {
        if (key == 'pitch')
        {
          console.log(value);
        }
    }

    function traverse(musicObj,func)
    {
        for (var i in musicObj) {
            func.apply(this,[i, musicObj[i]]);
            if (musicObj[i] !== null && typeof(musicObj[i])=="object") {
                //going on step down in the object tree!!
                traverse(musicObj[i],func);
            }
        }
    }

    traverse(this.musicObj,process);
  }
}

//==================================Test out this object:==================

let parser = new xml2js.Parser();
let basicPieceRaw;

fs.readFile('./super_basic.xml', function(err, data) {
    //data is the whole score as a string!!!

    parser.parseString(data, function (err, result) {
        basicPieceRaw = result;

        const basicPiece = new MusicObject(basicPieceRaw);
        basicPiece.findPitches();
        console.log('Done');
    });
});
