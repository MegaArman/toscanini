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
  let largestInterval;

  a.next();
  while (a.hasNext() && b.hasNext())
  {
    const aNext = a.next();
    const bNext = b.next();
    const newInterval = noteToMidi(a.next().note) - noteToMidi(b.next().note);
    largestInterval = (largestInterval < newInterval) ? 
                       newInterval: largestInterval;
  }

  return largestInterval;
}
console.log(getLargestInterval());
