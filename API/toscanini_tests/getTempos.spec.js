"use strict";
const fs = require("fs");
const path = require("path");
const test = require("tape").test;
const Toscanini = require("../lib/Toscanini");

test("two_tempos", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/two_tempos.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = toscanini.getTempos();
    const expected = [{tempo: 105, frequency: 1}, {tempo: 90, frequency: 1}];
    t.deepEqual(actual, expected, "getTempos");
  }

  t.end();
});

test("no tempos", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/basic.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = toscanini.getTempos();
    const expected = [{tempo: 120, frequency: 1}];
    t.deepEqual(actual, expected, "getTempos");
  }

  t.end();
});

test("repeating tempos", (t) =>
{
  const musicXML =
    fs.readFileSync(path.resolve(__dirname, "../scores/repeating_tempos.xml"));
  const toscanini =  Toscanini(musicXML);

  {
    const actual = toscanini.getTempos();
    const expected = [{tempo: 105, frequency: 2}, {tempo: 90, frequency: 1}];
    t.deepEqual(actual, expected, "getTempos");
  }

  t.end();
});
