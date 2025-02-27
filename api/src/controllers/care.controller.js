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

const getOneCare = async (req, res, next) => {
  const { patientId, id } = req.params;
  console.log("patient id :", patientId, "careId :", id);
  try {
    const [[response]] = await Care.getOne({ patientId, id });

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
  console.log(formattedSearch);

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

// tester avec l'autre route (avec l'id du patient passé en param) + REMPLACER PAR UNE TRANSACTION
const create = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Erreur lors de la validation du formulaire.",
      errors: errors.array(),
    });
  }
  const { care, patient_id, practitioner_id } = req.body;
  const id = req.params.id || patient_id; // si deuxieme route
  const careDate = new Date(care.performed_at).toISOString().split("T")[0];
  console.log(careDate);

  try {
    const [[existingCare]] = await Care.findCare(id, careDate);

    if (existingCare) {
      res.status(400).json({ message: "Ce soin pour ce patient existe déjà." });
      return;
    }

    const newCare = {
      ...care,
      performed_at: careDate,
      invoice_generated: 1,
      invoice_paid: 0,
      invoice_send: 0,
      customer_id: id,
      practitioner_id: practitioner_id || req.user.alias,
    };

    const [response] = await Care.insert(newCare, id);

    if (response.insertId) {
      const [[getInvoice]] = await Care.displayInvoice(response.insertId);

      if (getInvoice) {
        return res.status(200).json({
          message: "Le soin a été ajouté avec succès.",
          response: getInvoice,
        });
      }
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

const getTotalCareThisMonth = async (req, res, next) => {
  try {
    const [[response]] = await Care.getTotalCareThisMonth();

    if (response) {
      return res.status(200).json({
        message: "Total des soins trouvés ce mois-ci.",
        response: response,
      });
    }

    res.status(404).json({
      message: "Problème lors de la récupération.",
      response,
    });
  } catch (error) {
    next(error);
  }
};

const getTotalCareByYear = async (req, res, next) => {
  const { year } = req.params;
  try {
    const [[response]] = await Care.getTotalCareByYear(year);

    if (response) {
      return res.status(200).json({
        message: "Total des soins récupérés avec succès.",
        response,
      });
    }
    return res.status(400).json({
      message: "Aucun soin trouvé pour cette année.",
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.body;
  try {
    const [response] = await Care.delete(id);

    if (response.affectedRows) {
      res.json({ message: "Soin supprimé." });
      return;
    }
    res.status(400).json({
      message: "Ce soin n'existe pas.",
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAll,
  getOneCare,
  getBySearch,
  create,
  update,
  getTotalCareThisMonth,
  getTotalCareByYear,
  remove,
};
