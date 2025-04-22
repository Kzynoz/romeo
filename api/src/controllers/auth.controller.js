import { compare, hash } from "bcrypt";
import { validationResult } from "express-validator";
import pool from "../config/db.js";

import Customer from "../models/customer.model.js";
import Guardian from "../models/guardian.model.js"
import Practitioner from "../models/practitioner.model.js";
import createToken from "../utils/token.js";

const SALT = 10;

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

const login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const [[response]] = await Practitioner.findPractitioner(email);

		if (response) {
			const comparedPassword = await compare(password, response.password);

			if (comparedPassword) {
				const TOKEN = createToken(response);
				res.cookie("jwt", TOKEN, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production", // Utilise HTTPS en production
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

const logout = async (req, res, next) => {
	res.clearCookie("jwt", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		//sameSite: "none", en remettre à la mise en ligne
	});
	res.json({ message: "L'utilisateur a été deconnecté." });
};

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

const guardianRegister = async (req, res, next) => {
	const { tokenUrl } = req.params;
	const { email, password } = req.body;
	const errors = validationResult(req);
	let connection = null;

	console.log("toke", tokenUrl);
	console.log("email", req.body);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	try {
		const [[findGuardian]] = await Customer.findGuardianByEmail(email, tokenUrl);

		if (findGuardian && findGuardian.token) {
			const { id, token } = findGuardian;
			const hashedPassword = await hash(password, SALT);

			connection = await pool.getConnection();
			await connection.beginTransaction();

			const [response] = await Customer.registerGuardian(connection, {
				id,
				token,
				password: hashedPassword,
			});

			if (response.affectedRows) {
				const [deleteToken] = await Guardian.deleteToken(connection, { id, token });

				if (deleteToken.affectedRows) {
					await connection.commit();
					return res
						.status(201)
						.json({ message: "L'utilisateur a été ajouté" });
				}
			}
		}

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

const guardianLogin = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const [[response]] = await Customer.findGuardianByEmail(email);

		if (response) {
			const comparedPassword = await compare(password, response.password);

			if (comparedPassword) {
				const TOKEN = createToken(response);

				res.cookie("jwt", TOKEN, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production", // Utilise HTTPS en production
					// sameSite: "none", à changer à la mise en lgine
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
