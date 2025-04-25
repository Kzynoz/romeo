import { compare, hash } from "bcrypt";
import { validationResult } from "express-validator";
import pool from "../config/db.js";

import Guardian from "../models/guardian.model.js"
import Practitioner from "../models/practitioner.model.js";
import createToken from "../utils/token.js";

const SALT = 10;

// Register a new practitioner
// (not implemented yet in front, V2)
const register = async (req, res, next) => {
	const { alias, email, password } = req.body;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	try {
		// Hash password with bcrypt
		const hashedPassword = await hash(password, SALT);
		const [response] = await Practitioner.createPractitioner({
			alias,
			email,
			password: hashedPassword,
		});

		if (response.insertId) {
			return res.status(201).json({
				message: "L'utilisateur a été ajouté.",
			});
		}
	} catch (error) {
		next(error);
	}
};

// Login for practitioner
const login = async (req, res, next) => {
	const { email, password } = req.body;
	const errors = validationResult(req);

	// Check if there are validation errors from the request body
	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	try {
		const [[response]] = await Practitioner.findPractitioner(email);

		if (response) {
			const comparedPassword = await compare(password, response.password);

			if (comparedPassword) {
				// Create a security TOken with JWT
				const TOKEN = createToken(response);
				
				// Send the cookie
				res.cookie("jwt", TOKEN, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production", // Use HTTPS in production
					//sameSite: "none",
					maxAge: 86400000,
				});

				return res.json({
					message: "L'utilisateur est connecté.",
					user: {
						id: response.id,
						alias: response.alias,
						is_admin: response.is_admin,
						role: "practitioner",
					},
				});
			}
		}

		res.status(400).json({
			message: "Email ou mot de passe incorrect.",
		});
	} catch (error) {
		next(error);
	}
};

// Logout 
const logout = async (req, res, next) => {
	res.clearCookie("jwt", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		//sameSite: "none", Use for online
	});
	res.json({ message: "L'utilisateur a été deconnecté." });
};

// Refresh Login 
const refreshLogin = async (req, res, next) => {
	res.json({
		message: "L'utilisateur est bien connecté.",
		user: {
			id: req.user.id,
			alias: req.user.alias,
			is_admin: req.user.is_admin,
			role: req.user.role,
		},
	});
};


// Guardian registration 
// (not implented yet in front, V2)
const guardianRegister = async (req, res, next) => {
	const { tokenUrl } = req.params;
	const { email, password } = req.body;
	const errors = validationResult(req);
	let connection = null;

	// Check if there are validation errors from the request body
	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	try {
		// Check if the guardian exists with the provided email and tokenUrl
		const [[findGuardian]] = await Guardian.findGuardianByEmail(email, tokenUrl);

		// If guardian and token are found
		if (findGuardian && findGuardian.token) {
			
			const { id, token } = findGuardian;
			const hashedPassword = await hash(password, SALT);

			// Start a database transaction
			connection = await pool.getConnection();
			await connection.beginTransaction();

			const [response] = await Guardian.registerGuardian(connection, {
				id,
				token,
				password: hashedPassword,
			});

			// If the guardian was successfully registered
			if (response.affectedRows === 1) {
				// Then delete the associated token so he couldn't registred twice
				const [deleteToken] = await Guardian.deleteToken(connection, { id, token });

				if (deleteToken.affectedRows === 1) {
					await connection.commit();
					return res
						.status(201)
						.json({ message: "L'utilisateur a été ajouté" });
				}
			}
		}

		// If registration failed, rollback the transaction
		if (connection) await connection.rollback();
		return res.status(400).json({
			message: "Token ou email invalide.",
		});
	} catch (error) {
		if (connection) await connection.rollback();
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

// Guardian login
const guardianLogin = async (req, res, next) => {
	const { email, password } = req.body;
	const errors = validationResult(req);

	// Check if there are validation errors from the request body
	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}
	
	try {
		const [[response]] = await Guardian.findGuardianByEmail(email);

		if (response) {
			const comparedPassword = await compare(password, response.password);

			if (comparedPassword) {
				const TOKEN = createToken(response);

				res.cookie("jwt", TOKEN, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					// sameSite: "none",
					maxAge: 86400000,
				});

				return res.json({
					message: "L'utilisateur est connecté.",
					user: {
						id: response.id,
						alias: `${response.title} ${response.lastname}`,
						is_admin: false,
						role: "guardian",
					},
				});
			}
		}

		res.status(400).json({
			message: "Email ou mot de passe incorrect.",
		});
	} catch (error) {
		next(error);
	}
};

export {
	register,
	login,
	logout,
	refreshLogin,
	guardianRegister,
	guardianLogin,
};
