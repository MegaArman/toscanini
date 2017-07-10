"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("rhythmic_complexity", (t) =>
{
  let musicXML =
    fs.readFileSync(
      path.resolve(__dirname, "../scores/rhythmic_complexity.xml"));

  let toscanini = Toscanini(musicXML);

  // {
  //   const actual = toscanini.getRhythmComplexity();
  //   const expected = ["half 1", "eighth 0", "quarter 0", "quarter 1",
  //    "whole 0", "half 0", "quarter 3"];
  //   t.deepEqual(actual, expected, "getRhythmComplexity score");
  // }

  {
    const actual = toscanini.getRhythmComplexity("Violin");
    const expected = ["half 1", "eighth 0", "quarter 0", "quarter 1",
      "whole 0"];
    t.deepEqual(actual, expected, "getRhythmComplexity Violin");
  }
  //
  // {
  //   const actual = toscanini.getRhythmComplexity("String Bass");
  //   const expected = ["whole 0", "half 0", "quarter 1",
  //    "half 1", "quarter 3"];
  //   t.deepEqual(actual, expected, "getRhythmComplexity String Bass");
  // }
  //
  // musicXML =
  //   fs.readFileSync(
  //     path.resolve(__dirname, "../scores/triplets.xml"));
  //
  // toscanini = Toscanini(musicXML);
  //
  // {
  //   const actual = toscanini.getRhythmComplexity();
  //   const expected = ["quarter 0"];
  //   t.deepEqual(actual, expected, "getRhythmComplexity triplets");
  // }

  t.end();
});
