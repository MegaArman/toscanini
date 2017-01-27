#API

### Setup
1) Clone/download

2) Use npm install to get dependencies listed in package.json

### Sample Execution 
 node jsfileyouwanttorun
 
### Run Unit Tests
 npm test
 
### Linting 
 http://eslint.org/docs/user-guide/getting-started


## ScoreSearcher.js
Is responsible for the analysis of the score.

###getMaxPitch()
gets the max pitch in the entire score

###getMinPitch()
gets the min pitch in the entire score

###getMaxPitchOf(instrumentName)
gets the max pitch of a certain instrument

###getMinPitchOf(instrumentName)
get the min pitch of a certain instrument

###getKeySignatures()
gets the key signatures of the whole piece (returns an array)

###getInstrumentObjects()
gets all data specific to certain instruments in the score. Can be used with with Object.keys() to get the instrument names
  
###getInstrumentsWithMelody(melodyString)
returns array of instruments who have a melody. NOTE: may not work for instruments playing chords

###getTempos()
returns an array containing all tempos in the score

## Notate.js
This class contains a set of utility functions independent of any score in question

### midiNumToNote(midiNoteNum)
Conevrts a midi note number to an actual pitch + octave such as C4

## Tooling

A working stack for all things this repo as of 1/27/17:

-OS: CentOS 7 (highly suggested if you want to work on backend)

-JS runtime environment (and more): Node v6.9.4

-Text editor (least important, but suggested): Atom (https://github.com/atom/atom- you may need to run 'yum install libXScrnSaver' before you run it for the first time) and install packages linter and linter-eslint (these are for syntax/style  checking)

