import Customer from "../models/customer.model.js";
import { validationResult } from "express-validator";


// Get All customers who are patient
const getAllPatients = async (req, res, next) => {
	const offset = req.query.offset || "0";
	const limit = req.query.limit || "10";
	const guardian_id = req.guardian_id;

	try {
		// Count patients of guardian
		const [[count]] = await Customer.countAll(guardian_id);

		if (count.total > 0) {
			const [response] = await Customer.getAllWithLatestCare({
				offset,
				limit,
				guardian_id,
			});

			if (response.length) {
				return res.status(200).json({
					message: "Patients récupérés.",
					response,
					totalPages: Math.ceil(count.total / limit),
				});
			}
		}

		return res.status(400).json({
			message: "Aucun patients récupérés.",
		});
	} catch (error) {
		next(error);
	}
};

// Get one patient by his ID
const getOnePatient = async (req, res, next) => {
	const { id } = req.params;
	const offset = req.query.offset || "0";
	const limit = req.query.limit || "10";
	const guardian_id = req.guardian_id;

	try {
		const [[response]] = await Customer.getOnePatient({
			offset,
			limit,
			id,
			guardian_id,
		});

		if (!response) {
			res.status(400).json({
				message: "Le patient recherché n'a pas été trouvé.",
			});
			return;
		}

		res.status(200).json({
			message: "Patient trouvé avec succès.",
			response,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

// Create a patient
const create = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}
	
	const findPatient = {
		...req.body,
		isPatient: 1,
	}

	try {
		const [[existingPatient]] = await Customer.findCustomer(findPatient);

		if (existingPatient) {
			return res.status(400).json({ message: "Le patient existe déjà." });
		}

		const patient = {
			...req.body,
			is_patient:             1,
			guardian_id:            req.body.guardian_id        || null,
			retirement_home_id:     req.body.retirement_home_id || null,
		};

		const [response] = await Customer.insertPatient(patient);

		if (response.insertId) {
			return res.status(201).json({ message: "Patient ajouté avec succès." });
		}
	} catch (error) {
		next(error);
	}
};

// Update a patient
const update = async (req, res, next) => {
	const { id } = req.params;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const updatedPatient = {
		...req.body,
		id,
	};

	try {
		const [response] = await Customer.updateIsPatient(updatedPatient);

		if (response.affectedRows === 1) {
			return res.status(201).json({ message: "Patient modifié." });
		}
		return res
			.status(400)
			.json({ message: "Problème lors de la modification" });
	} catch (error) {
		next(error);
	}
};


// Remove a customer who's patient
const remove = async (req, res, next) => {
	const { id } = req.body;
	const { idItem } = req.params;

	if (id != idItem) {
		res.status(400).json({
			message: "Une erreur est survenue, veuillez réessayer plus tard.",
		});
		return;
	}
	try {
		const [response] = await Customer.delete(id, 1);
		if (response.affectedRows === 1) {
			res.json({ message: "Patient supprimé." });
			return;
		}
		res.status(400).json({
			message: "Ce patient n'existe pas.",
		});
	} catch (error) {
		next(error);
	}
};

// Get patient with search
const getCustomersBySearch = async (req, res, next) => {
	const { q = "" } = req.query;
	const formattedSearch = `%${q.trim()}%`;

	if (!q) {
		return res
			.status(400)
			.json({ message: "La recherche ne peut pas être vide." });
	}

	try {
		const [response] = await Customer.findBySearch(formattedSearch, 1);

		if (response.length) {
			res.status(200).json({ message: "Patient(s) trouvé(s).", response });
			return;
		}

		res.status(404).json({ message: "Aucuns patients trouvés." });
		return;
	} catch (error) {
		next(error);
	}
};

export { getAllPatients, getOnePatient, create, update, remove, getCustomersBySearch };