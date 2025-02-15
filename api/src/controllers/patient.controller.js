import pool from "../config/db.js";

import Patient from "../models/patient.model.js";
import Address from "../models/address.model.js";
import Care from "../models/care.model.js";
import Guardian from "../models/guardian.model.js";
import RetirementHome from "../models/retirement_home.model.js";

const getAll = async (req, res, next) => {
  try {
    const [response] = await Patient.findAllWithLatestCare();

    if (response.length) {
      return res.status(200).json({
        message: "Patients récupérés.",
        response,
      });
    }
    return res.status(400).json({
      message: "Aucun patients récupérés.",
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  // une seule requete
  const { id } = req.params;

  try {
    const [[patient]] = await Patient.getOneByID(id);
    const [care] = await Care.getAllForPatient(id);

    if (!patient) {
      res.status(400).json({
        message: "Le patient recherché n'a pas été trouvé.",
      });
      return;
    }

    if (!care) {
      res.status(400).json({
        message: "Aucun soins trouvés pour ce patient.",
        response: patient,
      });
      return;
    }

    const response = {
      patient,
      care,
    };

    res.status(200).json({
      message: "Patient trouvé avec succès.",
      response,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const add = async (req, res, next) => {
  // validation des champs
  // const errors = validationResult(req);

  const { patient_detail, guardian_detail, guardian_address, retirement_home } =
    req.body;

  let connection = null;
  let guardianID = null;
  let retirementHomeID = null;

  /*  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Erreur lors de la validation du formulaire.",
      errors: errors.array(),
    });*/

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [[response_patient]] = await Patient.findPatient(patient_detail);

    if (response_patient) {
      return res.status(400).json({ message: "Le patient existe déjà." });
    }

    const [[response_guardian]] = await Guardian.findGuardian(guardian_detail);

    if (response_guardian) {
      guardianID = response_guardian.id;
    }

    if (!response_guardian) {
      const [response_address] = await Address.insertAddress(connection, {
        ...guardian_address,
        floor: guardian_address.floor || null,
        complements: guardian_address.complements || null,
      });

      if (response_address.insertId) {
        const [guardian] = await Guardian.insert(connection, {
          ...guardian_detail,
          address_id: response_address.insertId,
        });

        if (guardian.insertId) {
          guardianID = guardian.insertId;
        } else {
          return res.status(400).json({
            message: "Problème lors de l'ajout du tuteur.",
          });
        }
      } else {
        return res.status(400).json({
          message: "Problème lors de l'ajout de l'adresse du tuteur.",
        });
      }
    }

    if (retirement_home) {
      const [[response_rh]] = await RetirementHome.findRh(retirement_home);

      if (!response_rh) {
        return res
          .status(400)
          .json({ message: "EHPAD manquante ou n'existe pas." });
      }
      retirementHomeID = response_rh.id;
    }

    await Patient.insert(connection, {
      ...patient_detail,
      user_id: req.user.id,
      guardian_id: guardianID,
      retirement_home_id: retirementHomeID,
    });

    // patient.insertID verification
    await connection.commit();
    res.status(201).json({ message: "Patient ajouté." });
  } catch (error) {
    if (connection) await connection.rollback();
    console.log(error.message);
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

const remove = async (req, res, next) => {
  const { id } = req.body;
  try {
    const [response] = await Patient.delete(id);
    if (response.affectedRows) {
      res.json({ message: "Patient supprimé." });
      return;
    }
    res.status(400).json({
      message: "Ce patient n'existe pas.",
    });
  } catch (error) {
    next(error);
  }
};

export { getAll, getOne, add, remove };
