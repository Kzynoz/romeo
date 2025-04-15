import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default ({
	id,
	alias = null,
	is_admin = null,
	title = null,
	lastname = null,
}) => {
	const PAYLOAD = {
		id,
		alias: alias || `${title} ${lastname}`,
		is_admin,
		role: is_admin === 1 ? "practitioner" : "guardian",
	};

	console.log("is_admin", is_admin);

	const OPTIONS = {
		expiresIn: "1d",
	};

	return jwt.sign(PAYLOAD, SECRET, OPTIONS);
};
