"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("two_time_signatures", (t) =>
{
  const musicxml =
    fs.readFileSync(
      path.resolve(__dirname, "../scores/time_sig_tempo_change.xml"));
  const toscanini = Toscanini(musicxml);

  {
    const actual = toscanini.getLengthScore();
    const expected = [1];
    t.deepEqual(actual, expected, "getLengthScore");
  }

  t.end();
});
