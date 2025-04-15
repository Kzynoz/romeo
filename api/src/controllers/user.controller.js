import Auth from "../models/auth.model.js";
import Care from "../models/care.model.js";
import Customer from "../models/customer.model.js";
import RetirementHome from "../models/retirement_home.model.js";

const getBySearch = async (req, res, next) => {
	const { q = "" } = req.query;

	if (!q) {
		return res
			.status(400)
			.json({ message: "La recherche ne peut pas être vide." });
	}

	const formattedSearch = `%${q.trim()}%`;

	try {
		const [care] = await Care.findBySearch(formattedSearch);
		const [retirementHome] = await RetirementHome.findBySearch(formattedSearch);
		const [patient] = await Customer.findBySearch(formattedSearch, 1);
		const [guardian] = await Customer.findBySearch(formattedSearch, 0);

		const response = {
			care: care.length ? care : null,
			retirementHomes: retirementHome.length ? retirementHome : null,
			patients: patient.length ? patient : null,
			guardians: guardian.length ? guardian : null,
		};

		if (
			response.care ||
			response.retirementHomes ||
			response.patients ||
			response.guardians
		) {
			res.status(200).json({ message: "Résultat de recherche.", response });
			return;
		}

		res.status(400).json({ message: "Aucun résultat trouvé." });
		return;
	} catch (error) {
		next(error);
	}
};

export { getBySearch };
