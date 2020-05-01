export default (req, res, next) => {
	if (req.user.admin.accessLevel === 3) return next();
	return res.json({
		status: false,
		data: "You do not have permission to perform this operation.",
	});
};
