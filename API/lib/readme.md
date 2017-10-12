# toscanini 
Arturo Toscanini was one of the greatest conductors of the 20th century. His photographic memory allowed him to answer questions by his performers regarding their parts in entire performances, without physically examining the scores. 

Inspired by Arturo Toscanini's great ability and skill, we made this module to answer some of the most common questions about music scores, particularly with band directors, performers, and musicologists in mind.
Currently, this module only supports [MusicXML](https://en.wikipedia.org/wiki/MusicXML), though various other formats (Ex: Finale, Sibelius, etc) can be converted to MusicXML. See also https://www.npmjs.com/package/musicxml-iterator.

## Demo
https://megaarman.github.io/Toscanini/

## Installation <a name="installation"></a>
```
npm install toscanini
```

## Usage

```javascript
const Toscanini = require("toscanini"); //gives a factory function
const toscanini = Toscanini(musicXML); //create a Toscanini instance from a MusicXML string
toscanini.getPitchRange("Flute"); //assuming there is a flute in the score, see getInstrumentNames()
```

Currently supports the following queries:
### getInstrumentNames()
gets the names of the instruments in the score (returns as an array)

### getPitchRange(instrumentName)
Returns an object like {"minPitch": 30, "maxPitch": 72"} to represent the lowest and highest pitch in terms of midi numbers.
if no instrumentName is provided (ex: "Flute"), gets the min and max pitches of the entire score.

### getKeySignatures(instrumentName)
gets the key signatures of the whole piece (returns an array) or for a particular instrument
  
### getTempos()
returns an array containing all tempos in the score

### getTimeSignatures()
returns an array of objects like [{ beatType: 4, beats: 4}, {beatType: 8, beats: 9}] to show the score has time signatures 4/4 and 9/8 (in any instrument part). Note that node.js may reorder keys in objects.

### getDynamics(instrumentName)
returns an array of dynamics for a particular instrument, or all dynamics in a score

### getRhythmComplexity(instrumentName)
returns an array of note lengths associated with a score or instrument, returning a string or a series of strings, with a number representing the number of dots associated with that note.

ex.
half = half 0
dotted half = half 1
double dotted half = half 2

score result example: 
```javascript
["half 1", "quarter 0", "quarter 1", "eighth 0", "whole 0"];
```
### getNumberOfMeasures()
returns the number of measures in a score.
