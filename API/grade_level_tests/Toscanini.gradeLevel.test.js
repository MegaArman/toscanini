"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const GradeScore = require("../lib/Toscanini.gradeLevel.js");

test("assess-articulations", (t) =>
{
  let musicXML =
    fs.readFileSync(path.resolve(__dirname,
      "../scores/musicxml/32a-Notations.xml"));
  let gradeScore = GradeScore(musicXML);

  {
    const actual = gradeScore.assessArticulations();
    const expected = 4.625;
    t.deepEqual(actual, expected,
      "assess articulations extreme: 32a-Notations");
  }
  t.end();
});

test("assess-dynamics", (t) =>
{
  let musicXML =
    fs.readFileSync(path.resolve(__dirname,
      "../scores/musicxml/31a-Directions.xml"));
  let gradeScore = GradeScore(musicXML);

  {
    const actual = gradeScore.assessDynamics();
    const expected = 4.625;
    //TODO
    //score has 4/4 and 3/8
    t.deepEqual(actual, expected, "assess dynamics extreme: 31a-Directions");
  }

  musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/vivaldi_winter.xml"));
  gradeScore = GradeScore(musicXML);

  {
    const actual = gradeScore.assessDynamics();
    const expected = 2.25;
    //score has 4/4 and 3/8
    t.deepEqual(actual, expected, "assess dynamics grade 2.5: vivaldi_winter");
  }

  {
    const actual = gradeScore.assessDynamics("Solo Violin");
    const expected = 2.2;
    //score has 4/4 and 3/8
    t.deepEqual(actual, expected,
      "assess dynamics grade 2.5: vivaldi_winter Solo Violin");
  }

  t.end();
});

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

  {
    const actual = gradeScore.assessMeter("Piano");
    const expected = 1;
    t.deepEqual(actual, expected, "assess-meter grade 1: ave maria piano");
  }

  {
    const actual = gradeScore.assessMeter("Voice");
    const expected = 1;
    t.deepEqual(actual, expected, "assess-meter grade 1: ave maria voice");
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

  {
    const actual = gradeScore.assessMeter("Solo Violin");
    const expected = 2.5;
    //score has 4/4 and 3/8
    t.deepEqual(actual, expected,
      "assess-meter grade 2.5: vivaldi_winter Solo Violin");
  }

  {
    const actual = gradeScore.assessMeter("Violoncello");
    const expected = 2.5;
    //score has 4/4 and 3/8
    t.deepEqual(actual, expected,
      "assess-meter grade 2.5: vivaldi_winter Violoncello");
  }

  t.end();
});

test ("assess-rhythmic-complexity", (t) =>
{
  let musicXML = fs.readFileSync(path.resolve(__dirname,
    "../scores/musicxml/03a-Rhythm-Durations.xml"));
  let gradeScore = GradeScore(musicXML);

  {
    const actual = Math.round(gradeScore.assessRhythmicComplexity());
    const expected = 5;
    t.deepEqual(actual, expected,
      "assess-rhythmic-complexity grade 6: many rhythmic durations");
  }

  musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/ava_maria_pg1.xml"));
  gradeScore = GradeScore(musicXML);

  {
    const actual = Math.round(gradeScore.assessRhythmicComplexity());
    const expected = 3;
    t.deepEqual(actual, expected,
      "assess-rhythmic-complexity grade 3: ave maria");
  }

  {
    const actual =
      Math.round(gradeScore.assessRhythmicComplexity("Voice"));
    const expected = 3;
    t.deepEqual(actual, expected,
      "assess-rhythmic-complexity grade 3: ave maria Voice");
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

  {
    const actual = gradeScore.assessTempo("Solo Violin");
    const expected = 3;
    //score has 4/4 and 3/8
    t.deepEqual(actual, expected,
      "assess-tempo grade 3: vivaldi_winter violin");
  }

  t.end();
});
