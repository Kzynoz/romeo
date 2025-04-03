import pool from "../config/db.js";

class Customer {
	static async findCustomerGuardian({ title, firstname, lastname }) {
		const SELECT_CUSTOMER = `SELECT id, title, firstname, lastname 
                             FROM customer 
							 WHERE title = ?
                             AND firstname = ? 
                             AND lastname = ? 
                             AND is_patient = '0'`;

		return await pool.execute(SELECT_CUSTOMER, [title, firstname, lastname]);
	}

	static async insert(
		{
			title,
			firstname,
			lastname,
			phone = null,
			is_patient = 0,
			guardian_id = null,
			practitioner_id = null,
			retirement_home_id = null,
		},
		connection = pool
	) {
		const INSERT_CUSTOMER = `INSERT INTO customer 
                             (title,firstname,lastname,phone,is_patient,guardian_id,practitioner_id,retirement_home_id) 
                             VALUES (?,?,?,?,?,?,?,?)`;

		return await connection.execute(INSERT_CUSTOMER, [
			title,
			firstname,
			lastname,
			phone,
			is_patient,
			guardian_id,
			practitioner_id,
			retirement_home_id,
		]);
	}

	static async delete(id, isPatient) {
		const DELETE_CUSTOMER =
			"DELETE FROM customer WHERE id = ? AND is_patient= ?";
		return await pool.execute(DELETE_CUSTOMER, [id, isPatient]);
	}

	static async updateIsGuardian(
		{ title, firstname, lastname, phone },
		id,
		connection = pool
	) {
		const UPDATE_GUARDIAN = `UPDATE customer 
                             SET title = ?, 
                             firstname = ?, 
                             lastname = ?, 
                             phone = ?
                             WHERE id = ? AND is_patient = '0'`;

		return await connection.execute(UPDATE_GUARDIAN, [
			title,
			firstname,
			lastname,
			phone,
			id,
		]);
	}

	static async updateIsPatient({
		id,
		title,
		firstname,
		lastname,
		guardian_id,
		retirement_home_id,
	}) {
		const UPDATE_PATIENT = `UPDATE customer 
                            SET title = ?, 
                            firstname = ?, 
                            lastname = ?, 
                            guardian_id = ?, 
                            retirement_home_id = ?
                            WHERE id = ? 
                            AND is_patient = '1'`;

		return await pool.execute(UPDATE_PATIENT, [
			title,
			firstname,
			lastname,
			guardian_id,
			retirement_home_id,
			id,
		]);
	}

	static async findBySearch(search, isPatient = 0) {
		console.log(search);
		const SELECT_ALL = `SELECT id, title, firstname, lastname, is_patient 
                        FROM customer 
                        WHERE CONCAT(firstname, ' ', lastname) LIKE ? 
                        AND is_patient = ${isPatient}
						ORDER BY lastname
						LIMIT 5`;

		return await pool.execute(SELECT_ALL, [search]);
	}
}

export default Customer;
