"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("rhythmic_complexity", (t) =>
{
  const musicXML =
    fs.readFileSync(
      path.resolve(__dirname, "../scores/rhythmic_complexity.xml"));
      
  const toscanini = Toscanini(musicXML);

  {
    const actual = toscanini.getRhythmComplexity();
    const expected = ["half 1", "quarter 0", "quarter 1",
     "eighth 0", "whole 0", "half 0", "quarter 3"];
    t.deepEqual(actual, expected, "getRhythmComplexity score");
  }

  {
    const actual = toscanini.getRhythmComplexity("Violin");
    const expected = ["half 1", "quarter 0", "quarter 1",
     "eighth 0", "whole 0"];
    t.deepEqual(actual, expected, "getRhythmComplexity Violin");
  }

  {
    const actual = toscanini.getRhythmComplexity("String Bass");
    const expected = ["whole 0", "half 0", "quarter 1", "half 1", "quarter 3"];
    t.deepEqual(actual, expected, "getRhythmComplexity String Bass");
  }
  t.end();
});
