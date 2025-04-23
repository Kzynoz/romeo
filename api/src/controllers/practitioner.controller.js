import Care from "../models/care.model.js";
import Customer from "../models/customer.model.js";
import RetirementHome from "../models/retirement_home.model.js";


// Practitioner can search for specific patient, retirement home or care
const getBySearch = async (req, res, next) => {
	const { q = "" } = req.query;

	// If no search term is provided, return an error response
	if (!q) {
		return res
			.status(400)
			.json({ message: "La recherche ne peut pas être vide." });
	}

	// Format the search term by adding '%' to the start and end for SQL LIKE pattern matching
	const formattedSearch = `%${q.trim()}%`;

	try {
		// Perform searches across multiple tables (Care, RetirementHome, Customer) based on the search term
		const [care] = await Care.findBySearch(formattedSearch);
		const [retirementHome] = await RetirementHome.findBySearch(formattedSearch);
		const [patient] = await Customer.findBySearch(formattedSearch, 1);
		const [guardian] = await Customer.findBySearch(formattedSearch, 0);

		// Build the response object by checking if any results were found for each category
		const response = {
			care: care.length ? care : null,
			retirementHomes: retirementHome.length ? retirementHome : null,
			patients: patient.length ? patient : null,
			guardians: guardian.length ? guardian : null,
		};

		// If any of the search results have data, return a success response with the search results
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
