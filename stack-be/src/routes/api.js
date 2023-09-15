var express = require("express");
var router = express.Router();
module.exports = io => {
	router.use("/chat-router", require("./chat-router")(io));
	router.use("/users", require("./users"));
	return router;
};
