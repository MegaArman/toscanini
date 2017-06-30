const fs = require("fs");
const path = require("path");
const Iterator = require("../lib/Iterator");

const musicxml = fs.readFileSync(path.resolve(__dirname, "../scores/basic.xml"))
                 .toString();

function getLargestInterval()
{
  const a = Iterator(musicxml);
  const b = Iterator(musicxml);

  a.next();

  while (a.next() !== undefined && b.next() !== undefined)
  {
    console.log(a);
  }
}
getLargestInterval();
