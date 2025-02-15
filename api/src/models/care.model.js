import pool from "../config/db.js";

class Care {
  static async getAllForPatient(id) {
    const SELECT_CARE =
      "SELECT care.id, care.date, care.status, invoice.billing_status, invoice.date AS invoices_date, type.name FROM patient JOIN care ON care.patient_id = patient.id JOIN invoice ON care.id = invoice.care_id JOIN care_type ON care.id = care_type.care_id JOIN type ON type.id = care_type.type_id WHERE patient_id = ?";
    return await pool.execute(SELECT_CARE, [id]);
  }
}

export default Care;
