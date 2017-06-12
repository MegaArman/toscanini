# API

## Tooling

Last updated 1/27/17:

-OS: CentOS 7 (recommended)

-JS runtime environment (and more): Node v6.9.4

-Text editor: Any text editor that supports a plugin called "eslint". I've had success with Atom and Vim.

_Refer to .eslintrc.js in the parent directory to see what linter rules there are_
## Setup
1) Clone/download

2) Use npm install to get dependencies listed in package.json

## Sample Execution 
 node _jsfileyouwanttorun_
 
### Lint and Run Unit Tests 
 npm t
 
 This will run the linter before your unit tests...
 *If your code doesn't survive the linter, no tests will run.*

### Other
 package.json files may have scripts you can invoke via 'npm run _scriptname_'
 
## Toscanini.js
const toscanini = Toscanini(musicXML); //create a Toscanini instance from musicXML

Currently supports the following queries:

### getValsByTagName(tagName)
Returns all the values matching an xml tag name as an array, ex: toscanini.getValsByTagName("octave") => ["4", "4", "5"]. Mainly useful for testing to see what's in a score.

### getPitchRange(instrumentName)
Returns an object like {"minPitch": 30, "maxPitch": 72"} 

if no instrumentName is provided (ex: "flute"), gets the min and max pitches of the entire score.

### getKeySignatures()
gets the key signatures of the whole piece (returns an array)

### getInstrumentNames()
gets the name of the instruments in the score (returns as an array)
  
### getInstrumentsWithMelody(melodyString)
returns array of instruments who have a melody. NOTE: may not work for instruments playing chords

### getTempos()
returns an array containing all tempos in the score

### getTimeSignatures()
returns a matrix like so [[4,4], [9,8]] for time signatures 4/4 and 9/8

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
