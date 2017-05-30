"use strict";

//"private static" utility definitions=========================================
const pitchToMidiNum = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A":9, "B": 11};
const fifthToPitch =
{
  "-6": "Gb", "-5": "Db", "-4":"Ab", "-3": "Eb", "-2": "Bb", "-1": "F",
  "0": "C","1": "G", "2": "D", "3": "A", "4": "E", "5": "B", "6": "F#"
};

function traverse(obj,func)
{
  Object.keys(obj).forEach((key) =>
  {
    func.apply(this,[key, obj[key]]);
    if (obj[key] !== null && typeof(obj[key])==="object")
    {
      traverse(obj[key],func);
    }
  });
}

//create objects for each part, this will reduce searching whole score.
//part being the full name of parts, ex: Solo Violin, Violin I, Violin II
function makeInstrumentObjects(musicObj)
{
  const partNames = [];
  const instrumentObjects = {};

  function searchForInstruments(obj)
  {
    Object.keys(obj).forEach((key) =>
    {
      const value = obj[key];

      if (key === "part-name") 
      {
        partNames.push(value);
      }
      //the actual parts data are in an ordered array found via key "part"
      //bc they"re ordered, they correspond to the ordering of the part-names
      else if (key === "part")
      {
        let index = 0;

        partNames.forEach((name) =>
        {
          instrumentObjects[name] = value[index]; //value is array of parts
          index++;
        });

        return; //avoid redundant traversal- VERY IMPORTANT
      }
      else if (value !== null && typeof(value)==="object")
      { 
       searchForInstruments(value);
      }
    });
  }
  searchForInstruments(musicObj);

  //if there's a single instrument we need to do some hacking...
  if (Object.keys(instrumentObjects).length === 1)
  {
    const instrumentName = Object.keys(instrumentObjects)[0];
    instrumentObjects[instrumentName] = musicObj;
  }

  return instrumentObjects;
}

//=============================================================================
//"class"
const createToscanini = (musicObj) =>
{
  //"private" variables..note state is safest kept constant-------------------
  const toscanini = {};
  const instrumentObjects = makeInstrumentObjects(musicObj);

  //"private" functions in scope------------------------------
  //...ex: function poop() { ... }

  //"public" functions---------------------------
  toscanini.findValsByKey = (targetKey) =>
  {
    function process(key,value) //called with every property and it"s value
    {
      if (key === targetKey) 
      {
        console.log(value);
      }
    }

    traverse(musicObj, process);
  };

  toscanini.getInstrumentNames = () => Object.keys(instrumentObjects);

  toscanini.getPitchRange = (instrumentName) =>//of the whole piece
  {
    let jsObj = instrumentName ? instrumentObjects[instrumentName] : musicObj;
    let midiNum = 0;
    let min = 999;
    let max = -999;

    function process(key, value)
    {
      if (key === "step")
      {
        midiNum += pitchToMidiNum[value];
      }
      else if (key === "alter") 
      {
        midiNum += parseInt(value);
      }
      else if (key === "octave")
      {
        midiNum += parseInt(value) * 12;
        if (min > midiNum) 
        {
          min = midiNum;
        }
        if (max < midiNum) 
        {
          max = midiNum;
        }
        midiNum = 0; //"octave" is the last key in a note, so reset
      }
    }

    traverse(jsObj, process);
    const range = {"minPitch": min, "maxPitch": max};
    return range;
  }; 

  toscanini.getKeySignatures = () =>
  {
    let keySignatures = [];

    function process(key,value)
    {
      if (key === "fifths")
      {
        let newKeySig = fifthToPitch[value];
        let shouldPush = true;

        keySignatures.forEach((oldKeySignature) =>
        {
          if (newKeySig === oldKeySignature)
          {
            shouldPush = false;
          }
        });

        if (shouldPush)
        {
          keySignatures.push(newKeySig);
        }
      }
    }

    traverse(musicObj, process);
    return keySignatures;
  };

  toscanini.getInstrumentsWithMelody = (melodyString) =>
  {
    let tempStrNotes = "";
    let instrumentsWithMelody = [];
    let midiNum = 0;

    //build a string of notes ex: CDAGB--------------------
    function midiNumToNote(midiNum)
    {
      const notes =
      ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      let pitchNum = midiNum % 12; //remove the octave info
      return (notes[pitchNum]);
    }

    function process(key, value)
    {
      if (key === "step")
      {
        midiNum += pitchToMidiNum[value];
      }
      else if (key === "alter")
      {
        midiNum += parseInt(value);
      }
      else if (key === "octave")
      {
        //Must do toscanini... suppose there"s a Cb
        midiNum += parseInt(value) * 12;
        tempStrNotes += midiNumToNote(midiNum);
        midiNum = 0; //"octave" is the last key in a note, so reset
      }
    }
    //---------------------------------------------------

    Object.keys(instrumentObjects).forEach((instrumentName) =>
    {
      traverse(instrumentObjects[instrumentName], process);

      if (tempStrNotes.includes(melodyString))
      {
        instrumentsWithMelody.push(instrumentName);
      }
      tempStrNotes = "";
    });

    return instrumentsWithMelody;
  };

  toscanini.getTempos = () =>
  {
    const tempos = [];

    function process(key,value)
    {
      if (key === "tempo")
      {
        const newTempo = parseInt(value);
        
        if (!tempos.includes(newTempo)) 
        {
          tempos.push(newTempo);
        }
      }
    }

    traverse(musicObj, process);
    return tempos;
  };

  toscanini.getTimeSignatures = () =>
  {
    const timeSignatures = []; //ex: [{beats: 5, beats-type: 2}, ...]
    
    function process(key,value)
    {
     if (key === "time")
     {
      const newTimeSignature = 
        [parseInt(value["beats"]), parseInt(value["beat-type"])];
 
      if (!timeSignatures.some((oldTimeSignature) => 
            oldTimeSignature[0] === newTimeSignature[0]
            && oldTimeSignature[1] === newTimeSignature[1])) 
      {
        timeSignatures.push(newTimeSignature);
      } 
     }
    }

    traverse(musicObj, process);
    return timeSignatures;
  };

  return toscanini;
}; //createToscanini 

//======================================================================
const xml2js = require("xml2js");
const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

const constructor = (musicxml) =>
{
  let scoreObj;

  parser.parseString(musicxml, (err, obj) =>
  {
    if (err)
    {
      throw err;
    }
    scoreObj = obj;
  });

  return createToscanini(scoreObj);
};

module.exports = constructor; 
