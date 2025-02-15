import { compare, hash } from "bcrypt";
import { validationResult } from "express-validator";
import Auth from "../models/auth.model.js";
import createToken from "../utils/token.js";

const SALT = 10;

// OK
const register = async (req, res, next) => {
  const { alias, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Erreur lors de la validation du formulaire.",
      errors: errors.array(),
    });
  }

  try {
    const hashedPassword = await hash(password, SALT);
    const [response] = await Auth.createPractitioner({
      alias,
      email,
      password: hashedPassword,
    });

    if (response.insertId) {
      return res.status(201).json({
        message: "L'utilisateur a été ajouté.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// OK
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const [[response]] = await Auth.findPractitioner(email);
    const comparedPassword = await compare(password, response.password);

    if (response && comparedPassword) {
      const TOKEN = createToken(response);
      res.cookie("jwt", TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Utilise HTTPS en production
        // sameSite: "none", à changer à la mise en lgine
        maxAge: 86400000,
      });

      res.json({
        message: "L'utilisateur est connecté.",
        user: {
          alias: response.alias,
          is_admin: response.is_admin,
        },
      });
      return;
    }

    res.status(400).json({
      message: "Alias ou mot de passe incorrect.",
    });
  } catch (error) {
    next(error);
  }
};

// OK
const logout = async (req, res, next) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    //sameSite: "none", en remettre à la mise en ligne
  });
  res.json({ message: "L'utilisateur a été deconnecté." });
};

// OK
const refreshLogin = async (req, res, next) => {
  res.json({
    message: "L'utilisateur est bien connecté.",
    user: { alias: req.user.alias, is_admin: req.user.is_admin },
  });
};

export { register, login, logout, refreshLogin };
