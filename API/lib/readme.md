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
returns the names of the instruments in the score as an array, ex:
```javascript
[ "Voice", "Piano" ]
```

### getPitchRange(instrumentName)
returns an object to represent the lowest and highest pitch in terms of midi numbers for an instrument or the entire score if no instrumentName is provided, ex:
```javascript
{"minPitch": 30, "maxPitch": 72"}
```

### getKeySignatures(instrumentName)
returns the key signatures for a particular instrument as an array, or the entire score if no instrumentName is provided, ex:
```javascript
["Ab", "Eb"]
```
  
### getTempos()
returns an array containing all tempos in the score, ex:
```javascript
[105, 90]
```

### getTimeSignatures()
returns an array of objects to represent the time signatures, ex:
```javascript
[{ beatType: 4, beats: 4}, {beatType: 8, beats: 9}] 
```
to show the score has time signatures 4/4 and 9/8 (in any instrument part). Note that node.js may reorder keys in objects.

### getDynamics(instrumentName)
returns an array of dynamics for a particular instrument, or for the score if no instrumentName is provided, ex:
```javascript
["ff",  "f",  "mf"] 
```

### getRhythmComplexity(instrumentName)
returns an array of note lengths for a particular instrument or the entire score if no instrumentName is provided,ex:

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
