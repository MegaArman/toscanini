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

module.exports = Concertmaster;
