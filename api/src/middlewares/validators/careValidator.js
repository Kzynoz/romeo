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
  body("care")
    .notEmpty()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard.")
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  param("id")
    .optional()
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  param("patient_id")
    .optional()
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("practitioner_id")
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("care.performed_at")
    .isISO8601()
    .withMessage("La date doit être au format YYYY-MM-DD")
    .toDate(),
  body("care.complements")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Ne doit pas dépasser 255 caractères."),
  body("care.price")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .isDecimal()
    .withMessage("Le prix doit être un nombre décimal.")
    .isLength({ max: 7 })
    .withMessage("Le prix ne peut pas dépasser 9999.99.")
    .trim(),
  body("care.type")
    .notEmpty()
    .withMessage("Champ obligatoire")
    .custom(enumValidator("care", "type")),
];

const validatorUpdateCare = [
  body("care")
    .optional()
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  param("id")
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("practitioner_id")
    .optional()
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("care.performed_at")
    .optional()
    .isISO8601()
    .withMessage("La date doit être au format YYYY-MM-DD")
    .toDate(),
  body("care.complements")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Ne doit pas dépasser 255 caractères."),
  body("care.price")
    .optional()
    .isDecimal()
    .withMessage("Le prix doit être un nombre décimal.")
    .isLength({ max: 7 })
    .withMessage("Le prix ne peut pas dépasser 9999.99.")
    .trim(),
  body("care.type").optional().custom(enumValidator("care", "type")),
];

export { validatorCreateCare, validatorUpdateCare };
