#xml2js for music
This is a proof of concept directory:
I've used xml2js to convert a musicXML file to a JS object and then searched through the entire object for 'pitch' keys and outputted their values (see MusicObject.js)

### Setup
Use npm install to get dependencies listed in package.json

### Execution 
 node --use_strict MusicObject.js
 
 results in the following output: 
 
[ { step: [ 'C' ], octave: [ '4' ] } ]

[ { step: [ 'B' ], octave: [ '4' ] } ]

[ { step: [ 'G' ], octave: [ '5' ] } ]

Done
