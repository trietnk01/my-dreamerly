const query = require("@helpers/get-mysql-query");
const checkAuthorization = async req => {
	let valid = true;
	const bearerHeader = req.headers["authorization"];
	if (!bearerHeader) {
		valid = false;
	}
	if (valid) {
		const bearerData = bearerHeader.split(" ");
		const bearerTxt = bearerData[0];
		const token = bearerData[1];
		const sql = "select id from users where remember_token = ?";
		const res = await query(sql, [token]);
		if (!res || res.length === 0 || bearerTxt !== "Bearer") {
			valid = false;
		}
	}
	return valid;
};
module.exports = checkAuthorization;
