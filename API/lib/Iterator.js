"use strict";
const et = require("elementtree");

const createIterator = (partsBeatMap) =>
{
  const iterator = {};
  const errors =  
  {
    "noNext": "no next exists!",
    "noPrev": "no prev exists!",
    "badMeasure": "measure does not exist!"
  };

  let measures = [];
  let measureNum = 0;
  let beatMap = measures[0];
  let beatIndex = -1;

  iterator.selectInstrument = (instrumentName) =>
  {
    if (instrumentName in partsBeatMap)
    {
      measures = partsBeatMap[instrumentName];
      beatMap = measures[0];
      beatIndex = -1;
      return true;
    }
    else
    {
     //TODO should an error be thrown???
     return false;
    }
  };

  iterator.setMeasureNum = (newMeasureNum) =>
  {
    if (newMeasureNum <= 0 || newMeasureNum >= measures.length)
    {
      throw new Error(errors.badMeasure);
    }
    measureNum = newMeasureNum;
    beatMap = measures[measureNum];
    beatIndex = -1;
  };

  iterator.nextMeasure = () =>
  { 
    if (measureNum === measures.length - 1)
    {
      throw new Error(errors.noNext);
    }
    beatMap = measures[++measureNum];
    beatIndex = 0;
    return beatMap[0];
  };

  iterator.prevMeasure = () =>
  {
    if (measureNum === 0)
    {
      throw new Error(errors.noPrev);
    }
    beatMap = measures[--measureNum];
    beatIndex = 0;
    return beatMap[0];
  };

  iterator.next = () =>
  {
   if (beatIndex === beatMap.length - 1)
   {
    iterator.nextMeasure();
    return beatMap[beatIndex];
   }
   return beatMap[++beatIndex];
  };

  iterator.hasNext = () =>
  {
    return (beatIndex < beatMap.length - 1 
            ||  measureNum < measures.length - 1);
  };

  iterator.prev = () =>
  {
    if (beatIndex === 0)
    {
      iterator.prevMeasure();
      beatIndex = beatMap.length - 1;
      return beatMap[beatIndex];
    }
    return beatMap[--beatIndex];
  };

  iterator.hasPrev = () =>
  {
    return (beatIndex > 0 ||  measureNum > 0);
  };

  return Object.freeze(iterator);
};

const constructor = (musicxml) =>
{
  const etree = et.parse(musicxml);
  const partNames = etree.findall(".//part-name")
                   .map((partName) => partName.text);

  //we accumulate (acc)  measures as we reduce
  const partsBeatMap = etree.findall(".//part").reduce((acc, val, index) =>
  {
    let divisions;
   
    acc[partNames[index]] = val.findall(".//measure").map((measure) => 
    {
      const beatMap = [];
      let currentBeat = 1;
        
      measure._children.forEach((child) => 
      {
        if (child.tag === "attributes")
        {
          //"For example, if duration = 1 and divisions = 2, 
          //this is an eighth note duration"
          divisions = parseInt(child.findtext(".//divisions"));
        }
        else if (child.tag === "note")
        {
          const symbol = {notes:[]}; //a note or a rest
          const currentNote = {};

          symbol.beat = Math.ceil((currentBeat / divisions));

          if (!(currentBeat % divisions) === 1) //not on downbeat
          {
            symbol.beat += (currentBeat % divisions) / divisions;
          }

          //***DURATION IN TERMS OF QUARTERS!***

          //symbol.duration = parseInt(child.findtext(".//duration")) 
          /// divisions;
          currentNote.duration = 
            parseInt(child.findtext(".//duration")) / divisions;

          //symbol.noteType = "";
          //child.findall(".//dot").forEach(() => symbol.noteType += "dot ");
          //symbol.noteType += child.findtext(".//type");
          currentNote.noteType = "";
          child.findall(".//dot").forEach(() => currentNote.noteType += "dot ");
          currentNote.noteType += child.findtext(".//type");
         
          //***the note is constructed:
          symbol.notes.push(currentNote);


          if (child.findtext("[rest]"))
          {
            symbol.rest = true; 
          }
          else if (child.findtext("[pitch]"))
          { 
            const step = child.findtext(".//step");
            const accidentals = child.findall(".//accidental");
            const octave = child.findtext(".//octave");
            let noteString = step;
            
            accidentals.forEach((accidental) => 
            {
              if (accidental.text === "flat")
              {
                noteString += "b";
              }
              else if (accidental.text === "sharp")
              {
                noteString += "#";
              }
            });

            noteString += octave;
            //symbol.pitch = [noteString];
            currentNote.pitch = noteString;
          }

          //chord stuff------------------------------------------         
          //if it's a chord we don't want to double count duration
          //single voice chord case:
          if (child.findtext("[chord]")) 
          {
            const lastIndex = beatMap.length - 1;
            beatMap[lastIndex].notes.push(symbol.notes[0]);             
          } 
          //two voice chord case:
          else
          {
            const indexOfExistingBeat = beatMap.findIndex((oldSymbol) =>
                                        oldSymbol.beat === currentBeat);
            if (indexOfExistingBeat !== -1)
            {
              beatMap[indexOfExistingBeat].pitch.push(symbol.pitch[0]);
            }
            else 
            {
              beatMap.push(symbol);
            }

            currentBeat += parseInt(child.findtext(".//duration"));
          }
        }
        else if (child.tag === "backup")
        {
          currentBeat -= parseInt(child.findtext(".//duration"));
        }
        else if (child.tag === "forward")
        {
          currentBeat += parseInt(child.findtext(".//duration"));
        } 
      });

      return beatMap;
    });

    return acc;
  }, {});
   
  return createIterator(partsBeatMap);
};

module.exports = constructor;

