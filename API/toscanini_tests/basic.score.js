"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("basic", (t) =>
{
  const musicxml =
    fs.readFileSync(path.resolve(__dirname, "../scores/basic.xml"));
  const toscanini = Toscanini(musicxml);

  {
    const actual = toscanini.getValsByTagName("octave");
    const expected = ["4", "4", "5"];
    t.deepEqual(actual, expected, "getValsByTagName");
  }
  t.end();
});
