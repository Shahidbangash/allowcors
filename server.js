var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");


var corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, variousSmartTVs) choke on 204
};

app.get("/", cors(corsOptions), function (req, res, next) {
    res.json({ msg: "This is CORS-enabled for only ears app." });
});
app.post("/", cors(corsOptions), function (req, res, next) {
    res.json({ msg: "This is CORS-enabled for only ears app." });
});

