var express = require("express");
var cors = require("cors");
var app = express();
var admin = require("firebase-admin");
require("dotenv").config();
var bodyParser = require("body-parser");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

admin.initializeApp({
    credential: admin.credential.cert({
        project_id: "eezynapp",
        private_key_id: process.env.private_key_id,
        clientEmail: process.env.client_email,
        privateKey: process.env.private_key?.replace(/\\n/g, '\n'),
        // privateKey: process.env.private_key,
    }),
});
// console.log(`Admin name ${ad.name}`);

var corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.get("/", cors(corsOptions), function (req, res, next) {
    res.send("Server is running");
});


app.post(
    "/send-notification",
    cors(corsOptions),
    async function (req, res, next) {
        const { body } = req;
        const deviceToken = req.body.deviceToken;
        const senderName = req.body.senderName;
        const messageContent = req.body.messageContent;
        console.log(`Device Token ${deviceToken}`);
        console.log(`Sender Name ${senderName}`);
        console.log(`Message Content ${messageContent}`);

        await admin
            .messaging()
            .sendMulticast({
                tokens: [deviceToken],
                notification:
                {
                    title: senderName,
                    body: messageContent,
                },
                data: {
                    
                },
            }).catch((error) => {
                console.log(`Error Heree ${error}`);
                return res.status(500).json({
                    success: false,
                    message: "error",
                    error,
                });
            }).then(() => {
                console.log(`Done Succesfully`);
                res.status(200).json({
                    confirm: "new project",
                    "deviceToken ": `${deviceToken}`,
                });
            });
    }
);

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    console.log(`Click on link to see http://localhost:${port}`);
});