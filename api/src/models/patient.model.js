import pool from "../config/db.js";

class Patient {
	static async findPatient({ title, firstname, lastname }) {
		const SELECT_PATIENT = `SELECT id 
                            FROM customer 
                            WHERE title = ? 
                            AND firstname = ? 
                            AND lastname = ? 
                            AND is_patient = '1'`;

		return await pool.execute(SELECT_PATIENT, [title, firstname, lastname]);
	}

	static async getOne(id) {
		const SELECT_PATIENT = `SELECT
                              c.id,
                              c.title,
                              c.lastname,
                              c.firstname,
                              JSON_OBJECT(
                                  'id', rh.id,
                                  'name', rh.name
                              ) AS retirement_home,
                              JSON_OBJECT(
                                  'id', gc.id,
                                  'title', gc.title,
                                  'firstname', gc.firstname,
                                  'lastname', gc.lastname,
                                  'relationship', g.relationship,
                                  'phone', gc.phone,
                                  'email', g.email,
                                  'company', g.company,
                                  'address', 
                                  CASE 
                                      WHEN g.street IS NULL AND g.city IS NULL AND g.zip_code IS NULL 
                                      THEN NULL 
                                      ELSE JSON_OBJECT(
                                          'street', g.street,
                                          'city', g.city,
                                          'zip_code', g.zip_code
                                      ) 
                                  END
                              ) AS guardian,
                            (
                                SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'id', sorted_care.id,
                                        'performed_at', sorted_care.performed_at,
                                        'invoice_paid', sorted_care.invoice_paid,
                                        'invoice_send', sorted_care.invoice_send
                                    )
                                )
                                FROM (
                                    SELECT care.id, care.performed_at, care.invoice_paid, care.invoice_send
                                    FROM care
                                    WHERE care.customer_id = c.id
                                    ORDER BY care.invoice_paid ASC, 
                                             care.invoice_send ASC,
                                             care.performed_at DESC
                                ) AS sorted_care
                            ) AS all_cares,
                            (
                              SELECT COUNT(care.id)
                              FROM care
                              WHERE care.customer_id = c.id
                            ) AS care_count
                            FROM customer c
                            LEFT JOIN guardian g ON c.guardian_id = g.customer_id 
                            LEFT JOIN retirement_home rh ON c.retirement_home_id = rh.id
                            LEFT JOIN customer gc ON c.guardian_id = gc.id
                            WHERE c.is_patient = 1 
                            AND c.id = ?;`;

		return await pool.query(SELECT_PATIENT, [id]);
	}

	static async gettAllWithLatestCare() {
		const SELECT_ALL = `SELECT
                          c.id,
                          c.title,
                          c.lastname,
                          c.firstname,
                          JSON_OBJECT(
                              'title', gc.title,
                              'firstname', gc.firstname,
                              'lastname', gc.lastname,
                              'relationship', g.relationship,
                              'company', g.company
                          ) AS guardian,
                          CASE 
                              WHEN care.performed_at IS NOT NULL THEN JSON_OBJECT(
                                  'performed_at', care.performed_at,
                                  'invoice_paid', care.invoice_paid,
                                  'invoice_send', care.invoice_send
                              )
                              ELSE NULL
                          END AS latest_care
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

	static async insert({
		title,
		firstname,
		lastname,
		phone,
		is_patient,
		guardian_id = null,
		practitioner_id,
		retirement_home_id = null,
	}) {
		const INSERT_PATIENT = `INSERT INTO customer 
                            (title,firstname,lastname,is_patient,guardian_id,phone,practitioner_id,retirement_home_id) 
                            VALUES (?,?,?,?,?,?,?,?)`;

		return await pool.execute(INSERT_PATIENT, [
			title,
			firstname,
			lastname,
			is_patient,
			guardian_id,
			phone,
			practitioner_id,
			retirement_home_id,
		]);
	}

	static async delete(id) {
		const DELETE_PATIENT = "DELETE FROM patient WHERE id = ?";
		return await pool.execute(DELETE_PATIENT, [id]);
	}
}

export default Patient;
