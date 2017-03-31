"use strict";

//"private static" utility definitions=========================================
const xml2js = require("xml2js");
const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
const pitchToMidiNum = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A":9, "B": 11};

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

function ScoreIterable(instrumentObjects)
{
  let scoreIterable = {};
  let part = [];

  for (let instrumentName in instrumentObjects)
  {
    const process = (key, value) =>
    {
      let midiNum = 0;
      let timeNotesMap = new Map(); //contains {"default-x", [pitches]}
      //^ MUST USE MAP NOT OBJECT to ensure notes are always in correct order
      //strategy: loop through measure to see symbols happening
      //at same points in time (default-x)
      let voiceTimes = [];
      // ^^^ [5, 2] means voice 1 currently at 5, voice 2 currently at 2
      //voiceTimes[voice] => gives the time in beats the voice is from
      //beginning of measure
      let bassNoteDuration = -1000; //bass note of potential chord!
     if (key === "note") //NOTE: returns an array of note tags for a measure
     //**** A MEASURE
     {
       for (let singleNoteTag of value)
       {
         let voice = parseInt(singleNoteTag["voice"]);

         //check if first time seeing this voice
         if (voice === undefined)
         {
           throw new Error("No voice tag??");
         }
         else
         {
           while (voiceTimes.length < voice)
           {
             voiceTimes.push(0);
           }
         }

         if (singleNoteTag["pitch"] !== undefined)
         {
           //1) Calculate midinum
           //TODO: make helper
           midiNum += pitchToMidiNum[singleNoteTag["pitch"]["step"]];
           if (singleNoteTag["pitch"]["alter"] !== undefined)
              midiNum += parseInt(singleNoteTag["pitch"]["alter"]);
           midiNum += parseInt(singleNoteTag["pitch"]["octave"]) * 12;

           let note = {};
           note.midiNum = midiNum;
           note.duration = parseInt(singleNoteTag["duration"]);

           let currentTime = voiceTimes[voice - 1];

           //NOTE:two notes of same duration at same time can be same voice
           //two notes of different duration at same start time are two voices
           //^ this is mentioned in the musicxml standard!
           //only single voice playing multiple notes has chord tag
           if (singleNoteTag["chord"] !== undefined)
           {
             currentTime = currentTime - bassNoteDuration;
           }
          //  console.log("currentTime", currentTime);
          //  console.log("note", note);
           let existingVal = timeNotesMap.get(currentTime);
          //  console.log("existing", existingVal);

           if (existingVal)
           {
            //  console.log("existingVal", existingVal);
             existingVal.push(note);
             timeNotesMap.set(currentTime, existingVal);
           }
           else
           {
             let arr = [];
             arr.push(note);
             timeNotesMap.set(currentTime, arr);
           }

           if (singleNoteTag["chord"] === undefined)
           {
             voiceTimes[voice - 1] += note.duration;
             bassNoteDuration = note.duration;
           }
           midiNum = 0;
         }
         else if (singleNoteTag["rest"] !== undefined)
         {
           let currentTime = voiceTimes[voice - 1];
           let existingVal = timeNotesMap.get(currentTime);

           if (existingVal)
           {
             timeNotesMap.set(currentTime, existingVal);
           }
           else
           {
             let arr = [];
             arr.push(parseInt(singleNoteTag["duration"]));
             timeNotesMap.set(currentTime, arr);
           }

           part.push(singleNoteTag["duration"]); //TODO
         }
       } //loop through measure

       let sortedKeys = [];

       for (let key of timeNotesMap.keys())
       {
         sortedKeys.push(key);
       }
       sortedKeys.sort();

       for (let key of sortedKeys)
       {
         let timeStampedMap = new Map();
         timeStampedMap.set(key, timeNotesMap.get(key));
         part.push(timeStampedMap);
       }
       // in case coordinates are same
       //- could happen on new page or new measure?
       console.log("timeNotesMap", timeNotesMap);

     } //if note
   };
   traverse(instrumentObjects[instrumentName], process);

   scoreIterable[instrumentName] = part; //TODO
 } //loop through instruments

  return scoreIterable;
}

const errors =
{
  "noValidInstrumentSelected": 'No valid instrument selected, ex: ("Flute")!',
  "noNext": "no next exists",
  "noPrev": "no prev exists!",
  "invalidPosition": "setPosition to invalid index"
};

//=============================================================================
const factoryScoreIterator = (MusicXML) =>
{
  let musicObj;
  parser.parseString(MusicXML, function (err, jsObj)
  {
    if (err) throw err;
    musicObj = jsObj;
  });

  const instrumentObjects = makeInstrumentObjects(musicObj);
  const scoreIterator = {};
  let scoreIterable = ScoreIterable(instrumentObjects);
  // console.dir(scoreIterable);

  scoreIterable["Classical Guitar"].forEach((map) => console.log(map));
  let selectedInstrument = "NONE";
  let currentIndex = -1;

  scoreIterator.selectInstrument = (instrumentName) =>
  {
    selectedInstrument = instrumentName;
  };

  scoreIterator.next = () =>
  {
    if (currentIndex === scoreIterable[selectedInstrument].length - 1)
    {
      throw new Error(errors.noNext);
    }
    else
    {
      currentIndex++;
    }
    if (scoreIterable[selectedInstrument] === undefined)
      throw new Error(errors.noValidInstrumentSelected);
    return scoreIterable[selectedInstrument][currentIndex];
  };

  scoreIterator.prev = () =>
  {
    if (currentIndex === 0)
    {
      throw new Error("No prev exists!");
    }
    else
    {
      currentIndex--;
    }

    if (scoreIterable[selectedInstrument] === undefined)
      throw new Error(errors.noValidInstrumentSelected);
    return scoreIterable[selectedInstrument][currentIndex];
  };

  scoreIterator.hasNext = () =>
  {
    if (scoreIterable[selectedInstrument] === undefined)
      throw new Error(errors.noValidInstrumentSelected);

    return (currentIndex < scoreIterable[selectedInstrument].length - 1);
  };

  scoreIterator.hasPrev = () =>
  {
    if (scoreIterable[selectedInstrument] === undefined)
      throw new Error(errors.noValidInstrumentSelected);

    return (currentIndex > 0);
  };

  scoreIterator.getPosition = () => currentIndex;

  scoreIterator.setPosition = (position) =>
  {
    if (position > scoreIterable.length -1)
      throw new Error(errors.invalidPosition);
    currentIndex = position;
  };
  return scoreIterator;
}; //end of factory

module.exports = factoryScoreIterator;
