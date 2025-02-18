import { body, param } from "express-validator";

const titleEnum = ["m.", "mme"];
const relationshipEnum = ["parent", "légal", "famille", "société"];

const validatorCreateUser = [
  body("alias")
    .notEmpty()
    .withMessage("L'alias est obligatoire.")
    .trim()
    .isLength({ min: 4 })
    .toLowerCase()
    .withMessage("L'alias doit contenir au minimum 4 caractères."),
  body("email")
    .notEmpty()
    .withMessage("L'email est obligatoire.")
    .trim()
    .isLength({ max: 150 })
    .withMessage("L'email ne doit pas dépasser 150 caractères.")
    .isEmail()
    .withMessage("L'email doit être valide.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir 8 caractères mininum.")
    .matches(/\d/)
    .withMessage("Le mot de passe doit contenir au moins un chiffre.")
    .matches(/[A-Z]/)
    .withMessage("Le mot de passe doit contenir au moins une lettre majuscule.")
    .matches(/[a-z]/)
    .withMessage("Le mot de passe doit contenir au moins une lettre minuscule.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "Le mot de passe doit contenir au moins un caractère spécial."
    ),
];

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

const validatorCreateGuardian = [
  body("customer_detail")
    .notEmpty()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard.")
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("customer_detail.title")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .isIn(titleEnum)
    .withMessage("Problème avec la civilité."),
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
  body("customer_detail.email")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .trim()
    .isLength({ max: 150 })
    .withMessage("L'email ne doit pas dépasser 150 caractères.")
    .isEmail()
    .withMessage("L'email doit être valide.")
    .normalizeEmail(),

  body("guardian_info")
    .notEmpty()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard.")
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("guardian_info.relationship")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .isIn(relationshipEnum)
    .withMessage("Problème avec la relation."),
  body("guardian_info.company")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le nom de société ne doit pas dépasser 50 caractères.")
    .toLowerCase(),
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
    .isIn(titleEnum)
    .withMessage("Problème avec la civilité."),
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
  body("customer_detail.email")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("L'email ne doit pas dépasser 150 caractères.")
    .isEmail()
    .withMessage("L'email doit être valide.")
    .normalizeEmail(),

  body("guardian_info")
    .optional()
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("guardian_info.relationship")
    .optional()
    .isIn(relationshipEnum)
    .withMessage("Problème avec la relation."),
  body("guardian_info.company")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Le nom de société ne doit pas dépasser 50 caractères.")
    .toLowerCase(),
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

const validatorCreatePatient = [
  body("patient")
    .notEmpty()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard.")
    .isObject()
    .withMessage("Une erreur est survenue, veuillez ressayer plus tard."),
  body("patient.title")
    .notEmpty()
    .withMessage("Champ obligatoire.")
    .isIn(titleEnum)
    .withMessage("Problème avec la civilité."),
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
  body("patient.title")
    .optional()
    .isIn(titleEnum)
    .withMessage("Problème avec la civilité."),
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

export {
  validatorCreateUser,
  validatorCreateRH,
  validatorUpdateRH,
  validatorCreateGuardian,
  validatorUpdateGuardian,
  validatorCreatePatient,
  validatorUpdatePatient,
};
