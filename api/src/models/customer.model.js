import pool from "../config/db.js";

class Customer {
	/**
	 * Method to insert a new guardian with a transaction
	 * 
	 * @param {string} title - The title of the guardian
	 * @param {string} firstname - The firstname of the guardian
	 * @param {string} lastname - The lastname of the guardian
	 * @param {number} phone - The optional phone number of the guardian
	 * @param {object} connection - The database connection object
	 *
	 * @returns - A promise that resolves when the guardian is successfully added to the database
	 */
	static async insertGuardian(
		{
			title,
			firstname,
			lastname,
			phone = null,
			isPatient,
		},
		connection = pool
	) {
		const INSERT_CUSTOMER = `INSERT INTO customer(
								    title,
								    firstname,
								    lastname,
								    phone,
								    is_patient
								)
								VALUES(?, ?, ?, ?, ?)`;

		return await connection.execute(INSERT_CUSTOMER, [
			title,
			firstname,
			lastname,
			phone,
			isPatient,
		]);
	}

	/**
	 * Method to delete customer by id
	 * 
	 * @param {number} id - The id of customer
	 * @param {number} isPatient - For delete patient (1) or guardian (0)
	 * 
	 * @returns - A promise that resolves when the customer is successfully deleted
	 */
	static async delete(id, isPatient) {
		const DELETE_CUSTOMER =	"DELETE FROM customer WHERE id = ? AND is_patient= ?";
		
		return await pool.execute(DELETE_CUSTOMER, [id, isPatient]);
	}

	/**
	 * Method to update guardian info
	 * 
	 * @param {string} title - The title of the guardian
	 * @param {string} firstname - The firstname of the guardian
	 * @param {string} lastname - The lastname of the guardian
	 * @param {number} phone - The optional phoone number of the guardian
	 * @param {number} id - The id of the customer (guardian) to update
	 * @param {object} connection - The database connection object
	 *
	 * @returns - A promise that resolves when the guardian is successfully updated to the database
	 */
	static async updateIsGuardian(
		{ title, firstname, lastname, phone },
		id,
		connection = pool
	) {
		const UPDATE_GUARDIAN = `UPDATE
								     customer
								 SET
								     title = ?,
								     firstname = ?,
								     lastname = ?,
								     phone = ?
								 WHERE
								     id = ? AND is_patient = '0'`;

		return await connection.execute(UPDATE_GUARDIAN, [
			title,
			firstname,
			lastname,
			phone,
			id,
		]);
	}
	
	/**
	 * Method to update patient info
	 * 
	 * @param {string} patient.title - The title of the patient
	 * @param {string} patient.firstname - The firstname of the patient
	 * @param {string} patient.lastname - The lastname of the patient
	 * @param {number} patient.guardian_id - The id of his guardian
	 * @param {number} patient.retirement_home_id - The id of the retirement home where the patient live
	 * @param {number} patient.id - The id of the patient to update
	 *
	 * @returns - A promise that resolves when the patient is successfully updated to the database
	 */
	static async updateIsPatient(patient) {
		const UPDATE_PATIENT = `UPDATE
								    customer
								SET
								    title = ?,
								    firstname = ?,
								    lastname = ?,
								    guardian_id = ?,
								    retirement_home_id = ?
								WHERE
								    id = ?`;
								    
		const params = [
			patient.title,
			patient.firstname,
			patient.lastname,
			patient.guardian_id,
			patient.retirement_home_id,
			patient.id
			]

		return await pool.execute(UPDATE_PATIENT, params);
	}
	

	/**
	 * Method to find specific customer by firstname and lastname
	 * 
	 * @param {string} search - The customer to search
	 * @param {number} isPatient - If for patient (1) or guardian (0) - Set at 0
	 * 
	 * @returns - A promise that resolves the result of the search
	 */
	static async findBySearch(search, isPatient = 0) {
		const SELECT_ALL = `SELECT
							    id, title, firstname, lastname, is_patient
							FROM
							    customer
							WHERE
							    CONCAT(firstname, ' ', lastname) LIKE ? AND is_patient = ?
							ORDER BY
							    lastname
							LIMIT 5`;

		return await pool.execute(SELECT_ALL, [search,isPatient]);
	}
	
	/** 
	 * Method to count all customer who are patients
	 * 
	 * @param {number} guardian_id - Optional guardian ID to count all patients associated with this guardian
	 * 
	 * @returns - A promise that resolves with the result of the count.
	 */
	static async countAll(guardian_id) {
	  const SQL = guardian_id ? "AND guardian_id = ?" : "";
	  
	  const COUNT = `SELECT 
						COUNT(customer.id) AS total 
                     FROM 
                    	customer
                     WHERE is_patient = 1 ${guardian_id ? SQL : ""}`;

		const params = guardian_id ? [guardian_id] : [];

		return await pool.execute(COUNT, params);
	}
	
