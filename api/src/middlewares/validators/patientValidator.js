import { body, param } from "express-validator";
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
  body("patient")
    .notEmpty()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard.")
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("patient.title")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .custom(enumValidator("customer", "title")),
  body("patient.firstname")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Le prénom ne doit pas dépasser 50 caractères.")
    .toLowerCase(),
  body("patient.lastname")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le nom de famille ne doit pas dépasser 150 caractères.")
    .toLowerCase(),
  body("patient.phone")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Doit contenir uniquement des chiffres")
    .isLength({ min: 10, max: 10 })
    .withMessage("Le numéro de téléphone doit être de 10 chiffres."),
  body("patient.email")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("L'email ne doit pas dépasser 150 caractères.")
    .isEmail()
    .withMessage("L'email doit être valide.")
    .normalizeEmail(),
  body("guardian_id")
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("retirement_home_id")
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("practitioner_id")
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
];

const validatorUpdatePatient = [
  param("id")
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("patient")
    .optional()
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("patient.title").optional().custom(enumValidator("customer", "title")),
  body("patient.firstname")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Le prénom ne doit pas dépasser 50 caractères.")
    .toLowerCase(),
  body("patient.lastname")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le nom de famille ne doit pas dépasser 150 caractères.")
    .toLowerCase(),
  body("patient.phone")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Doit contenir uniquement des chiffres")
    .isLength({ min: 10, max: 10 })
    .withMessage("Le numéro de téléphone doit être de 10 chiffres."),
  body("patient.email")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("L'email ne doit pas dépasser 150 caractères.")
    .isEmail()
    .withMessage("L'email doit être valide.")
    .normalizeEmail(),
  body("guardian_id")
    .optional()
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("retirement_home_id")
    .optional()
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("practitioner_id")
    .optional()
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
];

export { validatorCreatePatient, validatorUpdatePatient };
