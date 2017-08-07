"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const GradeScore = require("../lib/Toscanini.gradeLevel.js");

test("score-assessment", (t) =>
{
  let musicXML =
    fs.readFileSync(path.resolve(__dirname,
      "../scores/basiccres.xml"));
  let gradeScore = GradeScore(musicXML);

  {
    const actual = Math.round(gradeScore.assessArticulations());
    const expected = 0;
    t.deepEqual(actual, expected,
      "assess articulations score");
  }
  t.end();
});
