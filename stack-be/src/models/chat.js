const query = require("@helpers/get-mysql-query");
module.exports = {
	create: item => {
		let colData = [];
		let questionData = [];
		let params = [];
		if (item.sender_id) {
			colData.push("sender_id");
			params.push(item.sender_id);
			questionData.push("?");
		}
		if (item.receiver_id) {
			colData.push("receiver_id");
			params.push(item.receiver_id);
			questionData.push("?");
		}
		if (item.message) {
			colData.push("message");
			params.push(item.message);
			questionData.push("?");
		}
		colData.push("seen");
		params.push(0);
		questionData.push("?");
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
