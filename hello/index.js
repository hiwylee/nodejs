var server = require("http")

server.createServer(function (req, res) {
    res.writeHead(200, {
        'Context-Type' : 'text/plain'
    });
    res.end("Hello node.js")
}).listen(3000);

console.log("Server is listening on port 3000");