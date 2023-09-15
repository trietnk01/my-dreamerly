var express = require("express");
var router = express.Router();
var ChatModel = require("@models/chat");
const getDateString = require("@helpers/get-date-string");
const chatRouter = io => {
	io.on("connection", socket => {
		socket.on("CLIENT_SEND_MESSAGE", data => {
			const dateNow = new Date();
			let created_at = getDateString(dateNow);
			const item = {
				user_id: data.user_id,
				content: data.content,
				created_at
			};
			ChatModel.create(item)
				.then(dataResult => {
					socket.emit("SERVER_SEND_MESSAGE", content);
				})
				.catch(() => {});
		});
		socket.on("disconnect", () => {
			console.log("User disconnected = ", socket.id);
		});
	});
	return router;
};
module.exports = chatRouter;
