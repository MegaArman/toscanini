"use strict";
const xml2js = require("xml2js");
const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

//"private static" utility definitions=========================================
const pitchRef = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A":9, "B": 11};
const fifthsRef =
{"-6": "Gb", "-5": "Db", "-4":"Ab", "-3": "Eb", "-2": "Bb", "-1": "F",
"0": "C", "1": "G", "2": "D", "3": "A", "4": "E", "5": "B", "6": "F#"};

function traverse(musicObj,func)
{
  for (let i in musicObj)
  {
    func.apply(this,[i, musicObj[i]]);

    if (musicObj[i] !== null && typeof(musicObj[i])==="object")
    {
      traverse(musicObj[i],func);
    }
  }
}

//create objects for each part, this will reduce searching whole score.
//part being the full name of parts, ex: Solo Violin, Violin I, Violin II
function makeInstrumentObjects(musicObj)
{
  let partNames = [];
  let instrumentObjects = {};

  function process(key, value) //builds array of instrument objects
  {
    //first find the part names as they"re always towards the top of file
    //This will be pushed in the correct order as we see them:
    if (key === "part-name") partNames.push(value);

    //the actual parts data are in an ordered array found via key "part"
    //bc they"re ordered, they correspond to the ordering of the part-names
    if (key === "part")
    {
      let index = 0;
      for (let name of partNames)
      {
        instrumentObjects[name] = value[index]; //value is array of parts
        index++;
      }

      return; //avoid redundant traversal
    }
  }

  traverse(musicObj, process);
  return instrumentObjects;
}

//=============================================================================
//"class"
const scoreSearcher= (musicObj) =>
{
  //"private" variables..note state is safest kept constant-------------------
  const scoreSearcher = {};
  const instrumentObjects = makeInstrumentObjects(musicObj);

  //"private" functions in scope------------------------------

  //...ex: function poop() { ... }

  //"public" functions---------------------------
  scoreSearcher.findValsByKey = (targetKey) =>
  {
    function process(key,value) //called with every property and it"s value
    {
      if (key === targetKey) console.log(value);
    }

    traverse(musicObj, process);
  };

  scoreSearcher.getMinPitch = (instrumentName) =>//of the whole piece
  {
    let jsObj = instrumentName ? instrumentObjects[instrumentName] : musicObj;
    let midiNoteNum = 0;
    let min = 999;

    function process(key, value)
    {
      if (key === "step") midiNoteNum += pitchRef[value];
      if (key === "alter") midiNoteNum += parseInt(value);
      if (key === "octave")
      {
        midiNoteNum += parseInt(value) * 12;
        if (min > midiNoteNum) min = midiNoteNum;
        midiNoteNum = 0; //"octave" is the last key in a note, so reset
      }
    }

    traverse(jsObj, process);
    return min;
  };

  scoreSearcher.getMaxPitch = (instrumentName) =>
  {
    let jsObj = instrumentName ? instrumentObjects[instrumentName] : musicObj;
    let midiNoteNum = 0;
    let max = -999;

    function process(key, value)
    {
      if (key === "step") midiNoteNum += pitchRef[value];
      if (key === "alter") midiNoteNum += parseInt(value);
      if (key === "octave")
      {
        midiNoteNum += parseInt(value) * 12;
        if (max < midiNoteNum) max = midiNoteNum;
        midiNoteNum = 0; //"octave" is the last key in a note, so reset
      }
    }

    traverse(jsObj, process);
    return max;
   };

  scoreSearcher.getKeySignatures = () =>
  {
    let keySignatures = [];

    function process(key,value)
    {
      if (key === "fifths")
      {
        let newKeySig = fifthsRef[value];
        let shouldPush = true;

        for (let oldKeySig of keySignatures) //avoid duplicates
        {
          if (newKeySig === oldKeySig)
          {
            shouldPush = false;
          }
        }

        if (shouldPush) keySignatures.push(newKeySig);
      }
    }

    traverse(musicObj, process);
    return keySignatures;
  };

  scoreSearcher.getInstrumentNames= () =>
  {
    return Object.keys(instrumentObjects);
  };

  scoreSearcher.getInstrumentsWithMelody = (melodyString) =>
  {
    let tempStrNotes = "";
    let instrumentsWithMelody = [];
    let midiNoteNum = 0;

    //build a string of notes ex: CDAGB--------------------
    function midiNumToNote(midiNoteNum)
    {
      const notes =
      ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      let pitchNum = midiNoteNum % 12; //remove the octave info
      return (notes[pitchNum]);
    }

    function process(key, value)
    {
      if (key === "step") midiNoteNum += pitchRef[value];
      if (key === "alter") midiNoteNum += parseInt(value);
      if (key === "octave")
      {
        //Must do scoreSearcher... suppose there"s a Cb
        midiNoteNum += parseInt(value) * 12;
        tempStrNotes += midiNumToNote(midiNoteNum);
        midiNoteNum = 0; //"octave" is the last key in a note, so reset
      }
    }
    //---------------------------------------------------

    for (let instrumentData in instrumentObjects)
    {
      traverse(instrumentObjects[instrumentData], process);

      if (tempStrNotes.includes(melodyString))
      {
        instrumentsWithMelody.push(instrumentData);
      }
      tempStrNotes = "";
    }

    return instrumentsWithMelody;
  };

  scoreSearcher.getTempos = () =>
  {
    let tempos = [];

    function process(key,value)
    {
      if (key === "tempo") tempos.push(parseInt(value));
    }

    traverse(musicObj, process);
    return tempos;
  };

  return scoreSearcher;
};

//Constructor
const ScoreSearcher = (MusicXML) =>
{
  let scoreSearcherInstance;

  parser.parseString(MusicXML, function (err, result) {
    if (err) throw err;
    scoreSearcherInstance = scoreSearcher(result);
  });

  return scoreSearcherInstance;
};

module.exports = ScoreSearcher;
