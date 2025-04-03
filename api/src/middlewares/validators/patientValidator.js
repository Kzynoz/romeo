import { body, check, param } from "express-validator";
import getEnumValues from "../../utils/getEnumValue.js";

// refactoriser
const enumValidator = (table, column) => {
	return async (value) => {
		const values = await getEnumValues(table, column);

		if (!values.includes(value)) {
			throw new Error(`Problème avec ${column}.`);
		}
	};
};

const validatorCreatePatient = [
	body("title")
		.notEmpty()
		.withMessage("Champ obligatoire.")
		.custom(enumValidator("customer", "title")),
	body("firstname")
		.notEmpty()
		.withMessage("Champ obligatoire.")
		.trim()
		.isLength({ max: 50 })
		.withMessage("Le prénom ne doit pas dépasser 50 caractères.")
		.toLowerCase(),
	body("lastname")
		.notEmpty()
		.withMessage("Champ obligatoire.")
		.trim()
		.isLength({ max: 150 })
		.withMessage("Le nom de famille ne doit pas dépasser 150 caractères.")
		.toLowerCase(),
	body("guardian_id")
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
	body("retirement_home_id")
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
];

const validatorUpdatePatient = [
	param("id")
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
	body("title").optional().custom(enumValidator("customer", "title")),
	body("firstname")
		.optional()
		.trim()
		.isLength({ max: 50 })
		.withMessage("Le prénom ne doit pas dépasser 50 caractères.")
		.toLowerCase(),
	body("lastname")
		.optional()
		.trim()
		.isLength({ max: 150 })
		.withMessage("Le nom de famille ne doit pas dépasser 150 caractères.")
		.toLowerCase(),
	body("guardian_id")
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
	body("retirement_home_id")
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
];

export { validatorCreatePatient, validatorUpdatePatient };
