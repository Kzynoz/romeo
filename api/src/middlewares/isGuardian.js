export default (req, res, next) => {
	
	req.guardian_id =
		req.user?.role === "guardian" ? req.query.guardian_id : null;

	next();
	return;
};
