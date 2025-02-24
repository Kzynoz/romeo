import { body } from "express-validator";

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

export { validatorCreateUser };
