const exec = require("child_process").exec;
const fs = require("fs");

const xmlScoresDir = "./scores/";
const pdfScoresDir = "./scores_pdf/";

const xmlPieceNames = fs.readdirSync(xmlScoresDir);
xmlPieceNames.forEach((xmlPieceName) =>
{
	let pdfName = xmlPieceName.replace(".xml", ".pdf");
	
	exec("musescore " + xmlScoresDir + xmlPieceName + " -o " + pdfScoresDir + pdfName,
		function (error, stdout, stderr)
		{
			//musescore may cause errors (segfaults) but may still produce the pdfs- just be aware...
			console.log("stdout: " + stdout);
			console.log("stderr: " + stderr);

			if (error !== null) 
			{
				console.log("exec error: " + error);
			}
		});
});

