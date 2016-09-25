//The purpose of this class is to find basic information about music scores
class ScoreSearcher
{
  //pitch => [{step: ['C']}, octave['4']}] as returned from searching obj
  //from xml2js

  constructor(musicObj) //a JS object from xml2js
  {
    this.musicObj = musicObj;
    this.pitchRef = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A':9, 'B': 11};

    this.maxPitch = -999;
    this.minPitch = 999;
    this.findExtremePitches();
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

  findExtremePitches() //finds max and min pitch
  {
    let midiNoteNum = 0;

    function process(key, value)
    {
      if (key == 'step')
      {
        midiNoteNum += this.pitchRef[value];
      }

      if (key == 'alter')
      {
        midiNoteNum += parseInt(value);
      }

      if (key == 'octave')
      {
        midiNoteNum += parseInt(value) * 12;

        if (this.maxPitch < midiNoteNum)
        {
          this.maxPitch = midiNoteNum;
        }

        if (this.minPitch > midiNoteNum)
        {
          this.minPitch = midiNoteNum;
        }

        midiNoteNum = 0;
      }
    }

    this.traverse(this.musicObj, process);
  }

  getMaxPitch()
  {
    return this.maxPitch;
  }

  getMinPitch()
  {
    return this.minPitch;
  }
}

module.exports = ScoreSearcher;
