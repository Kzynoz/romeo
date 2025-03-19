import Patient from "../models/patient.model.js";
import Customer from "../models/customer.model.js";
import { validationResult } from "express-validator";

const getAll = async (req, res, next) => {
	try {
		const [response] = await Patient.gettAllWithLatestCare();

		if (response.length) {
			return res.status(200).json({
				message: "Patients récupérés.",
				response,
			});
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
	try {
		const [[response]] = await Patient.getOne(id);

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
	const { patient, guardian_id, retirement_home_id, practitioner_id } =
		req.body;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	try {
		const [[existingPatient]] = await Patient.findPatient(patient);

		if (existingPatient) {
			return res.status(400).json({ message: "Le patient existe déjà." });
		}

		if (patient) {
			const newPatient = {
				...patient,
				is_patient: 1,
				guardian_id: guardian_id || null,
				retirement_home_id: retirement_home_id || null,
				practitioner_id: practitioner_id,
			};

			const [response] = await Patient.insert(newPatient);

			if (response.insertId) {
				return res.status(201).json({ message: "Patient ajouté avec succès." });
			}
		}
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de l'ajout du patient." });
	}
};

const update = async (req, res, next) => {
	const { patient, guardian_id, retirement_home_id, practitioner_id } =
		req.body;
	const { id } = req.params;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const updatedPatient = {
		...patient,
		id,
		guardian_id: guardian_id,
		retirement_home_id: retirement_home_id,
		practitioner_id: practitioner_id,
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
