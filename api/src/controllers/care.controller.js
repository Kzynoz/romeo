import { validationResult } from "express-validator";
import Care from "../models/care.model.js";
import generateInvoicePDF from "../utils/generateInvoicePDF.js";
import pool from "../config/db.js";

const getAll = async (req, res, next) => {
	const offset = req.query.offset || "0";
	const limit = req.query.limit || "10";

	try {
		const [[count]] = await Care.countAll();

		if (count.total > 0) {
			const [response] = await Care.getAll(offset, limit);

			if (response.length) {
				return res.status(200).json({
					message: "Soins récupérés avec succès.",
					response,
					totalPages: Math.ceil(count.total / limit),
				});
			}
		}

		return res.status(400).json({
			message: "Aucun soins récupérés.",
		});
	} catch (error) {
		next(error);
	}
};

const getOneCare = async (req, res, next) => {
	const { patientId, id } = req.params;
	const guardian_id = req.guardian_id;

	console.log("guardian_id from Care", guardian_id);

	try {
		const [[response]] = await Care.getOne({ patientId, id, guardian_id });

		if (!response) {
			res.status(400).json({
				message: "Le soin n'a pas été trouvé.",
			});
			return;
		}

		res.status(200).json({
			message: "Soin trouvé avec succès.",
			response,
		});
	} catch (error) {
		next(error);
	}
};

const getBySearch = async (req, res, next) => {
	const { q = "" } = req.query;
	const formattedSearch = `%${q.trim()}%`;
	console.log(formattedSearch);

	try {
		const [response] = await Care.findBySearch(formattedSearch);

		if (response.length) {
			res.status(200).json({ message: "Soin(s) trouvé(s).", response });
			return;
		}

		res.status(400).json({ message: "Aucuns soins trouvés." });
		return;
	} catch (error) {
		next(error);
	}
};

/* const create = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const id = req.params.id || req.body.patient_id;
	const date = new Date(req.body.performed_at).toLocaleDateString("fr-CA");

	try {
		const [[existingCare]] = await Care.findCare(id, date);

		if (existingCare) {
			res.status(400).json({ message: "Ce soin pour ce patient existe déjà." });
			return;
		}

		const url = `facture-${existingCare.title}-${existingCare.firstname}-${existingCare.lastname}-${date}-${id}`;

		const newCare = {
			performed_at: date,
			practitioner_id: req.body.practitioner_id,
			type: req.body.type,
			complements: req.body.complements || null,
			price: req.body.price,
			invoice_generated: 1,
			invoice_paid: 0,
			invoice_send: 0,
			customer_id: id,
			invoice_url: url,
		};

		const [response] = await Care.insert(newCare, id);

		if (response.insertId) {
			const [[getInvoice]] = await Care.displayInvoice(response.insertId);

			if (getInvoice) {
				await generateInvoicePDF(getInvoice);

				return res.status(200).json({
					message: "Le soin a été ajouté avec succès.",
					response: getInvoice.invoice_url,
				});
			}
		}

		res.status(500).json({ message: "Erreur lors de l'ajout du soin." });
	} catch (error) {
		next(error);
	}
}; */

const create = async (req, res, next) => {
	let connection = null;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const id = req.params.id || req.body.patient_id;
	const date = new Date(req.body.performed_at).toLocaleDateString("fr-CA");

	try {
		const [[existingCare]] = await Care.findCare(id, date);

		if (existingCare) {
			res.status(400).json({ message: "Ce soin pour ce patient existe déjà." });
			return;
		}

		connection = await pool.getConnection();
		await connection.beginTransaction();

		const newCare = {
			performed_at: date,
			practitioner_id: req.body.practitioner_id,
			type: req.body.type,
			complements: req.body.complements || null,
			price: req.body.price,
			invoice_paid: 0,
			invoice_send: 0,
			customer_id: id,
		};

		const [response] = await Care.insert(newCare, id);

		if (response.insertId) {
			const [[getInvoice]] = await Care.displayInvoice(response.insertId);

			if (!getInvoice) {
				await connection.rollback();
				return res
					.status(500)
					.json({ message: "Erreur lors de l'ajout du soin." });
			}

			// sanitize
			const sanitze = (string) =>
				string
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.replace(/\s+/g, "-")
					.toLowerCase();

			const title = sanitze(getInvoice.title);
			const firstname = sanitze(getInvoice.firstname);
			const lastname = sanitze(getInvoice.lastname);

			const url = `${title}-${firstname}-${lastname}_${date}_${id}`;

			const [updateCare] = await Care.update({
				...newCare,
				id: response.insertId,
				invoice_url: url,
			});

			if (updateCare.affectedRows) {
				const pdf = await generateInvoicePDF({
					...getInvoice,
					invoice_url: url,
				});

				if (pdf) {
					await connection.commit();
					return res.status(200).json({
						message: "Le soin a été ajouté avec succès.",
						response: response.insertId,
					});
				}
			}
		}

		await connection.rollback();
		res.status(500).json({ message: "Erreur lors de l'ajout du soin." });
	} catch (error) {
		if (connection) await connection.rollback();
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

const update = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const careDate = new Date(req.body.performed_at).toLocaleDateString("fr-CA");

	const updatedCare = {
		performed_at: careDate,
		practitioner_id: req.body.practitioner_id,
		type: req.body.type,
		complements: req.body.complements || null,
		price: req.body.price,
		id: req.body.care_id,
		invoice_paid: req.body.invoice_paid,
		invoice_send: req.body.invoice_send,
	};

	try {
		const [response] = await Care.update(updatedCare);

		if (response.affectedRows) {
			const [[getInvoice]] = await Care.displayInvoice(response.insertId);

			const pdf = await generateInvoicePDF(getInvoice);

			if (pdf) {
				await connection.commit();
				return res.status(200).json({
					message: "Le soin a été ajouté avec succès.",
					response: response.insertId,
				});
			}

			res.status(201).json({ message: "Soin modifié." });
		}
		return res
			.status(400)
			.json({ message: "Problème lors de la modification" });
	} catch (error) {
		next(error);
	}
};

const getTotalCareThisMonth = async (req, res, next) => {
	try {
		const [[response]] = await Care.getTotalCareThisMonth();

		if (response) {
			return res.status(200).json({
				message: "Total des soins trouvés ce mois-ci.",
				response: response,
			});
		}

		res.status(404).json({
			message: "Problème lors de la récupération.",
		});
	} catch (error) {
		next(error);
	}
};

const getTotalCareByYear = async (req, res, next) => {
	const { year } = req.params;
	try {
		const [[response]] = await Care.getTotalCareByYear(year);

		if (response) {
			return res.status(200).json({
				message: "Total des soins récupérés avec succès.",
				response,
			});
		}
		return res.status(400).json({
			message: "Aucun soin trouvé pour cette année.",
		});
	} catch (error) {
		next(error);
	}
};

const remove = async (req, res, next) => {
	const { id } = req.body;
	try {
		const [response] = await Care.delete(id);

		if (response.affectedRows) {
			res.json({ message: "Soin supprimé." });
			return;
		}
		res.status(400).json({
			message: "Ce soin n'existe pas.",
		});
	} catch (error) {
		next(error);
	}
};

export {
	getAll,
	getOneCare,
	getBySearch,
	create,
	update,
	getTotalCareThisMonth,
	getTotalCareByYear,
	remove,
};
