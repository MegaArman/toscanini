class Notate
{
  midiNumToNote(midiNoteNum)
  {
    const notes =
    ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    let pitchNum = midiNoteNum % 12;
    let octaveNum = Math.floor(midiNoteNum / 12);

    return (notes[pitchNum] + octaveNum);
  }
}

module.exports = Notate;
