'use strict';
//The purpose of this class is to find basic information about music scores
class ScoreSearcher
{
  constructor(musicObj)
  {
    this.musicObj = musicObj; //the entire score
    this.pitchRef = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A':9, 'B': 11};
    this.maxPitch = null;
    this.minPitch = null;
    this.instrumentObjects = {};
    this.makeInstrumentObjects();
  }

  traverse(musicObj,func)
  {
    for (let i in musicObj)
    {
      func.apply(this,[i, musicObj[i]]);

      if (musicObj[i] !== null && typeof(musicObj[i])==='object')
      {
        this.traverse(musicObj[i],func);
      }
    }
  }

  findValsByKey(targetKey)
  {
    function process (key,value) //called with every property and it's value
    {
      if (key === targetKey) console.log(value);
    }

    this.traverse(this.musicObj, process);
  }

  //create objects for each part, this will reduce searching whole score.
  //part being the full name of parts, ex: Solo Violin, Violin I, Violin II
  makeInstrumentObjects()
  {
    let partNames = [];

    function process(key, value) //builds array of instrument objects
    {
      //first find the part names as they're always towards the top of file
      //This will be pushed in the correct order as we see them:
      if (key === 'part-name') partNames.push(value);

      //the actual parts data are in an ordered array found via key 'part'
      //bc they're ordered, they correspond to the ordering of the part-names
      if (key === 'part')
      {
        let index = 0;
        for (let name of partNames)
        {
          this.instrumentObjects[name] = value[index]; //value is array of parts
          index++;
        }

        return; //avoid redundant traversal:
      }
    }

    this.traverse(this.musicObj, process);
  }

  findExtremePitches(musicObj) //finds max and min pitch
  {
    let midiNoteNum = 0;
    let maxPitch = -999;
    let minPitch = 999;

    function process(key, value)
    {
      if (key === 'step') midiNoteNum += this.pitchRef[value];
      if (key === 'alter') midiNoteNum += parseInt(value);
      if (key === 'octave')
      {
        midiNoteNum += parseInt(value) * 12;

        if (maxPitch < midiNoteNum) maxPitch = midiNoteNum;
        if (minPitch > midiNoteNum) minPitch = midiNoteNum;

        midiNoteNum = 0; //'octave' is the last key in a note, so reset
      }
    }

    this.traverse(musicObj, process);
    return {'max': maxPitch, 'min': minPitch};
  }


  getMaxPitch() //of the whole piece
  {
    if (this.maxPitch === null)
    {
      let pair = this.findExtremePitches(this.musicObj);
      this.maxPitch = pair['max'];
    }
    return this.maxPitch;
  }

  getMinPitch() //of the whole piece
  {
    if (this.minPitch === null)
    {
      let pair = this.findExtremePitches(this.musicObj);
      this.minPitch = pair['min'];
    }
    return this.minPitch;
  }

  getMaxPitchOf(instrumentName)
  {
    if (Object.keys(this.instrumentObjects).length === 1)
    {
      return this.getMaxPitch();
    }
    let pair = this.findExtremePitches(this.instrumentObjects[instrumentName]);
    return pair['max'];
  }

  getMinPitchOf(instrumentName)
  {
    if (Object.keys(this.instrumentObjects).length === 1)
    {
      return this.getMinPitch();
    }
    let pair = this.findExtremePitches(this.instrumentObjects[instrumentName]);
    return pair['min'];
  }

  getInstrumentObjects(){return this.instrumentObjects;}
}

module.exports = ScoreSearcher;
