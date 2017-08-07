const http = require("http");
const fs = require("fs");
const port = 7999;

function send404Response(response)
{
  response.writeHead(404,{"Content-Type": "text/plain"});
  response.write("Error 404: Page not found");
  response.end();
}

function onRequest(request, response)
{
  if (request.method === "GET")
  {
    if (request.url === "/")
    {
      response.writeHead(200, {"Content-Type": "text/html"});
      fs.createReadStream("./index.html").pipe(response);
    }
    else if (request.url === "/styles.css")
    {
      response.writeHead(200, {"Content-Type": "text/css"});
      fs.createReadStream("./styles.css").pipe(response);
    }
    else if (request.url === "/materialize.css")
    {
      response.writeHead(200, {"Content-Type": "text/css"});
      fs.createReadStream("./materialize.css").pipe(response);
    }
    else if (request.url === "/bundle.js")
    {
      response.writeHead(200, {"Content-Type": "text/javascript"});
      fs.createReadStream("./bundle.js").pipe(response);
    }
    else
    {
      send404Response(response);
    }
  }
  else
  {
    console.log("bad request, will send 404");
    send404Response(response);
  }
}

const server = http.createServer(onRequest);

// Listen on port, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:" + port + "/");
