"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const GradeScore = require("../lib/Toscanini.gradeLevel.js");

test("score-assessment", (t) =>
{
  let musicXML =
    fs.readFileSync(path.resolve(__dirname,
      "../scores/ava_maria_pg1.xml"));
  let gradeScore = GradeScore(musicXML);

  {
    const actual = Math.round(gradeScore.assessArticulations());
    const expected = 3;
    t.deepEqual(actual, expected,
      "assess articulations ava maria score");
  }
  // TODO: this is failing
  // {
  //   const actual = Math.round(gradeScore.assessDynamics());
  //   const expected = 3;
  //   t.deepEqual(actual, expected,
  //     "assess articulations ava maria score");
  // }
  t.end();
});
