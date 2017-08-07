# API

# Table of contents
1. [Developer Stuff](#dev)
2. [Toscanini.Iterator](#iterator)
3. [Toscanini](#toscanini)
4. [Toscanini.gradeLevel](#gradeLevel)

## Developer Stuff <a name="dev"></a>
-OS: Should not matter. There's no binaries here.

-JS runtime environment (and more): Node v6.9.4

-Text editor: Any text editor that supports a plugin called "eslint". I've had success with Atom and Vim.

_Refer to .eslintrc.js in the parent directory to see what linter rules there are_
### Setup
1) Clone/download

2) Use npm install to get dependencies listed in package.json

### Sample Execution 
 node _jsfileyouwanttorun_
 
### Lint and Run Unit Tests 
 npm t
 
 This will run the linter before your unit tests...
 *If your code doesn't survive the linter, no tests will run.*

### Other
 package.json files may have scripts you can invoke via 'npm run _scriptname_'
 
### Parsing MusicXML
[musicxml documentation](https://usermanuals.musicxml.com/MusicXML/Content/XS-MusicXML.htm)

[musicxml parser documentation](https://github.com/racker/node-elementtree)

## Adding new query functions to Toscanini.js
consider this code from Toscanini.js:

    function traverse(musicObj,func)
    {
      for (let i in musicObj)
      {
        func.apply(this,[i, musicObj[i]]);

        if (musicObj[i] !== null && typeof(musicObj[i])==="object")
        {
          traverse(musicObj[i],func);
        }
      }
    }

    findValsByKey(targetKey)
    {
      function process(key,value) //called with every property and its value
      {
        if (key === targetKey) 
        { 
         console.log(value);
        }
      }

      traverse(this.musicObj, process);
    }
    
So essentially traverse(musicObj, func) is a function to traverse any JavaScript object which may contain other JavaScript objects and or arrays with unknown amount of nesting. Its first argument (musicObj) is for a JS object (typically the entire JS object for the score or an instrument) and second argument (func) is a callback function (which is invoked by func.apply(this,[i, musicObj[i]]); ). In this case findValsByKey calls traverse by giving it its process function as a call back. 

***The process function is essentially where all the magic happens- it is where you would write your code to process the music data. Its arguments (key, value) are passed from func.apply(this,[i, musicObj[i]]) in traverse...***

findValsByKey-->traverse-->findValsByKey's process function

try calling toscanini.findValsByKey('octave') to see all the octaves of a score

### Skeleton code
    getNewInfoAboutSomething(instrumentName)
    {
      //determine whether or not to check a specific instrument or the whole score
      let jsObj = instrumentName ? instrumentObjects[instrumentName] : musicObj;

      function process(key,value) //called with every property and its value
      {
        if (key === targetKey) 
        {
           //do stuff with value here...
        }
      }

      traverse(jsObj, process);
    }

## Toscanini.Iterator <a name="iterator"></a>
    const i = Iterator(musicXML); //create a Toscanini instance from musicXML
    
### selectInstrument(instrumentName)
The iterator is set to the first measure of the instrument part specified by instrumentName (ex: "Violin")

### nextMeasure()
The iterator moves to the first beat of the next measure

### prevMeasure()
The iterator moves to the first beat of the previous measure

### next()
The iterator moves to the next symbol be it a note or rest and returns an object to represent that symbol, ex:
{ beat: 3, duration: 2, note: "G5" }
Tells us the next note is a G5 playing on beat 3

### hasNext()
Returns true or false depending on whether or not there is a next symbol. 
Use this to avoid an exception being thrown.

### prev()
The iterator moves to the previous symbol be it a note or rest and returns an object to represent that symbol

### hasPrev()
Returns true or false depending on whether or not there is a previous symbol.
Use this to avoid an exception being thrown.

## Toscanini <a name="toscanini"></a>
    const toscanini = Toscanini(musicXML); //create a Toscanini instance from musicXML

Currently supports the following queries:

### getValsByTagName(tagName)
Returns all the values matching an xml tag name as an array, ex: toscanini.getValsByTagName("octave") => ["4", "4", "5"]. Mainly useful for testing to see what's in a score.

### getPitchRange(instrumentName)
Returns an object like {"minPitch": 30, "maxPitch": 72"} 

if no instrumentName is provided (ex: "flute"), gets the min and max pitches of the entire score.

### getKeySignatures(instrumentName)
gets the key signatures of the whole piece (returns an array) or for a particular instrument

### getInstrumentNames()
gets the name of the instruments in the score (returns as an array)
  
### getInstrumentsWithMelody(melodyString)
returns array of instruments who have a melody. NOTE: may not work for instruments playing chords

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

score result example: ["half 1", "quarter 0", "quarter 1", "eighth 0", "whole 0"];

### getNumberOfMeasures
returns the number of measures in a score.

## Toscanini.gradeLevel <a name="gradeLevel"></a>

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
