//suggest Google Chrome======================
alert("NOTE: This app has only been tested with Google Chrome");

//===========================================

let xml2js = require("xml2js");
let Toscanini = require("./Toscanini.js");
let GradeLevel = require("./Toscanini.gradeLevel.js");
let parser = new xml2js.Parser({explicitArray: false});

let fileInput = document.getElementById("fileInput");
let xmlStrings;

fileInput.addEventListener("change", function()
{
  xmlStrings = {};
  let textType = /text.xml/;

  for (let file of fileInput.files)
  {
    if (file.type.match(textType))
    {
      let reader = new FileReader();

      reader.onload = function()
      {
        xmlStrings[file.name] = reader.result;
      };

      reader.readAsText(file);
    }
    else
    {
      alert("Are you sure these are all MusicXML files?");
    }
  }
});

//can I create a button for individual instruments and overall?
//currently doing overall

window.analyze = function()
{
  for (let fileName in xmlStrings)
  {
    console.log(xmlStrings[fileName]);
    parser.parseString(xmlStrings[fileName], function (err, result)
    {
      const gradeLevel = new GradeLevel(result);

      const articulations = gradeLevel.assessArticulations();
      const dynamics = gradeLevel.assessDynamics();
      const meter = gradeLevel.assessMeter();
      const rhythmicComplexity = gradeLevel.assessRhythmicComplexity();
      const tempo = gradeLevel.assessTempo();
      const overallScore = (articulations + dynamics + meter
        + rhythmicComplexity + tempo) / 5;

      $("#results").
      append("<tr>" +
      "<td>" + fileName + "</td>" +
      "<td>" + "articulations: " + articulations +"</td>" +
      "<td>" + "dynamics: " + dynamics + "</td>" +
      "<td>" + "meter: " + meter + "</td>" +
      "<td>" + "rhythmic complexity: " + rhythmicComplexity + "</td>" +
      "<td>" + "tempo: " + tempo + "</td>" +
      "<td>" + "overall grade: " + overallScore + "</td>" +
      "</tr>");
    });
  }
};

window.clear = function()
{
  $("#results").empty();
};

$("#analyze").on("click", window.analyze);
$("#clear").on("click", window.clear);
