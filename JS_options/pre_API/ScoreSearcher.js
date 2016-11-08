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

  //create objects for each instrument, this will reduce searching whole score
  //'instrument-name' is only used in a initialization part of a score
  //after which, score-part id refers to the instruments
  makeInstrumentObjects()
  {
    let instrumentNames = [];

    function process(key, value) //builds array of instrument objects
    {
      if (key === 'instrument-name') instrumentNames.push(value);
      if (key === 'part')
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
    let pair = this.findExtremePitches(this.instrumentObjects[instrumentName]);
    return pair['max'];
  }

  getMinPitchOf(instrumentName)
  {
    let pair = this.findExtremePitches(this.instrumentObjects[instrumentName]);
    return pair['min'];
  }

  getInstrumentObjects(){return this.instrumentObjects;}
}

module.exports = ScoreSearcher;
