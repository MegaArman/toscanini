//The purpose of this class is to find basic information about music scores
// let pitchRef = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A':9, 'B': 11};


class ScoreSearcher
{

  constructor(musicObj) //a JS object from xml2js
  {
    this.musicObj = musicObj;
    this.pitchRef = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A':9, 'B': 11};
  }

  traverse(musicObj,func)
  {
      for (var i in musicObj) {
          func.apply(this,[i, musicObj[i]]);
          if (musicObj[i] !== null && typeof(musicObj[i])=="object") {
              //going on step down in the object tree!!
              this.traverse(musicObj[i],func);
          }
      }
  }

  findPitches()
  {
    //called with every property and it's value
    function process (key,value)
    {
        if (key == 'pitch')
        {
          console.log(value);
        }
    }

    this.traverse(this.musicObj, process);
  }

  findHighestPitch()
  {
    function process(key, value)
    {
      let midiNoteNum = 0;


      if (key == 'step')
      {
        // console.log(this.pitchRef);
        console.log('step ' + value);
        // // midiNoteNum += this.pitchRef.value;
        //

        console.log('midiNoteNum ' + this.pitchRef[value]);
      }

      if (key == 'alter')
      {
        // console.log('alter ' + value);
      }

      if (key == 'octave')
      {
        // console.log('octave ' + value);
      }

    }

    this.traverse(this.musicObj, process);
  }
}

module.exports = ScoreSearcher;
