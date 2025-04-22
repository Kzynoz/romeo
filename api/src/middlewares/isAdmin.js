export default (req, res, next) => {
	// Check if the user is authenticated
	if (!req.user) {
		return res.status(401).json({ error: "Utilisateur non authentifié." });
	}

	// If the user is an admin, allow access to the next middleware or route handler
	if (req.user.is_admin) {
		return next();
	}
	
	// If the user is not an admin, return a 403 Forbidden response
	res.status(403).json({ error: "Accès refusé: rôle insuffisant." });
	return;
};