	/** 
	 * Method to get all customers who are patient with the latest care their receive
	 * 
	 * @param {number} offset - The offset for pagination
	 * @param {number} limit - The limit for pagination
	 * @param {number} guardian_id - Optional guardian ID to get all patients associated with this guardian
	 * 
	 * @returns - A promise that resolves with the result of the SQL query. 
	 * Each patient object contains his details, latest care and retirement home
	 */
	static async getAllWithLatestCare({ offset, limit, guardian_id }) {
		const SQL = guardian_id ? "AND c.guardian_id = ?" : "";
		
		const SELECT_ALL = `SELECT
							    c.id, c.title, c.lastname, c.firstname,
							    JSON_OBJECT(
							        'title', gc.title,
							        'firstname', gc.firstname,
							        'lastname', gc.lastname,
							        'relationship', g.relationship,
							        'company', g.company
							    ) AS guardian,
							    CASE WHEN care.performed_at IS NOT NULL THEN JSON_OBJECT(
							        'performed_at', care.performed_at,
							        'invoice_paid', care.invoice_paid,
							        'invoice_send', care.invoice_send
							    ) ELSE NULL
							END AS latest_care
							FROM
							    customer c
							LEFT JOIN guardian g ON
							    c.guardian_id = g.customer_id
							LEFT JOIN customer gc ON
							    c.guardian_id = gc.id
							LEFT JOIN care ON care.customer_id = c.id AND care.performed_at =(
							    SELECT
							        MAX(their_care.performed_at)
							    FROM
							        care their_care
							    WHERE
							        their_care.customer_id = c.id
							)
							WHERE
							    c.is_patient = 1 ${guardian_id ? SQL : ""}
							ORDER BY
							    care.invoice_paid
							DESC
							    ,
							    care.invoice_send
							DESC
							LIMIT ? OFFSET ?`;
							
		const params = [limit,offset];

		if (guardian_id) {
			params.unshift(guardian_id);
		}

		return await pool.execute(SELECT_ALL, params);
	}
	
	/** 
	 * Method to get one customer who is patient with all the care he received
	 * 
	 * @param {number} offset - The offset for pagination
	 * @param {number} limit - The limit for pagination
	 * @param {number} id - The Id of the customer who's patient
	 * @param {number} guardian_id - Optional guardian ID to get the patient for the guardian
	 * 
	 * @returns - A promise that resolves with the result of the SQL query. 
	 */
	static async getOnePatient({ offset, limit, id, guardian_id }) {
		
		let SELECT_PATIENT = `SELECT
								    c.id, c.title, c.lastname, c.firstname,
								    JSON_OBJECT('id', rh.id, 'name', rh.name) AS retirement_home,
								    CASE
								    	WHEN gc.id IS NULL THEN
								    		NULL
								    	ELSE
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
								    		    JSON_OBJECT('street', g.street, 'city', g.city, 'zip_code', g.zip_code)
								    		) 
								    END AS guardian,
								    (
								    SELECT
								        JSON_ARRAYAGG(
								            JSON_OBJECT(
								                'id', care.id,
								                'performed_at', care.performed_at,
								                'type', care.type,
								                'invoice_paid', care.invoice_paid,
								                'invoice_send', care.invoice_send
								            )
								        )
								    FROM
								        (
								        SELECT
								            id, performed_at, invoice_paid, invoice_send, type
								        FROM
								            care
								        WHERE
								            care.customer_id = ?
								        ORDER BY
								            (
								                invoice_paid = 0 AND invoice_send = 1
								            )
								        DESC
								            ,
								            performed_at
								        DESC
								    LIMIT ? OFFSET ?
								    ) AS care
								) AS all_cares,(
								    SELECT
								        COUNT(id)
								    FROM
								        care
								    WHERE
								        customer_id = ?
								) AS care_count
								FROM
								    customer c
								LEFT JOIN guardian g ON
								    c.guardian_id = g.customer_id
								LEFT JOIN retirement_home rh ON
								    c.retirement_home_id = rh.id
								LEFT JOIN customer gc ON
								    c.guardian_id = gc.id
								WHERE
								    c.is_patient = 1 AND c.id = ?`;
                                
                                
    	const params = [id, limit, offset, id, id];
			
		if (guardian_id) {
			SELECT_PATIENT += " AND c.guardian_id = ?";
			params.push(guardian_id);
		}
			
		return await pool.execute(SELECT_PATIENT, params);
		
	}
	
	/**
	 * Method to find a customer who's patient based on their title, firtname and lastname
	 * 
	 * @param {string} title - The title of the patient
	 * @param {string} firstname - The first name of the patient
	 * @param {string} lastname - The lastname of the patient
	 * 
	 * @returns - A promise that resolves with the result id of the patient if they ecist
	 */
	static async findCustomer({ title, firstname, lastname, isPatient }) {
		const SELECT_PATIENT = `SELECT 
									id, title, firstname, lastname
                            	FROM
                            		customer 
                            	WHERE 
                            		title = ? AND firstname = ? AND lastname = ? AND is_patient = ?`;

		return await pool.execute(SELECT_PATIENT, [title, firstname, lastname, isPatient]);
	}
	
	/**
	 * Method to insert a new patient
	 * 
	 * @param {string} title - The title of the patient
	 * @param {string} firstname - The firstname of the patient
	 * @param {string} lastname - The lastname of the patient
	 * @param {number} is_patient - Number to know if it's a patient (1) or a guardian (0)
	 * @param {number} guardian_id - The id of his guardian, could be null
	 * @param {number} retirement_home_id - The id of the retirement home where the patient live, could be null
	 *
	 * @returns - A promise that resolves when the patient is successfully added to the database
	 */
	static async insertPatient(patient) {
		const INSERT_PATIENT = `INSERT INTO customer (
									title, 
									firstname, 
									lastname, 
									is_patient, 
									guardian_id, 
									retirement_home_id
								) 
                            VALUES (?, ?, ?, ?, ?, ?)`;
                            
        const params = [
        	patient.title,
        	patient.firstname,
        	patient.lastname,
        	patient.is_patient,
        	patient.guardian_id,
        	patient.retirement_home_id
        	]

		return await pool.execute(INSERT_PATIENT, params);
	}

}

export default Customer;
