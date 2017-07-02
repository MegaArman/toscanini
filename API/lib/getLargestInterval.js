const fs = require("fs");
const path = require("path");
const Iterator = require("../lib/Iterator");
const noteToMidi = require("../lib/Concertmaster").noteToMidi;
const musicxml = fs.readFileSync(path.resolve(__dirname, "../scores/basic.xml"))
                 .toString();

//returns largest pitch interval in semitones
function getLargestInterval()
{
  const a = Iterator(musicxml);
  const b = Iterator(musicxml);  
  let largestAscendingInterval = 0;
  let largestDescendingInterval = 0;

  a.next();
  while (a.hasNext() && b.hasNext())
  {
    const aNext = a.next();
    const bNext = b.next();
    
    if (!aNext.note || !bNext.note)
    {
      continue;
    }

    const newInterval = noteToMidi(aNext.note) - noteToMidi(bNext.note);

    if (newInterval > largestAscendingInterval)
    {
      largestAscendingInterval = newInterval;
    }
    else if (newInterval  < largestDescendingInterval)
    {
      largestDescendingInterval = newInterval;
    }
  }
  return {"ascending": largestAscendingInterval, 
          "descending": largestDescendingInterval};
}

console.log(getLargestInterval());
