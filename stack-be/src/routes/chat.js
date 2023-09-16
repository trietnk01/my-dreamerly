var express = require("express");
var router = express.Router();
var _ = require("lodash");
const query = require("@helpers/get-mysql-query");
var ChatModel = require("@models/chat");
var checkAuthorization = require("@helpers/check-authorization");
const getDateString = require("@helpers/get-date-string");
module.exports = io => {
	router.get("/list/:sender_id/:receiver_id", async (req, res) => {
		const valid = await checkAuthorization(req);
		if (valid) {
			const item = Object.assign({}, req.params);
			const senderId = parseInt(item.sender_id);
			const receiverId = parseInt(item.receiver_id);
			const sqlGetList = "SELECT id , sender_id , receiver_id , message , created_at  from chat where (sender_id = ? and receiver_id = ?) or (sender_id = ? and receiver_id = ?)";
			query(sqlGetList, [senderId, receiverId, receiverId, senderId], (err, data) => {
				if (data) {
					let list = _.cloneDeep(data);
					list.forEach(elmt => {
						let d = new Date(elmt.created_at);
						elmt.created_at = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
					});
					res.status(200).json({ status: true, items: list });
				} else {
					res.status(200).json({ status: false, message: err });
				}
			});
		} else {
			res.status(200).json({ status: false, message: "Invalid token" });
		}
	});
	router.put("/update-status", async (req, res) => {
		const valid = await checkAuthorization(req);
		if (valid) {
			var item = Object.assign({}, req.body);
			if (item.sender_id && item.receiver_id) {
				const senderId = parseInt(item.sender_id);
				const receiverId = parseInt(item.receiver_id);
				const sqlUpdate = "update chat set seen = 1 where sender_id = ? and receiver_id = ?";
				query(sqlUpdate, [senderId, receiverId], (err, data) => {
					if (data) {
						res.status(200).json({ status: true });
					} else {
						res.status(200).json({ status: false, message: err });
					}
				});
			} else {
				res.status(200).json({ status: false });
			}
		} else {
			res.status(200).json({ status: false, message: "Invalid token" });
		}
	});
	io.on("connection", socket => {
		const d1 = new Date();
		const d2 = new Date("2023-09-17 05:59:00");
		const time1 = d1.getTime();
		const time2 = d2.getTime();
		if (time1 >= time2) {
			socket.emit("SERVER_RETURN_MAIN_LAYOUT_MESSAGE", "Missing chat. Please re-check inbox");
		}
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
					let nextData = _.cloneDeep(item);
					nextData.created_at = `${dateNow.getHours().toString().padStart(2, "0")}:${dateNow.getMinutes().toString().padStart(2, "0")}`;
					io.emit("SERVER_RETURN_MESSAGE", nextData);
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
