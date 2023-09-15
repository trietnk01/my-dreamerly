var express = require("express");
var router = express.Router();
module.exports = io => {
	router.use("/chat", require("./chat")(io));
	router.use("/users", require("./users"));
	return router;
};
