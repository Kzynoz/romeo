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
	
	/** 
	 * Method to find a guardian by their email (and optionnaly token).
	 * Used for guardian registration or authentication.
	 * (Token It is not yet implemented in the front-end (V2))
	 * 
	 * @param {string} email - The email of the guardian to registrate
	 * @param {string} token - Email of the practitioner to registrate
	 *  
	 * @returns - A promise that resolves with the result of the SQL query
	 */
	static async findGuardianByEmail(email, token = null) {
		let SELECT_GUARDIAN = `SELECT
								    c.id,
								    c.title,
								    c.firstname,
								    c.lastname,
								    g.email,
								    g.token,
								    g.password
								FROM
								    customer c
								LEFT JOIN guardian g ON
								    c.id = g.customer_id
								WHERE
								    g.email = ? AND is_patient = '0'`;

		const params = [email];
		
		// If token is provided, add the condition for token
		if (token) {
			SELECT_GUARDIAN += " AND g.token = ?";
			params.push(token);
		}

		return await pool.execute(SELECT_GUARDIAN, params);
	}
	
	/** 
	 * Method to register a guardian on their first connection with a custom URL.
	 * Guardian set is own password
	 * (It is not yet implemented in the front-end (V2))
	 * 
	 * @param {object} connection - The database connection object
	 * @param {number} id - The id of the guardian to update
	 * @param {string} token - The token
	 * @param {string} password - The hashed password of the guadian
	 * 
	 * @returns - A promise that resolves with the result of the SQL query
	 */
	static async registerGuardian(connection, { id, token, password }) {
		const REGISTER_GUARDIAN = `UPDATE
								       customer c
								   JOIN guardian g ON
								       c.id = g.customer_id
								   SET
								       g.password = ?
								   WHERE
								       c.id = ? AND g.token = ?`;

		return await connection.execute(REGISTER_GUARDIAN, [
			password,
			id,
			token,
		]);
	}


/*
 * *******************************************************************************************************************************************
*/
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
