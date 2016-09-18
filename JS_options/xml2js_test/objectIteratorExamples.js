//METHOD 1 for iterating over an entire object:
//your object
// var o = {
//     foo:"bar",
//     arr:[1,2,3],
//     subo: {
//         foo2:"bar2"
//     }
// };
//
// //called with every property and it's value
// function process(key,value) {
//     console.log(key + " : "+value);
// }
//
// function traverse(o,func) {
//     for (var i in o) {
//         func.apply(this,[i,o[i]]);
//         if (o[i] !== null && typeof(o[i])=="object") {
//             //going on step down in the object tree!!
//             traverse(o[i],func);
//         }
//     }
// }
//
// //that's all... no magic, no bloated framework
// traverse(o,process);
//=====================================================
// METHOD 2:
// var validation_messages = {
//     "key_1": {
//     	"your_name": "jimmy",
//     	"your_msg": "hello world"
//     },
//     "key_2": {
//     	"your_name": "billy",
//     	"your_msg": "foo equals bar"
//     }
// };
//
// for (var key in validation_messages) {
//     // skip loop if the property is from prototype
//     if (!validation_messages.hasOwnProperty(key)) continue;
//
//     var obj = validation_messages[key];
//     for (var prop in obj) {
//         // skip loop if the property is from prototype
//         if(!obj.hasOwnProperty(prop)) continue;
//
//         // your code
//         console.log(prop + " = " + obj[prop]);
//     }
// }

var exports = module.exports = {};

exports.findHighestPitch = function(musicObject) {
  // var validation_messages = {
  //     "key_1": {
  //     	"your_name": "jimmy",
  //     	"your_msg": "hello world",
  //       'pitch' : 'C'
  //     },
  //     "key_2": {
  //     	"your_name": "billy",
  //     	"your_msg": "foo equals bar",
  //       "pitch": "G"
  //     }
  // };

  for (var key in validation_messages) {
      // skip loop if the property is from prototype
      if (!validation_messages.hasOwnProperty(key)) continue;

      var obj = validation_messages[key];
      for (var prop in obj) {
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
};

//tests:
exports.findHighestPitch();
