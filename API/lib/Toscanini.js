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

  toscanini.getDynamics = (instrumentName) =>
  {
    const finalDynamics = [];

    let dynamics = instrumentName ? getPart(instrumentName)
      .findall(".//dynamics") : etree.findall(".//dynamics");

    var notNullList = false;
    var found = -1;

    dynamics.forEach((dynamic) => {
      found = -1;
      dynamic = dynamic._children[0].tag;
      if (dynamic !== "other-dynamics")
      {
        for (var i = 0; i < finalDynamics.length; i++)
        {
          notNullList = true;
          if (finalDynamics[i].dynamic === dynamic)
          {
            found = i;
          }
        }

        if (notNullList === false)
        {
          var newDynamic = {dynamic: dynamic};
          finalDynamics.push(newDynamic);
        } 
      }
    });

    dynamics = instrumentName ? getPart(instrumentName)
      .findall(".//wedge") : etree.findall(".//wedge");


    dynamics.forEach((dynamic) => {
      dynamic = dynamic.attrib.type;
      found = -1;

      if (dynamic !== "stop" && dynamic !== "start")
      {
        for (var i = 0; i < finalDynamics.length; i++)
        {
          notNullList = true;
          if (finalDynamics[i].dynamic === dynamic)
          {
            found = i;
          }
        }

        if (notNullList === false)
        {
          var newDynamic = {dynamic: dynamic,
            frequency: 1};
          finalDynamics.push(newDynamic);
        }
        else if (found !== -1)
        {
          finalDynamics[found].frequency++;
        }
        else
        {
          var newDynamic = {dynamic: dynamic,
            frequency: 1};
          finalDynamics.push(newDynamic);
        }
      }
    });

    dynamics = instrumentName ? getPart(instrumentName)
      .findall(".//words") : etree.findall(".//words");

    dynamics.forEach((dynamic) => {
      dynamic = dynamic.text;
      found = -1;
      if (dynamic === "cres." || dynamic === "crescendo" || dynamic === "dim."
           || dynamic === "diminuendo" || dynamic === "descres."
           || dynamic === "descrescendo" || dynamic === undefined)
      {
        if (dynamic === "cres.")
        {
          dynamic = "crescendo";
        }
        else if (dynamic = "dim.")
        {
          dynamic = "diminuendo";
        }
        else if (dynamic = "decres.")
        {
          dynamic = "descrescendo";
        }

        for (var i = 0; i < finalDynamics.length; i++)
        {
          notNullList = true;
          if (finalDynamics[i].dynamic === dynamic)
          {
           found = i;
          }
        }

        if (notNullList === false)
        {
          var newDynamic = {dynamic: dynamic,
          frequency: 1};
          finalDynamics.push(newDynamic);
        }
        else if (found !== -1)
        {
          finalDynamics[found].frequency++;
        }
        else
        {
          var newDynamic = {dynamic: dynamic,
           frequency: 1};
          finalDynamics.push(newDynamic);
        }
      }
    });

    return finalDynamics;
  };

  toscanini.getNumberOfMeasures = () => parts[0].findall(".//measure").length; 

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

  toscanini.getTempos = (instrumentName) =>
  {
    const tempos = instrumentName ?
      getPart(instrumentName).findall(".//per-minute")
      : etree.findall(".//per-minute");

    const tempoCollection = [];

    tempos.forEach((tempo) =>
    {
      const newTempo =  {};
      newTempo.tempo = parseInt(tempo.text);
      newTempo.frequency = 1;

      var notNullList = false;
      var found = -1;

      for (var i = 0; i < tempoCollection.length; i++)
      {
        notNullList = true;
        if (tempoCollection[i].tempo === newTempo.tempo)
        {
          found = i;
        }
      }

      if (notNullList === false)
      {
        tempoCollection.push(newTempo);
      }
      else if (found !== -1)
      {
        tempoCollection[found].frequency++;
      }
      else
      {
        tempoCollection.push(newTempo);
      }
    });

    if (tempoCollection.length === 0)
    {
      const filledTempo = {tempo: 120, frequency: 1}
      tempoCollection.push(filledTempo);
    }

    return tempoCollection;
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
      const duplicate = timeSignatures.some((oldTimeSignature) =>
      {
        return beats === oldTimeSignature.beats 
          && beatType === oldTimeSignature.beatType;
      });  
     
      if (!duplicate)
      {  
        timeSignatures.push({beats: beats, beatType: beatType}); 
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
