var express = require("express");
var jwt = require("jsonwebtoken");
var immer = require("immer");
var path = require("path");
const fs = require("fs");
var uploadImage = require("@helpers/upload-image");
const query = require("@helpers/get-mysql-query");
var checkAuthorization = require("@helpers/check-authorization");
var getDomain = require("@helpers/get-domain");
var UsersModel = require("@models/users");
var router = express.Router();
router.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const sqlLogin = "select id , email , display_name , avatar , lang , currency from users where email = ? and password = ?";
	query(sqlLogin, [email, password])
		.then(dataLogin => {
			let user = null;
			let status = true;
			let token = "";
			if (!dataLogin || dataLogin.length === 0) {
				status = false;
			}
			if (status === true) {
				user = dataLogin[0];
				/* begin set random string */
				const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				let randomTxt = "";
				const charactersLength = characters.length;
				for (let i = 0; i < 30; i++) {
					randomTxt += characters.charAt(Math.floor(Math.random() * charactersLength));
				}
				/* end set random string */
				token = jwt.sign({ id: user.id }, randomTxt, {
					expiresIn: "10h"
				});
				const sqlUpdated = "update users set remember_token = ? where id = ?";
				query(sqlUpdated, [token, user.id], (errUpdated, dataUpdated) => {
					if (parseInt(dataUpdated.affectedRows) > 0) {
						res.status(200).json({ status, user, token });
					}
				});
			} else {
				res.status(200).json({ status, process_env: process.env, dataLogin });
			}
		})
		.catch(err => {
			res.status(200).json({ status: false, process_env: process.env, err });
		});
});
router.post("/check-valid-token", (req, res) => {
	const token = req.body.token;
	const sqlCheckToken = "select id , email , display_name , avatar , lang , currency  from users where remember_token = ?";
	query(sqlCheckToken, [token], (errUpdated, dataResult) => {
		let status = true;
		let user = null;
		if (!dataResult || dataResult.length === 0) {
			status = false;
		}
		if (status === true) {
			user = dataResult[0];
		}
		res.status(200).json({ status, user });
	});
});
router.post("/logout", async (req, res) => {
	const valid = await checkAuthorization(req);
	if (valid) {
		const sqlUpdatedToken = "update users set remember_token = null";
		query(sqlUpdatedToken, (errUpdatedToken, dataResult) => {
			if (parseInt(dataResult.affectedRows) > 0) {
				res.status(200).json({ status: true });
			}
		});
	} else {
		res.status(200).json({ status: false, message: "Invalid token" });
	}
});
router.get("/list", async (req, res) => {
	const valid = await checkAuthorization(req);
	if (valid) {
		const sqlGetList = "select id , email , display_name , phone , avatar from users";
		query(sqlGetList, (errGetList, dataResult) => {
			if (dataResult) {
				res.status(200).json({ status: true, items: dataResult });
			} else {
				res.status(200).json({ status: false });
			}
		});
	} else {
		res.status(200).json({ status: false, message: "Invalid token" });
	}
});
router.get("/chat-box-list/:user_id", async (req, res) => {
	const valid = await checkAuthorization(req);
	if (valid) {
		const item = Object.assign({}, req.params);
		const userId = item.user_id ? parseInt(item.user_id) : 0;
		const sqlGetList = "select id , email , display_name , phone , avatar from users where id != ?";
		query(sqlGetList, [userId], (errGetList, dataResult) => {
			if (dataResult) {
				res.status(200).json({ status: true, items: dataResult });
			} else {
				res.status(200).json({ status: false });
			}
		});
	} else {
		res.status(200).json({ status: false, message: "Invalid token" });
	}
});
router.get("/show/:id", async (req, res) => {
	const valid = await checkAuthorization(req);
	if (valid) {
		const item = Object.assign({}, req.params);
		const id = item.id ? parseInt(item.id) : 0;
		const sql = "SELECT id , email , display_name , phone , avatar  FROM users WHERE id = ?";
		query(sql, [id], (err, dataResult) => {
			if (dataResult && dataResult.length > 0) {
				res.status(200).json({ status: true, item: dataResult[0] });
			} else {
				res.status(200).json({ status: false });
			}
		});
	} else {
		res.status(200).json({ status: false, message: "Invalid token" });
	}
});
router.post("/create", uploadImage.single("avatar"), (req, res) => {
	let item = Object.assign({}, req.body);
	if (req.file && req.file.originalname) {
		item.avatar = req.file.originalname;
	}
	UsersModel.create(item)
		.then(dataResult => {
			if (parseInt(dataResult.affectedRows) > 0) {
				res.status(200).json({ status: true, insert_id: dataResult.insertId });
			} else {
				res.status(200).json({ status: false });
			}
		})
		.catch(() => {
			res.status(200).json({ status: false });
		});
});
router.put("/update/:id", uploadImage.single("avatar"), async (req, res) => {
	const valid = await checkAuthorization(req);
	if (valid) {
		let item = Object.assign({}, req.body);
		if (req.params.id) {
			item.id = parseInt(req.params.id);
		}
		if (req.file && req.file.originalname) {
			item.avatar = req.file.originalname;
		}
		const sql = "SELECT avatar FROM users WHERE id = ?";
		query(sql, [item.id])
			.then(dataSelected => {
				if (dataSelected && dataSelected.length > 0) {
					const oldAvatar = dataSelected[0].avatar ? dataSelected[0].avatar : null;
					UsersModel.update(item)
						.then(() => {
							if (req.body.removed_avatar && req.body.removed_avatar === "true" && oldAvatar) {
								const avatarPath = path.join(__IMAGES, oldAvatar);
								if (fs.existsSync(avatarPath)) {
									fs.unlink(avatarPath, err => {
										if (!err) {
											res.status(200).json({ status: true });
										} else {
											res.status(200).json({ status: false, message: "Remove avatar failure" });
										}
									});
								} else {
									res.status(200).json({ status: false, message: "File does not exists" });
								}
							} else {
								res.status(200).json({ status: true });
							}
						})
						.catch(() => {
							res.status(200).json({ status: false });
						});
				}
			})
			.catch(() => {
				res.status(200).json({ status: false, message: "User detail shows failure" });
			});
	} else {
		res.status(200).json({ status: false, message: "Invalid token" });
	}
});
router.delete("/delete/:id", async (req, res) => {
	const valid = await checkAuthorization(req);
	if (valid) {
		id = req.params.id ? parseInt(req.params.id) : 0;
		const sql = "delete from users where id = ?";
		query(sql, [id], (err, dataResult) => {
			if (dataResult.affectedRows) {
				res.status(200).json({ status: true });
			} else {
				res.status(200).json({ status: false });
			}
		});
	} else {
		res.status(200).json({ status: false, message: "Invalid token" });
	}
});
module.exports = router;
