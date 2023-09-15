const query = require("@helpers/get-mysql-query");
module.exports = {
	create: item => {
		let colData = [];
		let questionData = [];
		let params = [];
		if (item.user_id) {
			colData.push("user_id");
			params.push(item.user_id);
			questionData.push("?");
		}
		if (item.content) {
			colData.push("content");
			params.push(item.content);
			questionData.push("?");
		}
		if (item.created_at) {
			colData.push("created_at");
			params.push(item.created_at);
			questionData.push("?");
		}
		const colTxt = colData.join(",");
		const questionTxt = questionData.join(",");
		const sql = "insert into chat (" + colTxt + ") values (" + questionTxt + ")";
		return query(sql, params);
	}
};
