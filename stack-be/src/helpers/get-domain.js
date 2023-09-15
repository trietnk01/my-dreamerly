const getDomain = req => {
	const protocol = req.protocol;
	const host = req.get("host");
	const domainName = `${protocol}://localhost:${process.env.PORT}`;
	return domainName;
};
module.exports = getDomain;
