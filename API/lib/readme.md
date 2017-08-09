#  Toscanini "a library for music score analysis"
0. [Installation](#installation)
1. [Toscanini](#toscanini)
2. [Toscanini.Iterator](#iterator)
3. [Toscanini.Grader](#grader)

## Installation <a name="installation"></a>
```
npm install toscanini
```

## Toscanini <a name="toscanini"></a>
This is the main module, from which facts are extracted/computed from the music score. 

```javascript
const Toscanini = require("toscanini"); //gives a factory function
const toscanini = Toscanini(musicXML); //create a Toscanini instance from a musicXML string
toscanini.getPitchRange("Flute");
```

Currently supports the following queries:

### getPitchRange(instrumentName)
Returns an object like {"minPitch": 30, "maxPitch": 72"}
if no instrumentName is provided (ex: "flute"), gets the min and max pitches of the entire score.

### getKeySignatures(instrumentName)
gets the key signatures of the whole piece (returns an array) or for a particular instrument

### getInstrumentNames()
gets the name of the instruments in the score (returns as an array)
  
### getTempos()
returns an array containing all tempos in the score

### getTimeSignatures(instrumentName)
returns a matrix like so [[4,4], [9,8]] for time signatures 4/4 and 9/8, for a particular instrument

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
### getNumberOfMeasures
returns the number of measures in a score.

## Toscanini.Iterator <a name="iterator"></a>
This module aims to make melodic, harmonic, and rhythmic analysis easier by abstracting away the necessity of parsing musicxml in the form of an Iterator.

```javascript
const Iterator = require("toscanini/Iterator");
const i = Iterator(musicXML); //create an Iterator instance from a musicXML string
i.selectInstrumentName("Flute");
i.next();
```

### selectInstrument(instrumentName)
The iterator is set to the first measure of the instrument part specified by instrumentName (ex: "Violin")

### next()
The iterator moves to the next "symbol" (note(s) or rest) and returns an object to represent that symbol, for example:
    
```javascript
// outputs:
// {notes: [{duration: 1, noteType: "quarter", pitch: "B3"},
//          {duration: 1, noteType: "quarter", pitch: "D4"}],
// beat: 3};
```

So the next thing that the player sees to play is a B3 and D4, both quarter notes, hit on the downbeat of beat 3.

### nextMeasure()
The iterator moves to the first beat of the next measure

### prevMeasure()
The iterator moves to the first beat of the previous measure


### hasNext()
Returns true or false depending on whether or not there is a next symbol. 
***Use this to avoid an exception being thrown.***

### prev()
The iterator moves to the previous symbol be it a note or rest and returns an object to represent that symbol

### hasPrev()
Returns true or false depending on whether or not there is a previous symbol.
Use this to avoid an exception being thrown.

## Toscanini.Grader <a name="grader"></a>
Uses Toscanini, Grader assesses the difficulty of an entire score or instrument part within a score.

```javascript
const Grader = require("toscanini/Grader");
const grader = Grader(musicXML); // Create a Grader instance from a musicxml string
grader.assessDynamics();
// outputs a decimal number based on the grading rubrics below...
```

### assessDynamics(instrumentName)
provides an assessment, grading from 1-6, of dynamics in a score, with instrument specification


### assessDynamicsChoral(instrument)
provides an individual instrument assessment, grading from 1-6, of dynamics for a choral instrument

### assessDynamicsInstrument(instrument)
provides an individual instrument assessment, grading from 1-6, of dynamics for an instrument

### assessMeter(instrumentName)
provides an assessment, grading from 1-6, of meter in a score, with instrument specification

### assessRhythmicComplexity(instrumentName)
provides an assessment, grading from 1-6, of rhythmic complexity in a score, with instrument specification

### assessTempo(instrumentName)
provides an assessment, grading from 1-6, of tempo in a score, with instrument specification