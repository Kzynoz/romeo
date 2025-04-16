import { validationResult } from "express-validator";
import pool from "../config/db.js";
import Customer from "../models/customer.model.js";
import Guardian from "../models/guardian.model.js";
import crypto from "crypto";

const getAll = async (req, res, next) => {
	const offset = req.query.offset || "0";
	const limit = req.query.limit || "10";

	try {
		const [[count]] = await Guardian.countAll();

		if (count.total > 0) {
			const [response] = await Guardian.getAll({ offset, limit });

			if (response.length) {
				return res.status(200).json({
					message: "Tuteurs récupérés avec succès.",
					response,
					totalPages: Math.ceil(count.total / limit),
				});
			}
		}

		return res.status(400).json({
			message: "Aucun tuteurs récupérés.",
		});
	} catch (error) {
		next(error);
	}
};

const getOne = async (req, res, next) => {
	const { id } = req.params;
	const offset = req.query.offset || "0";
	const limit = req.query.limit || "10";

	try {
		const [[response]] = await Guardian.getOne({ id, offset, limit });

		if (!response) {
			res.status(400).json({
				message: "Le tuteur recherché n'a pas été trouvé.",
			});
			return;
		}

		res.status(200).json({
			message: "Tuteur trouvé avec succès.",
			response,
		});
	} catch (error) {
		next(error);
	}
};

const create = async (req, res, next) => {
	let connection = null;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const customer_detail = {
		title: req.body.title,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		phone: req.body.phone || null,
	};

	try {
		connection = await pool.getConnection();
		await connection.beginTransaction();

		const [[existingCustomer]] = await Customer.findCustomerGuardian(
			customer_detail
		);

		if (existingCustomer) {
			console.log(existingCustomer);
			res.status(400).json({ message: "Le tuteur existe déjà." });
			return;
		}

		const [customer] = await Customer.insert(customer_detail, connection);
		if (customer.insertId) {
			const token = crypto.randomBytes(32).toString("hex");

			const guardian = {
				relationship: req.body.relationship,
				email: req.body.email,
				company: req.body.company || null,
				street: req.body.street || null,
				zip_code: req.body.zip_code || null,
				city: req.body.city || null,
				customer_id: customer.insertId,
				token: token,
			};

			const [response] = await Guardian.insert(guardian, connection);
			if (response.insertId) {
				await connection.commit();
				res
					.status(200)
					.json({ message: "Le tuteur a été ajouté avec succès." });
				return;
			}
		}
		await connection.rollback();
	} catch (error) {
		if (connection) await connection.rollback();
		console.log(error);
		res.status(500).json({ message: "Erreur lors de l'ajout du tuteur." });
	} finally {
		if (connection) connection.release();
	}
};

const update = async (req, res, next) => {
	const errors = validationResult(req);
	const { id } = req.params;
	let connection = null;

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const customer_detail = {
		title: req.body.title,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		phone: req.body.phone || null,
	};

	try {
		connection = await pool.getConnection();
		await connection.beginTransaction();

		const [updatedCustomer] = await Customer.updateIsGuardian(
			customer_detail,
			id,
			connection
		);

		if (updatedCustomer.affectedRows) {
			const guardian = {
				relationship: req.body.relationship,
				email: req.body.email,
				company: req.body.company || null,
				street: req.body.street || null,
				zip_code: req.body.zip_code || null,
				city: req.body.city || null,
			};

			const [updatedGuardian] = await Guardian.update(guardian, id, connection);

			if (updatedGuardian.affectedRows) {
				await connection.commit();
				res.status(201).json({ message: "Le tuteur a été mise à jour." });
				return;
			}

			await connection.rollback();
			return res
				.status(500)
				.json({ message: "Erreur lors de l'ajout du tuteur." });
		}
	} catch (error) {
		if (connection) await connection.rollback();
		res.status(500).json({ message: "Erreur lors de l'ajout du tuteur." });
	} finally {
		if (connection) connection.release();
	}
};

const remove = async (req, res, next) => {
	const { id } = req.body;
	try {
		const [response] = await Customer.delete(id, 0);
		if (response.affectedRows) {
			res.json({ message: "Tuteur supprimé." });
			return;
		}
		res.status(400).json({
			message: "Ce tuteur n'existe pas.",
		});
	} catch (error) {
		next(error);
	}
};

const getBySearch = async (req, res, next) => {
	const { q = "" } = req.query;
	const formattedSearch = `%${q.trim()}%`;

	if (!q) {
		return res
			.status(400)
			.json({ message: "La recherche ne peut pas être vide." });
	}

	try {
		const [response] = await Customer.findBySearch(formattedSearch, 0);

		if (response.length) {
			res.status(200).json({ message: "Tuteur(s) trouvé(s).", response });
			return;
		}

		res.status(400).json({ message: "Aucuns tuteurs trouvés." });
		return;
	} catch (error) {
		next(error);
	}
};

export { getAll, getOne, create, update, remove, getBySearch };
