//The purpose of this class is to find basic information about music scores
class ScoreSearcher
{
  constructor(musicObj)
  {
    this.musicObj = musicObj;
    this.pitchRef = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A':9, 'B': 11};
    this.maxPitch = -999;
    this.minPitch = 999;
    this.instrumentObjects = {};
  }

  traverse(musicObj,func)
  {
    for (var i in musicObj)
    {
      func.apply(this,[i, musicObj[i]]);
      //recursively step down in the object tree:
      if (musicObj[i] !== null && typeof(musicObj[i])=='object') this.traverse(musicObj[i],func);
    }
  }

  findValsByKey(targetKey)
  {
    function process (key,value) //called with every property and it's value
    {
      if (key == targetKey) console.log(value);
    }

    this.traverse(this.musicObj, process);
  }

  findExtremePitches() //finds max and min pitch
  {
    let midiNoteNum = 0;

    function process(key, value)
    {
      if (key == 'step') midiNoteNum += this.pitchRef[value];
      if (key == 'alter') midiNoteNum += parseInt(value);

      if (key == 'octave')
      {
        midiNoteNum += parseInt(value) * 12;

        if (this.maxPitch < midiNoteNum) this.maxPitch = midiNoteNum;
        if (this.minPitch > midiNoteNum) this.minPitch = midiNoteNum;

        midiNoteNum = 0; //'octave' is the last key in a note, so reset
      }
    }

    this.traverse(this.musicObj, process);
  }

  //create objects for each instrument, this will reduce searching whole score
  //'instrument-name' is only used in a initialization part of a score
  //after which, score-part id refers to the instruments
  makeInstrumentObjects()
  {
    let instrumentNames = [];

    function process(key, value) //builds array of instrument objects
    {
      if (key == 'instrument-name') instrumentNames.push(value);

      //NOTE: duplicates are combined to
      // 1 array part:[p1 obj, p2 obj]
      if (key == 'part')
      {
        let index = 0;
        for (const name of instrumentNames)
        {
          this.instrumentObjects[name] = value[index];
          index++;
        }
      }
    }
    this.traverse(this.musicObj, process);
  }

  colorNotes() //finds max and min pitch
  {
    function traverse(musicObj)
    {
      for (var i in musicObj)
      {
        if (i == "note")
        {
          if (musicObj[i].length > 1) //TODO ACCOUNT FOR SINGLE NOTE
          {
            for (let x in musicObj[i])
            musicObj[i][x].notehead= { _: 'normal', '$': { color: '#0BFF1B' } };
          }
          else
          {
            musicObj[i].notehead= { _: 'normal', '$': { color: '#0BFF1B' } };
          }
        }
        //recursively step down in the object tree:
        if (musicObj[i] !== null && typeof(musicObj[i])=='object') traverse(musicObj[i]);
      }
    }

    traverse(this.musicObj);
    return this.musicObj;
  }

  getMaxPitch() { return this.maxPitch;}
  getMinPitch() { return this.minPitch;}
}

module.exports = ScoreSearcher;
