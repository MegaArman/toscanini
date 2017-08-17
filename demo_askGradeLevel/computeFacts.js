//writeFacts will extract and write facts of a score to a file
//takes a directory to read from and filename to write to
const Toscanini = require("./Toscanini.js");
const Grader = require("./Grader.js");

module.exports = (musicxml) =>
{
  const gradeLevel = Grader(musicxml);
  const toscanini = Toscanini(musicxml);
  const instrumentNames = toscanini.getInstrumentNames(); //[]
  const facts = {};

  instrumentNames.forEach((instrumentName) =>
  {
    const articulations = gradeLevel.assessArticulations(instrumentName);
    const dynamics = gradeLevel.assessDynamics(instrumentName);
    const meter = gradeLevel.assessMeter(instrumentName);
    const rhythmicComplexity =
      gradeLevel.assessRhythmicComplexity(instrumentName);
    const tempo = gradeLevel.assessTempo(instrumentName);
    const overall = (articulations + dynamics + meter
      + rhythmicComplexity + tempo) / 5;
      
    facts[instrumentName] =
      [articulations, dynamics, meter, rhythmicComplexity, tempo, overall];
  });

  const articulations = gradeLevel.assessArticulations();
  const dynamics = gradeLevel.assessDynamics();
  const meter = gradeLevel.assessMeter();
  const rhythmicComplexity =
    gradeLevel.assessRhythmicComplexity();
  const tempo = gradeLevel.assessTempo();
  const overall = (articulations + dynamics + meter
    + rhythmicComplexity + tempo) / 5;

  facts["score"] =
    [articulations, dynamics, meter, rhythmicComplexity, tempo, overall];

  return facts;
};
