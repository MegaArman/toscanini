"use strict";

//"private static" utility definitions=========================================
const pitchToMidiNum = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A":9, "B": 11};
const fifthToPitch =
{
  "-6": "Gb", "-5": "Db", "-4":"Ab", "-3": "Eb", "-2": "Bb", "-1": "F",
  "0": "C","1": "G", "2": "D", "3": "A", "4": "E", "5": "B", "6": "F#"
};

//make properties immutable
Object.freeze(pitchToMidiNum);
Object.freeze(fifthToPitch);
//=============================================================================
//"class"
// etree represents the element tree for the entire score
const createToscanini = (etree) =>
{ 
  //private---------------------------
  const partNames = etree.findall(".//part-name")
                          .map((partName) => partName.text);
  const parts = etree.findall(".//part");
  const getPart = (instrumentName)  => parts[partNames.indexOf(instrumentName)];
 
  //public---------------------------- 
  const toscanini = {};
  
  toscanini.getInstrumentNames = () => partNames;
  
  toscanini.getPitchRange = (instrumentName) =>
  {
    const range = {minPitch: Infinity, maxPitch: -Infinity};
    const pitches = instrumentName ? 
       getPart(instrumentName).findall(".//pitch") : etree.findall(".//pitch");

    pitches.forEach((pitch) =>
    {
      const step  = pitchToMidiNum[pitch.findtext(".//step")];
      const alter = (pitch.findtext(".//alter") !== undefined) ? 
        parseInt(pitch.findtext(".//alter")) : 0;
      const octave = parseInt(pitch.findtext(".//octave")) * 12;
      const midiNum = step + alter + octave;

      if (midiNum < range.minPitch)
      {
        range.minPitch = midiNum;
      } 
      if (midiNum > range.maxPitch)
      {
        range.maxPitch = midiNum;
      }
    });
    
    return range;
  }; 

  toscanini.getKeySignatures = (instrumentName) =>
  {
    const keySignatures = [];
    const allFifths = instrumentName ? 
      getPart(instrumentName).findall(".//fifths") : etree.findall(".//fifths");

    allFifths.forEach((fifths) => 
    {
      if (!keySignatures.includes(fifthToPitch[fifths.text]))
      {
        keySignatures.push(fifthToPitch[fifths.text]);
      }
    });

    return keySignatures; 
  };

  toscanini.getTimeSignatures = (instrumentName) =>
  {
    const times = instrumentName ? 
      getPart(instrumentName).findall(".//time") : etree.findall(".//time");
    const timeSignatures = [];
    
    times.forEach((time) =>
    {
      const beats = parseInt(time.findtext(".//beats"));
      const beatType = parseInt(time.findtext(".//beat-type"));
      const newTimeSignature = {beats: beats, beatType: beatType};

      if (!timeSignatures.includes(newTimeSignature))
      {
        timeSignatures.push(newTimeSignature);
      }
    });

    return timeSignatures;
  };

  return Object.freeze(toscanini);
}; //createToscanini

//======================================================================
const elementtree = require("elementtree");
const constructor = (musicxml) => 
  createToscanini(elementtree.parse(musicxml.toString()));

module.exports = constructor;
