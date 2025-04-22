import { body, param } from "express-validator";
import getEnumValues from "../../utils/getEnumValue.js";

const enumValidator = (table, column) => {
	return async (value) => {
		const values = await getEnumValues(table, column);

		if (!values.includes(value)) {
			console.log(value);
			throw new Error(`Problème avec ${column}.`);
		}
	};
};

// Validator for creating Guardian
const validatorCreateGuardian = [
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
	body("phone")
		.optional({ checkFalsy: true })
		.trim()
		.isNumeric()
		.withMessage("Doit contenir uniquement des chiffres")
		.isLength({ min: 10, max: 10 })
		.withMessage("Le numéro de téléphone doit être de 10 chiffres."),
	body("relationship")
		.notEmpty()
		.withMessage("Champ obligatoire.")
		.custom(enumValidator("guardian", "relationship")),
	body("company")
		.optional()
		.trim()
		.isLength({ max: 50 })
		.withMessage("Le nom de société ne doit pas dépasser 50 caractères.")
		.toLowerCase(),
	body("email")
		.notEmpty()
		.withMessage("Champ obligatoire.")
		.trim()
		.isLength({ max: 150 })
		.withMessage("L'email ne doit pas dépasser 150 caractères.")
		.isEmail()
		.withMessage("L'email doit être valide.")
		.normalizeEmail({ gmail_remove_dots: false }),
	body("street")
		.optional()
		.isLength({ max: 150 })
		.withMessage("La rue ne doit pas dépasser 150 caractères.")
		.trim()
		.toLowerCase(),
	body("guardian_info.city")
		.optional()
		.isLength({ max: 100 })
		.withMessage("La ville ne doit pas dépasser 100 caractères.")
		.trim()
		.toLowerCase(),
	body("zip_code")
		.optional({ checkFalsy: true })
		.isNumeric()
		.withMessage("Doit contenir uniquement des chiffres")
		.isLength({ min: 5, max: 5 })
		.withMessage("Le code postal doit être de 5 chiffres.")
		.trim(),
];

// Validator for updating Guardian
const validatorUpdateGuardian = [
	param("id")
		.isInt()
		.withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
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
	body("phone")
		.optional({ checkFalsy: true })
		.trim()
		.isNumeric()
		.withMessage("Doit contenir uniquement des chiffres")
		.isLength({ min: 10, max: 10 })
		.withMessage("Le numéro de téléphone doit être de 10 chiffres."),
	body("relationship")
		.notEmpty()
		.withMessage("Champ obligatoire.")
		.custom(enumValidator("guardian", "relationship")),
	body("company")
		.optional()
		.trim()
		.isLength({ max: 150 })
		.withMessage("Le nom de société ne doit pas dépasser 50 caractères.")
		.toLowerCase(),
	body("email")
		.notEmpty()
		.withMessage("Champ obligatoire.")
		.trim()
		.isLength({ max: 150 })
		.withMessage("L'email ne doit pas dépasser 150 caractères.")
		.isEmail()
		.withMessage("L'email doit être valide.")
		.normalizeEmail({ gmail_remove_dots: false }),
	body("number")
		.optional()
		.trim()
		.isLength({ max: 10 })
		.withMessage("Le numéro ne doit pas dépasser 10 caractères.")
		.toLowerCase(),
	body("street")
		.optional()
		.isLength({ max: 140 })
		.withMessage("La rue ne doit pas dépasser 140 caractères.")
		.trim()
		.toLowerCase(),
	body("city")
		.optional()
		.isLength({ max: 100 })
		.withMessage("La ville ne doit pas dépasser 100 caractères.")
		.trim()
		.toLowerCase(),
	body("zip_code")
		.optional({ checkFalsy: true })
		.isNumeric()
		.withMessage("Doit contenir uniquement des chiffres")
		.isLength({ min: 5, max: 5 })
		.withMessage("Le code postal doit être de 5 chiffres.")
		.trim(),
];

export { validatorCreateGuardian, validatorUpdateGuardian };
