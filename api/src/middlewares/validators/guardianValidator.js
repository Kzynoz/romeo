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

const validatorCreateGuardian = [
  body("customer_detail")
    .notEmpty()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard.")
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("customer_detail.title")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .custom(enumValidator("customer", "title")),
  body("customer_detail.firstname")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Le prénom ne doit pas dépasser 50 caractères.")
    .toLowerCase(),
  body("customer_detail.lastname")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le nom de famille ne doit pas dépasser 150 caractères.")
    .toLowerCase(),
  body("customer_detail.phone")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Doit contenir uniquement des chiffres")
    .isLength({ min: 10, max: 10 })
    .withMessage("Le numéro de téléphone doit être de 10 chiffres."),

  body("guardian_info")
    .notEmpty()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard.")
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("guardian_info.relationship")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .custom(enumValidator("guardian", "relationship")),
  body("guardian_info.company")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le nom de société ne doit pas dépasser 50 caractères.")
    .toLowerCase(),
  body("guardian_info.email")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .trim()
    .isLength({ max: 150 })
    .withMessage("L'email ne doit pas dépasser 150 caractères.")
    .isEmail()
    .withMessage("L'email doit être valide.")
    .normalizeEmail(),
  body("guardian_info.number")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .trim()
    .isLength({ max: 10 })
    .withMessage("Le numéro ne doit pas dépasser 10 caractères.")
    .toLowerCase(),
  body("guardian_info.street")
    .optional()
    .isLength({ max: 140 })
    .withMessage("La rue ne doit pas dépasser 140 caractères.")
    .trim()
    .toLowerCase(),
  body("guardian_info.city")
    .optional()
    .isLength({ max: 100 })
    .withMessage("La ville ne doit pas dépasser 100 caractères.")
    .trim()
    .toLowerCase(),
  body("guardian_info.zip_code")
    .optional()
    .isNumeric()
    .withMessage("Doit contenir uniquement des chiffres")
    .isLength({ min: 5, max: 5 })
    .withMessage("Le code postal doit être de 5 chiffres.")
    .trim(),
];

const validatorUpdateGuardian = [
  param("id")
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("customer_detail")
    .optional()
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("customer_detail.title")
    .optional()
    .custom(enumValidator("customer", "title")),
  body("customer_detail.firstname")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Le prénom ne doit pas dépasser 50 caractères.")
    .toLowerCase(),
  body("customer_detail.lastname")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le nom de famille ne doit pas dépasser 150 caractères.")
    .toLowerCase(),
  body("customer_detail.phone")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Doit contenir uniquement des chiffres")
    .isLength({ min: 10, max: 10 })
    .withMessage("Le numéro de téléphone doit être de 10 chiffres."),

  body("guardian_info")
    .optional()
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("guardian_info.relationship")
    .optional()
    .custom(enumValidator("guardian", "relationship")),
  body("guardian_info.company")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le nom de société ne doit pas dépasser 50 caractères.")
    .toLowerCase(),
  body("guardian_info.email")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("L'email ne doit pas dépasser 150 caractères.")
    .isEmail()
    .withMessage("L'email doit être valide.")
    .normalizeEmail(),
  body("guardian_info.number")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Le numéro ne doit pas dépasser 10 caractères.")
    .toLowerCase(),
  body("guardian_info.street")
    .optional()
    .isLength({ max: 140 })
    .withMessage("La rue ne doit pas dépasser 140 caractères.")
    .trim()
    .toLowerCase(),
  body("guardian_info.city")
    .optional()
    .isLength({ max: 100 })
    .withMessage("La ville ne doit pas dépasser 100 caractères.")
    .trim()
    .toLowerCase(),
  body("guardian_info.zip_code")
    .optional()
    .isNumeric()
    .withMessage("Doit contenir uniquement des chiffres")
    .isLength({ min: 5, max: 5 })
    .withMessage("Le code postal doit être de 5 chiffres.")
    .trim(),
];

export { validatorCreateGuardian, validatorUpdateGuardian };
