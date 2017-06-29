"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const GradeScore = require("../lib/Toscanini.gradeLevel.js");

test ("assess-meter", (t) =>
{
  let musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/ava_maria_pg1.xml"));
  let gradeScore = GradeScore(musicXML);

  {
    const actual = gradeScore.assessMeter();
    const expected = 1;
    t.deepEqual(actual, expected, "assess-meter grade 1: ave maria");
  }

  musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/vivaldi_winter.xml"));
  gradeScore = GradeScore(musicXML);

  {
    const actual = gradeScore.assessMeter();
    const expected = 2.5;
    //score has 4/4 and 3/8
    t.deepEqual(actual, expected, "assess-meter grade 2.5: vivaldi_winter");
  }
  t.end();
});

test ("assess-tempo", (t) =>
{
  let musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/ava_maria_pg1.xml"));
  let gradeScore = GradeScore(musicXML);

  {
    const actual = gradeScore.assessTempo();
    const expected = 6;
    t.deepEqual(actual, expected, "assess-tempo grade 6: ave maria");
  }

  musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/vivaldi_winter.xml"));
  gradeScore = GradeScore(musicXML);

  {
    const actual = gradeScore.assessTempo();
    const expected = 3;
    //score has 4/4 and 3/8
    t.deepEqual(actual, expected, "assess-tempo grade 3: vivaldi_winter");
  }

  t.end();
});
