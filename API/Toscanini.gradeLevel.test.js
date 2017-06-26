"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const GradeLevel = require("./Toscanini.gradeLevel.js");

test ("assess-meter", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "./scores/ava_maria_pg1.xml"));
  const gradeLevel = GradeLevel(musicXML);

  {
    const actual = gradeLevel.assessMeter();
    const expected = [];
    t.deepEqual(actual, expected, "getInstrumentNames");
  }
});
