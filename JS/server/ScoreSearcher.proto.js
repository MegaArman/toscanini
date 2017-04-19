"use strict";

//"private static" utility definitions=========================================
const pitchToMidiNum = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A":9, "B": 11};
const fifthToPitch =
{"-6": "Gb", "-5": "Db", "-4":"Ab", "-3": "Eb", "-2": "Bb", "-1": "F",
"0": "C", "1": "G", "2": "D", "3": "A", "4": "E", "5": "B", "6": "F#"};

function traverse(obj,func)
{
  for (let i in obj)
  {
    func.apply(this,[i, obj[i]]);
    if (obj[i] !== null && typeof(obj[i])==="object") traverse(obj[i],func);
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
const factoryScoreSearcher = (musicObj) =>
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

  scoreSearcher.getInstrumentNames = () => Object.keys(instrumentObjects);

  scoreSearcher.getMinPitch = (instrumentName) =>//of the whole piece
  {
    let jsObj = instrumentName ? instrumentObjects[instrumentName] : musicObj;
    let midiNum = 0;
    let min = 999;

    function process(key, value)
    {
      if (key === "step") midiNum += pitchToMidiNum[value];
      if (key === "alter") midiNum += parseInt(value);
      if (key === "octave")
      {
        midiNum += parseInt(value) * 12;
        if (min > midiNum) min = midiNum;
        midiNum = 0; //"octave" is the last key in a note, so reset
      }
    }

    traverse(jsObj, process);
    return min;
  };

  scoreSearcher.getMaxPitch = (instrumentName) =>
  {
    let jsObj = instrumentName ? instrumentObjects[instrumentName] : musicObj;
    let midiNum = 0;
    let max = -999;

    function process(key, value)
    {
      if (key === "step") midiNum += pitchToMidiNum[value];
      if (key === "alter") midiNum += parseInt(value);
      if (key === "octave")
      {
        midiNum += parseInt(value) * 12;
        if (max < midiNum) max = midiNum;
        midiNum = 0; //"octave" is the last key in a note, so reset
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
        let newKeySig = fifthToPitch[value];
        let shouldPush = true;

        for (let oldKeySig of keySignatures) //avoid duplicates
        {
          if (newKeySig === oldKeySig) shouldPush = false;
        }

        if (shouldPush) keySignatures.push(newKeySig);
      }
    }

    traverse(musicObj, process);
    return keySignatures;
  };

  scoreSearcher.getInstrumentsWithMelody = (melodyString) =>
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
      if (key === "step") midiNum += pitchToMidiNum[value];
      if (key === "alter") midiNum += parseInt(value);
      if (key === "octave")
      {
        //Must do scoreSearcher... suppose there"s a Cb
        midiNum += parseInt(value) * 12;
        tempStrNotes += midiNumToNote(midiNum);
        midiNum = 0; //"octave" is the last key in a note, so reset
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
      if (key === "tempo")
			{
				const tempo = parseInt(value);
				const exists = tempos.some((oldTempo) => (oldTempo === tempo));
				
				if (!exists)
					tempos.push(parseInt(value));
			}
    }

    traverse(musicObj, process);
    return tempos;
  };

  scoreSearcher.getAccidentals = () =>
  {
    let currKey = {"C": 0, "D": 0, "E": 0, "F": 0, "G": 0, "A": 0, "B": 0}; //Sharps/flats for a given note
    let accidentals = 0;
    let currNote = "A";

    function setKey(fifths)
    {
      let keyArray = [0, 0, 0, 0, 0, 0, 0]; //[F, C, G, D, A, E, B]
      if (fifths > 0)   //Sharps
      {
        for (let i = 0; i < fifths; i++)
        {
          keyArray[i % 7]++;
        }
      }
      else if (fifths < 0)   //Flats
      {
        for (let i = 0; i < (-fifths); i++)
        {
          keyArray[6 - (i % 7)]--;
        }
      }
      currKey["F"] = keyArray[0];
      currKey["C"] = keyArray[1];
      currKey["G"] = keyArray[2];
      currKey["D"] = keyArray[3];
      currKey["A"] = keyArray[4];
      currKey["E"] = keyArray[5];
      currKey["B"] = keyArray[6];
    }

    function process(key, value)
    {
      if (key === "fifths")
        setKey(value);
      else if (key === "step")
        currNote = value;
      else if (key === "alter" && currKey[currNote] !== parseInt(value))
        accidentals++;
    }

    traverse(musicObj, process);
    return accidentals;
  };

  return scoreSearcher;
};

module.exports = factoryScoreSearcher;
