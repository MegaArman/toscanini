//
//
// //BROWSERIFY TEST
// var exports = module.exports = {};
//
// exports.helloWorld = function() {
//   console.log('Hello World!');
// };
// //=============================================
//
// //PROOF OF CONCEPT xml2js
// // var parseString = require('xml2js').parseString;
// // var xml = "<root>Hello xml2js!</root>";
// // parseString(xml, function (err, result) {
// //     console.dir(result);
// // });
//
// //-------------------------------------------
// var fs = require('fs'),
//     xml2js = require('xml2js');
//
// var parser = new xml2js.Parser();
//
// var basicXML = '';
// var xmljson ={};
//
// fs.readFile('./super_basic.xml', function(err, data) {
//     parser.parseString(data, function (err, result) {
//         // console.dir(result); //not full depth
//         // console.log('Done');
//          xmljson = result;
//          console.log('xmljson is ' + xmljson);
//
//
//
//         // basicXML = JSON.stringify(result);
//         // console.log(basicXML); //the whole thing as a string
//
//     });
// });
//
// //GET PITCHES...
// //Use underscorejs to get values for the name key...
//
// //from stackoverflow example:
// // var _=require("underscore");
// // var data = [{name: 'dan', value: 40}, {name: 'ryan', value: 50}];
// // var getKeys = _.pluck(data, 'name');
// // console.log(getKeys);
// // => ["dan", "ryan"]
//
// //attempt to get pitches:
// // console.log('xmljson is ' + xmljson);
// // var _=require("underscore");
// // var pitches = _.pluck(xmljson, 'pitch');
// // console.log('the pitches are \n' + pitches);
//
// Object.keys(xmljson).forEach(function(key, idx) {
// if (key == 'step')
// 	console.log(key + ": " + obj[key]);
// });

//MusicObject===========================
//The purpose of this class is to find basic information about music scores

class MusicObject {
  constructor(musicObj)  {
    this.musicObj = musicObj;
  }

  findHighestPitch()
  {
    for (var key in this.musicObj)
    {
        // skip loop if the property is from prototype
        if (!this.musicObj.hasOwnProperty(key)) continue;

        var obj = this.musicObj[key];
        for (var prop in obj)
        {
            // skip loop if the property is from prototype
            if(!obj.hasOwnProperty(prop)) continue;

            // your code
            if (prop == 'pitch') //if they kis pitch
            {
              console.log(obj.pitch); //outuput the pitch value
            }
            // console.log(prop + " = " + obj[prop]);
        }
    }
  }
}

const sample =
{
  "key_1":
  {
  	"your_name": "jimmy",
  	"your_msg": "hello world",
    'pitch' : 'C'
  },
  "key_2":
  {
  	"your_name": "billy",
  	"your_msg": "foo equals bar",
    "pitch": "G"
  }
};

const mozartSymphony= new MusicObject(sample);
mozartSymphony.findHighestPitch();
