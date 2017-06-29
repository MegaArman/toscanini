"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../Toscanini");

test("two_time_signatures", (t) =>
{
  const musicxml =
    fs.readFileSync(
      path.resolve(__dirname, "../scores/time_signature_change.xml"));
  const toscanini = Toscanini(musicxml);

  {
    const actual = toscanini.getTimeSignatures();
    const expected = [[4,4], [9,8]];
    t.deepEqual(actual, expected, "getTimeSignatures");
  }

  t.end();
});
