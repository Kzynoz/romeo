import { compare, hash } from "bcrypt";
import { validationResult } from "express-validator";
import pool from "../config/db.js";
import Auth from "../models/auth.model.js";
import createToken from "../utils/token.js";

const SALT = 10;

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
          id: response.id,
          alias: response.alias,
          is_admin: response.is_admin,
        },
      });
      return;
    }

    res.status(400).json({
      message: "Email ou mot de passe incorrect.",
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    //sameSite: "none", en remettre à la mise en ligne
  });
  res.json({ message: "L'utilisateur a été deconnecté." });
};

const refreshLogin = async (req, res, next) => {
  res.json({
    message: "L'utilisateur est bien connecté.",
    user: {
      id: req.user.id,
      alias: req.user.alias,
      is_admin: req.user.is_admin,
    },
  });
};

const guardianRegister = async (req, res, next) => {
  const { tokenUrl } = req.params;
  const { email, password } = req.body;
  let connection = null;

  /*   const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Erreur lors de la validation du formulaire.",
      errors: errors.array(),
    });
  } */

  try {
    const [[findGuardian]] = await Auth.findGuardian(email, tokenUrl);

    if (!findGuardian) {
      return res.status(400).json({
        message: "Token ou email invalide.",
      });
    }

    if (!findGuardian.token) {
      return res.status(400).json({
        message: "Token invalide ou déjà utilisé.",
      });
    }

    const { id, token } = findGuardian;
    const hashedPassword = await hash(password, SALT);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [response] = await Auth.registerGuardian(connection, {
      id,
      email,
      token,
      password: hashedPassword,
    });

    if (!response.affectedRows) {
      await connection.rollback();
      res.status(500).json({
        message: "Une erreur est survenue, veuillez ressayer plus tard.",
      });
      return;
    }

    const [deleteToken] = await Auth.deleteToken(connection, { id, token });

    if (!deleteToken.affectedRows) {
      await connection.rollback();
      res.status(201).json({
        message: "Une erreur est survenue, veuillez ressayer plus tard.",
      });
    }
    await connection.commit();

    return res.status(201).json({ message: "L'utilisateur a été ajouté" });
  } catch (error) {
    if (connection) await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

export { register, login, logout, refreshLogin, guardianRegister };
