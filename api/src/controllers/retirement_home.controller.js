import { validationResult } from "express-validator";
import RetirementHome from "../models/retirement_home.model.js";

const getAll = async (req, res, next) => {
	const offset = req.query.offset || "0";
	const limit = req.query.limit || "10";

	try {
		const [[count]] = await RetirementHome.countAll();

		if (count.total > 0) {
			const [response] = await RetirementHome.getAll(offset, limit);

			if (response.length) {
				return res.status(200).json({
					message: "Maisons de retraites récupérées.",
					response,
					totalPages: Math.ceil(count.total / limit),
				});
			}
		}

		return res.status(400).json({
			message: "Aucunes maisons de retraite récupérées.",
		});
	} catch (error) {
		next(error);
	}
};

const create = async (req, res, next) => {
	const { name, contact, street, city, zip_code } = req.body;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const rh = {
		name,
		contact: contact || null,
		street: street,
		city,
		zip_code,
	};

	try {
		const [response] = await RetirementHome.create(rh);

		if (response.insertId) {
			return res.status(201).json({
				message: "La maison de retraite a été ajoutée.",
			});
		}
	} catch (error) {
		next(error);
	}
};

const remove = async (req, res, next) => {
	const { id } = req.body;
	const { idItem } = req.params;
	console.log("id body", id);
	console.log("id params", idItem);

	if (id != idItem) {
		res.status(400).json({
			message: "Une erreur est survenue, veuillez réessayer plus tard.",
		});
		return;
	}

	try {
		const [response] = await RetirementHome.delete(id);
		if (response.affectedRows) {
			res.json({ message: "Maison de retraite supprimée." });
			return;
		}
		res.status(400).json({
			message: "La maison de retraite n'existe pas ou à déjà été supprimée .",
		});
	} catch (error) {
		next(error);
	}
};

const update = async (req, res, next) => {
	const { name, contact, street, city, zip_code } = req.body;
	const { id } = req.params;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const retirement_home = {
		id,
		name: name || null,
		contact: contact || null,
		street: street || null,
		city: city || null,
		zip_code: zip_code || null,
	};

	try {
		const [response] = await RetirementHome.update(retirement_home);

		if (response.affectedRows) {
			return res.status(201).json({ message: "Maison de retraite modifiée." });
		}
		return res
			.status(400)
			.json({ message: "Problème lors de la modification" });
	} catch (error) {
		next(error);
	}
};

const getOne = async (req, res, next) => {
	const { id } = req.params;

	try {
		const [[response]] = await RetirementHome.getOne(id);

		if (response) {
			return res.status(200).json({
				message: "Maison de retraite trouvé avec succès.",
				response,
			});
		}

		return res.status(400).json({
			message: "La maison de retraute recherchée n'a pas été trouvée.",
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
		const [response] = await RetirementHome.findBySearch(formattedSearch);

		if (response.length) {
			res
				.status(200)
				.json({ message: "Maison(s) de retraite trouvée(s).", response });
			return;
		}

		res.status(400).json({ message: "Aucunes maisons de retaires trouvées." });
		return;
	} catch (error) {
		next(error);
	}
};

export { getAll, create, remove, update, getOne, getBySearch };
