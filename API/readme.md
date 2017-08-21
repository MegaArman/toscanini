# API
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
