/*
var http = require('http');
var fs = require('fs');

var server = new http.Server(function (req, res) {
    console.log(req.method, req.url);

    if (req.url === "/news"){
        fs.readFile("tools/JSON/news.json",
            function (err, data) {

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                res.end(data);
            });
    } else if(req.url === "/register") {
        fs.writeFile("tools/JSON/users.json", req,
            function (err) {
                return console.log(err);
            });
        /!*req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);
        });*!/
    } else {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });
        res.write("Hello world\n");
        res.end();
    }

});

server.listen(8077, "127.0.0.1");*/

var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser= require('body-parser');
var fs = require('fs');

var app = express();

app.set('port', 8077);

app.use(express.static(path.normalize(__dirname + '/')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing       application/x-www-form-urlencoded
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return next();
});

app.get('/news', function(req, res) {
    fs.readFile("tools/JSON/news.json",
        function (err, data) {

            res.end(data);
        });
});

app.get('/reviews', function(req, res) {
    fs.readFile("tools/JSON/reviews.json",
        function (err, data) {

            res.end(data);
        });
});
app.get('/login', function(req, res) {
    fs.readFile("tools/JSON/users.json",
        function (err, data) {
            var obj = JSON.parse(data);
            for(var i = 0; i< obj['users'].length; i++) {
                var username = obj['users'][i].username;
                var password = obj['users'][i].password;

                var user = req.query;

                if(user.username == username && user.password == password){
                    res.end(JSON.stringify(obj['users'][i]));
                    break;
                }
            }
        });
});

app.post('/register', function(req, res) {
    fs.readFile("tools/JSON/users.json",
        function (err, data) {
            var obj = JSON.parse(data);
            obj['users'].push(req.body);
            fs.writeFile("tools/JSON/users.json", JSON.stringify(obj),
                function (err) {
                    return;
                });
            res.end(data);
        });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});