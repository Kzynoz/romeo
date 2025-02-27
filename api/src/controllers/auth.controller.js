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

    if (response) {
      const comparedPassword = await compare(password, response.password);

      if (comparedPassword) {
        const TOKEN = createToken(response);
        res.cookie("jwt", TOKEN, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Utilise HTTPS en production
          //sameSite: "none",
          maxAge: 86400000,
        });

        return res.json({
          message: "L'utilisateur est connecté.",
          user: {
            id: response.id,
            alias: response.alias,
            is_admin: response.is_admin,
          },
        });
      }
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
  const errors = validationResult(req);
  let connection = null;

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Erreur lors de la validation du formulaire.",
      errors: errors.array(),
    });
  }

  try {
    const [[findGuardian]] = await Auth.findGuardian(email, tokenUrl);
    console.log(findGuardian);

    if (findGuardian && findGuardian.token) {
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

      if (response.affectedRows) {
        const [deleteToken] = await Auth.deleteToken(connection, { id, token });

        if (deleteToken.affectedRows) {
          await connection.commit();
          return res
            .status(201)
            .json({ message: "L'utilisateur a été ajouté" });
        }
      }
    }

    if (connection) await connection.rollback();
    return res.status(400).json({
      message: "Token ou email invalide.",
    });
  } catch (error) {
    if (connection) await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

const guardianLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const [[response]] = await Auth.findGuardian(email);

    if (response) {
      const comparedPassword = await compare(password, response.password);

      if (comparedPassword) {
        const TOKEN = createToken(response);
        console.log("Cookie JWT à envoyer:", TOKEN);
        res.cookie("jwt", TOKEN, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Utilise HTTPS en production
          // sameSite: "none", à changer à la mise en lgine
          maxAge: 86400000,
        });

        return res.json({
          message: "L'utilisateur est connecté.",
          user: {
            id: response.id,
            alias: `${response.title} ${response.firstname} ${response.lastname}`,
            is_admin: "tuteur",
          },
        });
      }
    }

    res.status(400).json({
      message: "Email ou mot de passe incorrect.",
    });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  logout,
  refreshLogin,
  guardianRegister,
  guardianLogin,
};
