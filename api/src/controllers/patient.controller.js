import Patient from "../models/patient.model.js";
import Customer from "../models/customer.model.js";
import { validationResult } from "express-validator";

const getAll = async (req, res, next) => {
	const offset = req.query.offset || "0";
	const limit = req.query.limit || "10";
	const guardian_id = req.guardian_id;

	try {
		const [[count]] = await Patient.countAll(guardian_id);

		if (count.total > 0) {
			const [response] = await Patient.gettAllWithLatestCare({
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

const getOne = async (req, res, next) => {
	const { id } = req.params;
	const offset = req.query.offset || "0";
	const limit = req.query.limit || "10";
	const guardian_id = req.guardian_id;

	try {
		const [[response]] = await Patient.getOne({
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
		next(error);
	}
};

const create = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	try {
		const [[existingPatient]] = await Patient.findPatient(req.body);

		if (existingPatient) {
			return res.status(400).json({ message: "Le patient existe déjà." });
		}

		const patient = {
			...req.body,
			is_patient: 1,
			guardian_id: req.body.guardian_id || null,
			retirement_home_id: req.body.retirement_home_id || null,
		};

		const [response] = await Patient.insert(patient);

		if (response.insertId) {
			return res.status(201).json({ message: "Patient ajouté avec succès." });
		}
	} catch (error) {
		next(error);
	}
};

const update = async (req, res, next) => {
	const { id } = req.params;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	console.log(errors);

	const updatedPatient = {
		...req.body,
		id,
	};

	try {
		const [response] = await Customer.updateIsPatient(updatedPatient);

		if (response.affectedRows) {
			return res.status(201).json({ message: "Patient modifié." });
		}
		return res
			.status(400)
			.json({ message: "Problème lors de la modification" });
	} catch (error) {
		next(error);
	}
};

const remove = async (req, res, next) => {
	const { id } = req.body;
	try {
		const [response] = await Customer.delete(id, 1);
		if (response.affectedRows) {
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

const getBySearch = async (req, res, next) => {
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

export { getAll, getOne, create, remove, update, getBySearch };
