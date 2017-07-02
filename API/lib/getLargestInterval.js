const fs = require("fs");
const path = require("path");
const Iterator = require("../lib/Iterator");
const noteToMidi = require("../lib/Concertmaster").noteToMidi;
const musicxml = fs.readFileSync(path.resolve(__dirname, "../scores/basic.xml"))
                 .toString();

//returns largest pitch interval in semitones
function getLargestAscendingInterval()
{
  const a = Iterator(musicxml);
  const b = Iterator(musicxml);  
  let largestInterval = -1;

  a.next();
  while (a.hasNext() && b.hasNext())
  {
    const aNext = a.next();
    const bNext = b.next();
    const newInterval = noteToMidi(aNext.note) - noteToMidi(bNext.note);

    if (aNext.note && bNext.note && newInterval > largestInterval)
    {
      largestInterval = newInterval;
    }
  }
  return largestInterval;
}


function getLargestDescendingInterval()
{
  const a = Iterator(musicxml);
  const b = Iterator(musicxml);  
  let largestInterval = 1;

  a.next();
  while (a.hasNext() && b.hasNext())
  {
    const aNext = a.next();
    const bNext = b.next();
    const newInterval = noteToMidi(aNext.note) - noteToMidi(bNext.note);

    if (aNext.note && bNext.note && newInterval <largestInterval)
    {
      largestInterval = newInterval;
    }
  }
  return largestInterval;
}

console.log(getLargestAscendingInterval());
console.log(getLargestDescendingInterval());
