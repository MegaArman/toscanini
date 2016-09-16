import {parseScore, serializeScore} as MusicXML from 'musicxml-interfaces';
import 'whatwg-fetch';

fetch('/sonata.xml')
  .then(function(response) {
    return response.text()
  }).then(function(xml) {
    let document = parseScore(score);
    console.log('Converted XML to ', doc);

    let xml = serializeScore(doc);
    console.log('Converted JavaScript document to ', xml);
  });
