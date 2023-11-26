var express = require("express");
var router = express.Router();
var _ = require("lodash");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");
const query = require("@helpers/get-mysql-query");
var ChatModel = require("@models/chat");
var checkAuthorization = require("@helpers/check-authorization");
const getDateString = require("@helpers/get-date-string");
const firebaseConfig = require("@helpers/firebase-config");
module.exports = io => {
	router.post("/push/notification", async (req, res) => {
		const valid = await checkAuthorization(req);
		if (valid) {
			const item = Object.assign({}, req.body);
			if (item.user_id) {
				const userId = parseInt(item.user_id);
				const sqlGetList = "select receiver_id , COUNT( seen) as count_seen        from chat   where receiver_id = ? and seen = 0 GROUP by receiver_id";
				query(sqlGetList, [userId], (errGetList, dataResult) => {
					if (dataResult) {						
						let countSeen = 0;
						if (dataResult.length > 0) {
							dataResult.forEach(item => {
								countSeen += parseInt(item.count_seen);
							});
						}
						if (countSeen > 0) {
							const firebaseApp = initializeApp(firebaseConfig);
							const database = getDatabase(firebaseApp);
							set(ref(database, `users/${userId}`), { count_seen: countSeen, is_pushed: 0 });
						}
						res.status(200).json({ status: true, count_seen: countSeen });
					} else {
						res.status(200).json({ status: false });
					}
				});
			}
		} else {
			res.status(200).json({ status: false, message: "Invalid token" });
		}
	});
	router.get("/get-date-lastest/:user_id", async (req, res) => {
		const valid = await checkAuthorization(req);
		if (valid) {
			const item = Object.assign({}, req.params);
			if (item.user_id) {
				const userId = parseInt(item.user_id);
				const sqlGetList = "select   id , receiver_id   , created_at       from chat    where receiver_id = ? and seen = 0  order by id DESC  limit 1";
				query(sqlGetList, [userId], (err, data) => {
					if (data) {
						res.status(200).json({ status: true, data });
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
