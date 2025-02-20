import { validationResult } from "express-validator";
import Care from "../models/care.model.js";

const getAll = async (req, res, next) => {
  try {
    const [response] = await Care.getAll();

    if (response.length) {
      return res.status(200).json({
        message: "Soins récupérés avec succès.",
        response,
      });
    }
    return res.status(400).json({
      message: "Aucun soins récupérés.",
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [[response]] = await Care.getOne(id);

    if (!response) {
      res.status(400).json({
        message: "Le soin n'a pas été trouvé.",
      });
      return;
    }

    res.status(200).json({
      message: "Soin trouvé avec succès.",
      response,
    });
  } catch (error) {
    next(error);
  }
};

const getBySearch = async (req, res, next) => {
  const { q = "" } = req.query;
  const formattedSearch = `%${q.trim()}%`;

  try {
    const [response] = await Care.findBySearch(formattedSearch);

    if (response.length) {
      res.status(200).json({ message: "Soin(s) trouvé(s).", response });
      return;
    }

    res.status(400).json({ message: "Aucuns soins trouvés." });
    return;
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  // tester avec l'autre route
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Erreur lors de la validation du formulaire.",
      errors: errors.array(),
    });
  }
  const { care, patient_id, practitioner_id } = req.body;
  const id = req.params.id || patient_id;

  try {
    const [[existingCare]] = await Care.findCare(id, care);

    if (existingCare) {
      res.status(400).json({ message: "Ce soin pour ce patient existe déjà." });
      return;
    }

    const newCare = {
      ...care,
      invoice_generated: 0,
      invoice_paid: 0,
      invoice_send: 0,
      customer_id: id,
      practitioner_id: practitioner_id || req.user.alias,
    };

    console.log(newCare);

    const [response] = await Care.insert(newCare, id);

    if (response.insertId) {
      return res
        .status(200)
        .json({ message: "Le soin a été ajouté avec succès." });
    }

    res.status(500).json({ message: "Erreur lors de l'ajout du soin." });
  } catch (error) {
    next(error);
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
  const { care, practitioner_id, invoices } = req.body;
  console.log(invoices);

  const updatedCare = {
    ...care,
    id: id,
    practitioner_id: practitioner_id,
    invoice_generated: invoices.invoice_generated || null,
    invoice_paid: invoices.invoice_paid || null,
    invoice_send: invoices.invoice_send || null,
  };

  try {
    const [response] = await Care.update(updatedCare);

    if (response.affectedRows) {
      return res.status(201).json({ message: "Soin modifié." });
    }
    return res
      .status(400)
      .json({ message: "Problème lors de la modification" });
  } catch (error) {
    next(error);
  }
};

export { getAll, getOne, getBySearch, create, update };
