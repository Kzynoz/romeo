import { body, param } from "express-validator";
import getEnumValues from "../../utils/getEnumValue.js";

const enumValidator = (table, column) => {
	return async (value) => {
		const values = await getEnumValues(table, column);

		if (!values.includes(value)) {
			throw new Error(`Problème avec ${column}.`);
		}
	};
};

const validatorCreateCare = [
	param("id")
		.optional()
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
	param("patient_id")
		.optional({ checkFalsy: true })
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
	body("practitioner_id")
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
	body("performed_at")
		.isISO8601()
		.withMessage("La date doit être au format YYYY-MM-DD")
		.toDate(),
	body("complements")
		.optional()
		.trim()
		.isLength({ max: 255 })
		.withMessage("Ne doit pas dépasser 255 caractères."),
	body("price")
		.notEmpty()
		.withMessage("Champ obligatoire.")
		.isDecimal()
		.withMessage("Le prix doit être un nombre décimal.")
		.isLength({ max: 7 })
		.withMessage("Le prix ne peut pas dépasser 9999.99.")
		.trim(),
	body("type")
		.notEmpty()
		.withMessage("Champ obligatoire")
		.custom(enumValidator("care", "type")),
];

const validatorUpdateCare = [
	param("id")
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
	body("practitioner_id")
		.optional()
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
	body("performed_at")
		.optional()
		.isISO8601()
		.withMessage("La date doit être au format YYYY-MM-DD")
		.toDate(),
	body("complements")
		.optional()
		.trim()
		.isLength({ max: 255 })
		.withMessage("Ne doit pas dépasser 255 caractères."),
	body("price")
		.optional()
		.isDecimal()
		.withMessage("Le prix doit être un nombre décimal.")
		.isLength({ max: 7 })
		.withMessage("Le prix ne peut pas dépasser 9999.99.")
		.trim(),
	body("type").optional().custom(enumValidator("care", "type")),
];

export { validatorCreateCare, validatorUpdateCare };
