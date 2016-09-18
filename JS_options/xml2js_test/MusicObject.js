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

  findHighestPitch()
  {
    // console.log('finding highest pitch musicObj is ' + this.musicObj);

    // METHOD 1 for iterating over an entire object:
    // your object

    //called with every property and it's value
    function process(key,value)
    {
        if (key == 'pitch')
        {
          console.log(value);
        }
        // console.log(key + " : "+value);
    }

    function traverse(musicObj,func)
    {
        // console.log('in traverse ' + musicObj);

        for (var i in musicObj) {
            func.apply(this,[i, musicObj[i]]);
            if (musicObj[i] !== null && typeof(musicObj[i])=="object") {
                //going on step down in the object tree!!
                traverse(musicObj[i],func);
            }
        }
    }

    //that's all... no magic, no bloated framework
    traverse(this.musicObj,process);
  }
}
let parser = new xml2js.Parser();
let basicPieceRaw;

fs.readFile('./super_basic.xml', function(err, data) {
    //data is the whole score as a string!!!

    parser.parseString(data, function (err, result) {
        basicPieceRaw = result;
        // console.log('in parseString ');

        const basicPiece = new MusicObject(basicPieceRaw);
        basicPiece.findHighestPitch();
        console.log('Done');
    });

});

// console.dir(basicPieceRaw); //doesn't work!
