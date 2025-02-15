import pool from "../config/db.js";

class Patient {
  static async findPatient({ title, first_name, last_name }) {
    const SELECT_PATIENT =
      "SELECT id, title FROM patient WHERE title = ? AND first_name = ? AND last_name = ?";
    return await pool.execute(SELECT_PATIENT, [title, first_name, last_name]);
  }

  static async getOneByID(id) {
    const SELECT_PATIENT =
      "SELECT patient.id, patient.title, patient.first_name, patient.last_name, patient.phone, patient.email, JSON_OBJECT('id', retirement_home.id, 'name', retirement_home.name) AS retirement_home, JSON_OBJECT('id', guardian.id, 'title', guardian.title, 'first_name', guardian.first_name, 'last_name', guardian.last_name, 'email', guardian.email) AS guardian FROM patient LEFT JOIN retirement_home ON retirement_home.id = patient.retirement_home_id LEFT JOIN guardian ON guardian.id = patient.guardian_id WHERE patient.id = ?";
    return await pool.query(SELECT_PATIENT, [id]);
  }

  static async findAllWithLatestCare() {
    const SELECT_ALL = `SELECT
                          c.id,
                          c.title,
                          c.lastname,
                          c.firstname,
                          JSON_OBJECT(
                          'title',gc.title,
                          'firstname',gc.firstname,
                          'lastname',gc.lastname,
                          'relationship',g.relationship,
                          'company',g.company
                          ) AS guardian,
                          IFNULL(
                              JSON_OBJECT(
                                  'performed_at', care.performed_at,
                                  'invoice_paid', care.invoice_paid,
                                  'invoice_send', care.invoice_send
                              ),
                              NULL
                          ) AS latest_care
                        FROM customer c
                        LEFT JOIN guardian g ON c.guardian_id = g.customer_id 
                        LEFT JOIN customer gc ON c.guardian_id = gc.id
                        LEFT JOIN care 
                            ON care.customer_id = c.id 
                            AND care.performed_at = (
                                SELECT MAX(their_care.performed_at)
                                FROM care their_care 
                                WHERE their_care.customer_id = c.id
                            )
                        WHERE c.is_patient = 1
                        ORDER BY care.invoice_paid DESC, care.invoice_send DESC;`;
    return await pool.query(SELECT_ALL);
  }

  static async insert(
    connection,
    {
      title,
      first_name,
      last_name,
      phone = null,
      email = null,
      user_id,
      guardian_id,
      retirement_home_id,
    }
  ) {
    const INSERT_PATIENT =
      "INSERT INTO patient (title,first_name,last_name,phone,email,guardian_id,user_id,retirement_home_id) VALUES (?,?,?,?,?,?,?,?)";
    return await connection.execute(INSERT_PATIENT, [
      title,
      first_name,
      last_name,
      phone,
      email,
      guardian_id,
      user_id,
      retirement_home_id,
    ]);
  }

  static async delete(id) {
    const DELETE_PATIENT = "DELETE FROM patient WHERE id = ?";
    return await pool.execute(DELETE_PATIENT, [id]);
  }
}

export default Patient;
