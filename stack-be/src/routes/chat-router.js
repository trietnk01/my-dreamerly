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
				sender_id: parseInt(data.sender_id),
				receiver_id: parseInt(data.receiver_id),
				message: data.message,
				created_at
			};
			ChatModel.create(item)
				.then(dataResult => {
					socket.emit("SERVER_RETURN_MESSAGE", data.message);
				})
				.catch(err => {
					console.log("err = ", err);
				});
		});
		socket.on("disconnect", () => {
			console.log("User disconnected = ", socket.id);
		});
	});
	return router;
};
module.exports = chatRouter;
