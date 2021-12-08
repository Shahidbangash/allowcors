var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
// var fetch = require("node-fetch");
// import fetch from 'node-fetch';
const fetch = import('node-fetch');
const blockedPhrases = new RegExp(/porn|sexy/);


var corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, variousSmartTVs) choke on 204
};

app.get("/", cors(corsOptions), function (req, res, next) {
    res.json({ msg: "This is CORS-enabled for Flutter Web" });
});
app.post("/proxy-request", cors(corsOptions), function (req, res, next) {

    let url = req.query.url;

    if (!url) {
        url = req.body.url;
    }
    if (!url) {
        res.status(403).send('URL is empty.');
    }
    console.log('Request:', url);
    // disallow blocked phrases
    if (url.match(blockedPhrases)) {
        res.status(403).send('Phrase in URL is disallowed.');
    }

    fetch(url, {
        method: req.method,
        body: req.get('content-type') === 'application/json' ? JSON.stringify(req.body) : req.body,
        headers: {
            'Content-Type': req.get('Content-Type'),
        },
    })
        .then(r => r.headers.get('content-type') === 'application/json' ? r.json() : r.text())
        .then(body => res.status(200).send(body));
});



var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    console.log(`Click on link to see http://localhost:${port}`);
});

