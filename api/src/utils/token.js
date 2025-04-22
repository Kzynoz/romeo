import jwt from "jsonwebtoken";

// Secret key for signing the JWT, sourced from environment variables
const SECRET = process.env.JWT_SECRET;

/**
 * Generates a JSON Web Token (JWT) based on the user details
 * 
 * @param {number} id - The user's ID
 * @parem {string} alias - An optional alias for the user
 * @param {number} is_admin - Indicates if the user is an admin (1 for admin, 0 for for non)
 * @param {string} title - The user's title ("m.", "mme")
 * @param {lasname} lastname - The user's lastname
 * 
 * @returns - The generetaed JWT
 */
export default ({
	id,
	alias = null,
	is_admin = null,
	title = null,
	lastname = null,
}) => {
	// Define the payload of the JWT with user information
	const PAYLOAD = {
		id,
		// If alias is not provided, fallback to concatenating title and lastname
		alias: alias || `${title} ${lastname}`,
		is_admin,
		// Role is determined by the value of is_admin
		role: is_admin === 1 ? "practitioner" : "guardian",
	};

	// Set the expiration for the token (1 day)
	const OPTIONS = {
		expiresIn: "1d",
	};

	return jwt.sign(PAYLOAD, SECRET, OPTIONS);
};
