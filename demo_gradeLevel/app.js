//suggest Google Chrome======================
alert("NOTE: This app has only been tested with Google Chrome");

//===========================================

let GradeLevel = require("./Toscanini.gradeLevel.js");
let fileInput = document.getElementById("fileInput");
let filesObj; //ex: {"basic.xml": "<xml string here..."}

fileInput.addEventListener("change", () =>
{
  filesObj = {};
  let textType = /text.xml/;

  // fileInput.files IS A MAP - NOT a normal object!!
  for (let file of fileInput.files)
  {
    if (file.type.match(textType))
    {
      let reader = new FileReader();

      reader.onload = function()
      {
        filesObj[file.name] = reader.result;
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
  //filesObj is like {"basic.xml": "<xml string here..."}
  //Object.keys(filesObj) -> basic.xml

  //Iterate over the keys (file names) of filesObj:
  Object.keys(filesObj).forEach((fileName) =>
  {
      //filesObj.fileName -> "<xml..."
      const gradeLevel = GradeLevel(filesObj[fileName]);

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
};

window.clear = function()
{
  $("#results").empty();
};

$("#analyze").on("click", window.analyze);
$("#clear").on("click", window.clear);
