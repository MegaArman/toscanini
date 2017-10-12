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
    const actual = toscanini.getRhythmicComplexity();
    const expected = [{dotted: 1, type: "half"}, {dotted: 0, type: "eighth"},
      {dotted: 0, type: "quarter"}, {dotted: 1, type: "quarter"},
      {dotted: 0, type: "whole"},
      {dotted: 0, type: "half"}, {dotted: 3, type: "quarter"}];
    t.deepEqual(actual, expected, "getRhythmicComplexity score");
  }

  {
    const actual = toscanini.getRhythmicComplexity("Violin");
    const expected = [{dotted: 1, type: "half"}, {dotted: 0, type: "eighth"},
      {dotted: 0, type: "quarter"}, {dotted: 1, type: "quarter"},
      {dotted: 0, type: "whole"}];
    t.deepEqual(actual, expected, "getRhythmicComplexity Violin");
  }

  {
    const actual = toscanini.getRhythmicComplexity("String Bass");
    const expected = [{dotted: 0, type: "whole"},
      {dotted: 0, type: "half"}, {dotted: 1, type: "quarter"},
      {dotted: 1, type: "half"}, {dotted: 3, type: "quarter"}];
    t.deepEqual(actual, expected, "getRhythmicComplexity String Bass");
  }
  t.end();
});

test("rhythmic_complexity rests", (t) =>
{
  const musicXML =
    fs.readFileSync(
      path.resolve(__dirname, "../scores/rests.xml"));

  const toscanini = Toscanini(musicXML);

  {
    const actual = toscanini.getRhythmicComplexity();
    const expected = [];
    t.deepEqual(actual, expected, "getRhythmicComplexity score");
  }

  t.end();
});
