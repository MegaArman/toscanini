"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const GradeScore = require("./Toscanini.gradeLevel.js");


test ("assess-meter", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "./scores/ava_maria_pg1.xml"));
  const gradeScore = GradeScore(musicXML);

  {
    const actual = gradeScore.assessMeter();
    const expected = 1;
    t.deepEqual(actual, expected, "assess-meter ave maria");
  }

  t.end();
});
