"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("number_of_measures test", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/dynamics_test.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = 5;
    const expected = toscanini.getNumberOfMeasures();
    t.deepEqual(actual, expected, "getNumberOfMeasures score no changes");
  }

  t.end();
});

test("number_of_measures two tempos", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/two_tempos_scorelen.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = 3;
    const expected = toscanini.getNumberOfMeasures();
    t.deepEqual(actual, expected, "getNumberOfMeasures score some changes");
  }

  t.end();
});
