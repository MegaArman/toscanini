"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const GradeScore = require("./Toscanini.gradeLevel.js");


test ("assessment grade 1", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "./scores/ava_maria_pg1.xml"));
  const gradeScore = GradeScore(musicXML);

  {
    const actual = gradeScore.assessMeter();
    const expected = 1;
    t.deepEqual(actual, expected, "assess-meter grade 1: ave maria");
  }

  {
    const actual = gradeScore.assessTempo();
    const expected = 6;
    t.deepEqual(actual, expected, "assess-tempo grade 6: ave maria");
  }

  t.end();
});

test ("assess-meter grade 2.5", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "./scores/vivaldi_winter.xml"));
  const gradeScore = GradeScore(musicXML);

  {
    const actual = gradeScore.assessMeter();
    const expected = 2.5;
    //score has 4/4 and 3/8
    t.deepEqual(actual, expected, "assess-meter grade unknown: vivaldi_winter");
  }

  t.end();
});
