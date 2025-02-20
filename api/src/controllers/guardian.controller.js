import { validationResult } from "express-validator";
import pool from "../config/db.js";
import Customer from "../models/customer.model.js";
import Guardian from "../models/guardian.model.js";

const checkGuardian = async (req, res, next) => {
  // à voir
  // à voir
  try {
    const [response] = await Guardian.findGuardian();

    if (response) {
      return res.status(200).json({
        message: "Le tuteur existe déjà.",
        response,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const [response] = await Guardian.getAll();

    if (response.length) {
      return res.status(200).json({
        message: "Tuteurs récupérés avec succès.",
        response,
      });
    }
    return res.status(400).json({
      message: "Aucun tuteurs récupérés.",
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [[response]] = await Guardian.getOne(id);

    if (!response) {
      res.status(400).json({
        message: "Le tuteur recherché n'a pas été trouvé.",
      });
      return;
    }

    res.status(200).json({
      message: "Tuteur trouvé avec succès.",
      response,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  const { customer_detail, guardian_info } = req.body;
  let connection = null;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Erreur lors de la validation du formulaire.",
      errors: errors.array(),
    });
  }

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [[existingCustomer]] = await Customer.findCustomerGuardian(
      customer_detail
    );
    if (existingCustomer) {
      res.status(400).json({ message: "Le tuteur existe déjà." });
      return;
    }

    const [customer] = await Customer.insert(customer_detail, connection);
    if (customer.insertId) {
      const guardian = {
        ...guardian_info,
        street: `${guardian_info.number} ${guardian_info.street}` || null,
        customer_id: customer.insertId,
      };

      const [response] = await Guardian.insert(guardian, connection);
      if (response.insertId) {
        await connection.commit();
        res
          .status(200)
          .json({ message: "Le tuteur a été ajouté avec succès." });
        return;
      }
    }
    await connection.rollback();
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({ message: "Erreur lors de l'ajout du tuteur." });
  } finally {
    if (connection) connection.release();
  }
};

const update = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Erreur lors de la validation du formulaire.",
      errors: errors.array(),
    });
  }

  const { id } = req.params;
  const customer_detail = req.body.customer_detail || null;
  const guardian_info = req.body.guardian_info || null;
  let updatedCustomer,
    updatedGuardian,
    connection = null;

  try {
    if (customer_detail && guardian_info) {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const [updatedCustomer] = await Customer.updateIsGuardian(
        customer_detail,
        id,
        connection
      );

      if (updatedCustomer.affectedRows) {
        guardian_info.street =
          `${guardian_info.number} ${guardian_info.street}` || null;

        const [updatedGuardian] = await Guardian.update(
          guardian_info,
          id,
          connection
        );

        if (updatedGuardian.affectedRows) {
          await connection.commit();
          res.status(201).json({ message: "Le tuteur a été mise à jour." });
          return;
        }
      }
      await connection.rollback();
      return res
        .status(500)
        .json({ message: "Erreur lors de l'ajout du tuteur." });
    }

    if (customer_detail && !guardian_info) {
      [updatedCustomer] = await Customer.updateIsGuardian(customer_detail, id);
    }

    if (!customer_detail && guardian_info) {
      guardian_info.street =
        `${guardian_info.number} ${guardian_info.street}` || null;

      [updatedGuardian] = await Guardian.update(guardian_info, id);
    }

    if (updatedCustomer?.affectedRows || updatedGuardian?.affectedRows) {
      res.status(201).json({ message: "Le tuteur a été mise à jour." });
      return;
    }
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({ message: "Erreur lors de l'ajout du tuteur." });
  } finally {
    if (connection) connection.release();
  }
};

const remove = async (req, res, next) => {
  const { id } = req.body;
  try {
    const [response] = await Customer.delete(id, 0);
    if (response.affectedRows) {
      res.json({ message: "Tuteur supprimé." });
      return;
    }
    res.status(400).json({
      message: "Ce tuteur n'existe pas.",
    });
  } catch (error) {
    next(error);
  }
};

const getBySearch = async (req, res, next) => {
  const { q = "" } = req.query;
  const formattedSearch = `%${q.trim()}%`;

  try {
    const [response] = await Customer.findBySearch(formattedSearch, 0);

    if (response.length) {
      res.status(200).json({ message: "Tuteur(s) trouvé(s).", response });
      return;
    }

    res.status(400).json({ message: "Aucuns tuteurs trouvés." });
    return;
  } catch (error) {
    next(error);
  }
};

export { checkGuardian, getAll, getOne, create, update, remove, getBySearch };
