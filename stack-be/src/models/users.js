const query = require("@helpers/get-mysql-query");
module.exports = {
	create: item => {
		let colData = [];
		let questionData = [];
		let params = [];
		if (item.email) {
			colData.push("email");
			params.push(item.email);
			questionData.push("?");
		}
		if (item.password) {
			colData.push("password");
			params.push(item.password);
			questionData.push("?");
		}
		if (item.display_name) {
			colData.push("display_name");
			params.push(item.display_name);
			questionData.push("?");
		}
		if (item.phone) {
			colData.push("phone");
			params.push(item.phone);
			questionData.push("?");
		}
		if (item.avatar) {
			colData.push("avatar");
			params.push(item.avatar);
			questionData.push("?");
		}
		if (item.lang) {
			colData.push("lang");
			params.push(item.lang);
			questionData.push("?");
		}
		if (item.currency) {
			colData.push("currency");
			params.push(item.currency);
			questionData.push("?");
		}
		const colTxt = colData.join(",");
		const questionTxt = questionData.join(",");
		const sql = "insert into users (" + colTxt + ") values (" + questionTxt + ")";
		return query(sql, params);
	},
	update: item => {
		let colData = [];
		let params = [];
		if (item.email) {
			colData.push("email = ?");
			params.push(item.email);
		}
		if (item.password) {
			colData.push("password = ?");
			params.push(item.password);
		}
		if (item.display_name) {
			colData.push("display_name = ?");
			params.push(item.display_name);
		}
		if (item.phone) {
			colData.push("phone = ?");
			params.push(item.phone);
		}
		if (item.avatar) {
			colData.push("avatar = ?");
			params.push(item.avatar);
		}
		if (item.removed_avatar && item.removed_avatar === "true") {
			colData.push("avatar = null");
		}
		if (item.lang) {
			colData.push("lang = ?");
			params.push(item.lang);
		}
		if (item.currency) {
			colData.push("currency = ?");
			params.push(item.currency);
		}
		params.push(item.id);
		const colTxt = colData.join(" , ");
		const sql = "update users set " + colTxt + " where id = ?";
		return query(sql, params);
	}
};
