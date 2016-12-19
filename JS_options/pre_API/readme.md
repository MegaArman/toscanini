#pre_API 
Here I am creating a class which can search the JS object representation of a MusicXML score for meaningful info.
See the xml2js_test for info on how MusicXML is being represented as a JS object.

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

## Notate.js
This class contains a set of utility functions independent of any score in question

### midiNumToNote(midiNoteNum)
Conevrts a midi note number to an actual pitch + octave such as C4

