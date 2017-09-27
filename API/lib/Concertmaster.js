const Concertmaster = {};
const pitchToMidi = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A":9, "B": 11};

Concertmaster.noteToMidi = (note) =>
{
  const pitchMidi = pitchToMidi[note[0]];
  const accidental = (note.length === 3) ? note[1]:undefined; 
  const octaveMidi = (accidental) ? parseInt(note[2]) * 12:
    parseInt(note[1]) * 12;

  if (accidental === "b")
  {
    return (pitchMidi - 1 + octaveMidi);
  }
  else if (accidental === "#")
  {
    return (pitchMidi + 1 + octaveMidi);
  }
  else
  {
    return (pitchMidi + octaveMidi);
  }
};

Concertmaster.fifthsToKey = (fifth) =>
{
  const fifthsToKeyMap = 
  {
    "-6": "Gb", "-5": "Db", "-4":"Ab", "-3": "Eb", "-2": "Bb", "-1": 
    "F","0": "C","1": "G", "2": "D", "3": "A", "4": "E", "5": "B", "6": "F#"
  };
  
  return fifthsToKeyMap[fifth];
};


module.exports = Concertmaster;
