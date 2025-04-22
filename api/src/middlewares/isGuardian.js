export default (req, res, next) => {
	// Check if the user is a 'guardian' and assign the guardian_id from the query params if true
	req.guardian_id =
		req.user?.role === "guardian" ? req.query.guardian_id : null;

	// Call the next middleware or route handler
	next();
};
