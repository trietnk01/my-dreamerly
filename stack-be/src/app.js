var http = require("http");
require("dotenv").config();
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
require("module-alias/register");
const { Server } = require("socket.io");
var port = process.env.NODE_ENV === "development" ? process.env.PORT : 8000;
global.__IMAGES = path.join(__dirname, "public/images");
global.__DOCUMENTS = path.join(__dirname, "public/documents");
var app = express();
var serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
	cors: { origin: "*" }
});

app.use("/", express.static("src/public"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
var apiRoute = require("@routes/api")(io);
app.use("/api", apiRoute);
app.set("port", port);

serverHttp.listen(port);
