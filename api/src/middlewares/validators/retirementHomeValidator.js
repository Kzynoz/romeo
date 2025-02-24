import { body, param } from "express-validator";

const validatorCreateRH = [
  body("name")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le nom ne doit pas dépasser 150 caractères.")
    .toLowerCase(),
  body("contact")
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le contact ne doit pas dépasser 150 caractères.")
    .toLowerCase(),
  body("number")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .trim()
    .isLength({ max: 10 })
    .withMessage("Le numéro ne doit pas dépasser 10 caractères.")
    .toLowerCase(),
  body("street")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .isLength({ max: 140 })
    .withMessage("La rue ne doit pas dépasser 140 caractères.")
    .trim()
    .toLowerCase(),
  body("city")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .isLength({ max: 100 })
    .withMessage("La ville ne doit pas dépasser 100 caractères.")
    .trim()
    .toLowerCase(),
  body("zip_code")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .isNumeric()
    .withMessage("Doit contenir uniquement des chiffres")
    .isLength({ min: 5, max: 5 })
    .withMessage("Le code postal doit être de 5 chiffres.")
    .trim(),
];

const validatorUpdateRH = [
  param("id")
    .isInt()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le nom ne doit pas dépasser 150 caractères.")
    .toLowerCase(),
  body("contact")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le contact ne doit pas dépasser 150 caractères.")
    .toLowerCase(),
  body("number")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Le numéro ne doit pas dépasser 10 caractères."),
  body("street")
    .optional()
    .trim()
    .isLength({ max: 140 })
    .withMessage("La rue ne doit pas dépasser 140 caractères.")
    .toLowerCase(),
  body("city")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("La ville ne doit pas dépasser 100 caractères.")
    .toLowerCase(),
  body("zip_code")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Doit contenir uniquement des chiffres")
    .isLength({ min: 5, max: 5 })
    .withMessage("Le code postal doit être de 5 chiffres."),
];

export { validatorCreateRH, validatorUpdateRH };
