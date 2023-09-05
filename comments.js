// Create web server
// Run: node comments.js
// Test: curl -d "user=John&comment=Hello" http://localhost:3000/comments
// Test: curl http://localhost:3000/comments

var http = require('http');
var items = [];

var server = http.createServer(function(req, res){
    if ('/' == req.url) {
        switch (req.method) {
            case 'GET':
                show(res);
                break;
            case 'POST':
                add(req, res);
                break;
            default:
                badRequest(res);
        }
    } else {
        notFound(res);
    }
});

server.listen(3000);

function show(res) {
    var html = '<html><head><title>Comments</title></head><body>'
             + '<h1>Comments</h1>'
             + '<ul>'
             + items.map(function(item) {
                 return '<li>' + item + '</li>'
               }).join('')
             + '</ul>'
             + '<form method="post" action="/">'
             + '<p><input type="text" name="user" placeholder="User" /></p>'
             + '<p><textarea name="comment" placeholder="Comment"></textarea></p>'
             + '<p><input type="submit" value="Submit" /></p>'
             + '</form></body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

var qs = require('querystring');

function add(req, res) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        body += chunk;
    });
    req.on('end', function(){
        var obj = qs.parse(body);
        items.push(obj.user + ': ' + obj.comment);
        show(res);
    });
}

function badRequest(res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad Request');
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
}