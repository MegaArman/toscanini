var fs = require('fs');
var path = require('path');
var hrstart = process.hrtime();
var xml2js = require('xml2js');

function xmlFileToJs(filename, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
    });
}

function jsToXmlFile(filename, obj, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.writeFile(filepath, xml, cb);
}

xmlFileToJs('../scores/vivaldi_winter.xml', function (err, obj) {
  if (err) throw (err);
  jsToXmlFile('theme2.xml', obj, function (err) {
    if (err) console.log("error !!!" + err);
    var hrend = process.hrtime(hrstart);
    console.log("Execution time (hr): ", hrend[0], hrend[1]/1000000);
     //takes 4.3 seconds-without write it takes 3.3-3.5...sax->JS object is heavy
  })
});
