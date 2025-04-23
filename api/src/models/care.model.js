import pool from "../config/db.js";

class Care {
    
    /** 
	 * Method to find a Care by Patient and date before add new one
	 * 
	 * @param {number} id - The ID of the patient
	 * @param {date}   performed_at - The date of the care
	 * 
	 * @returns - A promise that resolves with the result of the SQL query
	 * Object contains: care id, care performed_at, patient title, patient firstname, patient lastname,
	 */
	static async findCare(id, performed_at) {
		const SELECT_CARE = `SELECT
                                care.id,  care.performed_at,
                                c.title, c.firstname, c.lastname
                            FROM
                                care
                            LEFT JOIN customer c ON
                                care.customer_id = c.id
                            WHERE
                                DATE(care.performed_at) = ? AND c.id = ?`;

		return await pool.execute(SELECT_CARE, [performed_at, id]);
	}

    /** 
	 * Method to count all care records
	 * 
	 * @returns - A promise that resolves with the result the total number of cares
	 * Example: {total: 42}
	 */
	static async countAll() {
		const COUNT = `SELECT
                           COUNT(*) AS total
                       FROM
                           care`;

		return await pool.query(COUNT);
	}

    /**
     * Method to get all care records with their practitioner and patient info
     * 
     * @param {number} offset - The number of records to skip
     * @param {number} limit - The maximum number of records to retrieve
     * 
     * @returns - A promise that resolves with an array of care objects
     * Each object contains: care (object), practitioner (object), patient (object)
     */
	static async getAll(offset, limit) {
		const SELECT_ALL = `SELECT
                                JSON_OBJECT(
                                    'id', care.id,
                                    'type', care.type,
                                    'performed_at', care.performed_at,
                                    'invoice_send', care.invoice_send,
                                    'invoice_paid', care.invoice_paid
                                ) AS care,
                                JSON_OBJECT('id', p.id, 'alias', p.alias) AS practitioner,
                                JSON_OBJECT(
                                    'id', c.id,
                                    'title', c.title,
                                    'firstname', c.firstname,
                                    'lastname', c.lastname
                                ) AS patient
                            FROM
                                care
                            LEFT JOIN practitioner p ON
                                care.practitioner_id = p.id
                            LEFT JOIN customer c ON
                                care.customer_id = c.id
                            ORDER BY CASE WHEN
                                care.invoice_paid = 0 AND care.invoice_send = 1 THEN 1 WHEN care.invoice_send = 1 THEN 2 ELSE 3
                            END,
                            care.performed_at
                            DESC
                            LIMIT ? OFFSET ?`;

		return await pool.execute(SELECT_ALL, [limit, offset]);
	}

    /**
     * Method to display care info for the PDF generator
     * 
     * @param {number} id - The id of the care
     * 
     * @returns - A promise that resolves with a care object
     * Object contains: care info and patient info
     */
	static async getInvoiceData(id) {
		const SELECT_CARE = `SELECT
                                care.id AS care_id, care.performed_at, care.price, care.type, care.complements, care.invoice_url,
                                c.id AS customer_id, c.title, c.lastname, c.firstname
                            FROM
                                care
                            LEFT JOIN customer c ON
                                care.customer_id = c.id
                            WHERE
                                care.id = ?;`;

		return await pool.execute(SELECT_CARE, [id]);
	}

	/** 
	 * Method to get one care for a patient
	 * 
	 * @param {number} patientID - The patient ID
	 * @param {number} id - The care ID
	 * @param {number} guardian_id - Optional guardian ID to get the care for the guardian
	 * 
	 * @returns - A promise that resolves with the result of the SQL query. 
	 */
	static async getOne({ patientId, id, guardian_id }) {
		const SELECT_CARE = `SELECT
                                c.id, c.title, c.lastname, c.firstname,
                                JSON_OBJECT(
                                    'details',
                                    JSON_OBJECT(
                                        'id', g.id,
                                        'customer_id', g.customer_id,
                                        'title', gc.title,
                                        'firstname', gc.firstname,
                                        'lastname', gc.lastname,
                                        'phone', gc.phone,
                                        'email', g.email
                                    ),
                                    'relationship', g.relationship,
                                    'company', g.company,
                                    'address',
                                    JSON_OBJECT(
                                        'street', g.street, 'city', g.city, 'zip_code', g.zip_code
                                    )
                                ) AS guardian,
                                JSON_OBJECT(
                                    'id', care.id,
                                    'performed_at', care.performed_at,
                                    'price', care.price,
                                    'type', care.type,
                                    'complements', care.complements,
                                    'invoice',
                                    JSON_OBJECT(
                                        'invoice_generated', care.invoice_generated,
                                        'invoice_paid', care.invoice_paid,
                                        'invoice_send', care.invoice_send,
                                        'invoice_url', care.invoice_url
                                    )
                                ) AS care,
                                p.alias AS practitioner,
                                p.id AS practitioner_id
                            FROM
                                care
                            LEFT JOIN customer c ON
                                c.id = care.customer_id
                            LEFT JOIN practitioner p ON
                                care.practitioner_id = p.id
                            LEFT JOIN guardian g ON
                                c.guardian_id = g.customer_id
                            LEFT JOIN customer gc ON
                                c.guardian_id = gc.id
                            WHERE
                                c.id = ? AND c.is_patient = 1 AND care.id = ?`;
                            
        const params = [patientId, id];
			
		if (guardian_id) {
			SELECT_CARE += "AND c.guardian_id = ?";
			params.push(guardian_id);
		}

		return await pool.execute(SELECT_CARE, params);
	}

    /**
	 * Method to insert a new care
	 * 
	 * @param {date} care.performed_at - The date of the care
	 * @param {string} care.type - The type of the care
	 * @param {string} care.complements - The optional complements
	 * @param {number} care.price - The price
	 * @param {number} care.invoice_paid - The invoice paid statuts
	 * @param {number} care.invoice_send - The invoice send statuts
	 * @param {number} care.customer_id - The patient id who's received the care
	 * @param {number} care.practitioner_id - The practitioner who's performing the care
	 *
	 * @returns - A promise that resolves when the care is successfully added to the database
	 */
	static async insert(care) {
		const INSERT_CARE = `INSERT INTO care(
                                performed_at,
                                practitioner_id,
                                customer_id,
                                type,
                                complements,
                                price,
                                invoice_paid,
                                invoice_send
                            )
                            VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
                            
        const params = [
            care.performed_at,
            care.practitioner_id,
            care.customer_id,
            care.type,
            care.complements,
            care.price,
            care.invoice_paid,
            care.invoice_send,
            ];

		return await pool.execute(INSERT_CARE, params);
	}

	/**
	 * Method to find specific care by firstname and lastname of the patient, type, date
	 * 
	 * @param {string} search - The search
	 * 
	 * @returns - A promise that resolves the result of the search
	 */
	static async findBySearch(search) {
		const SELECT_ALL = `SELECT
                                care.id, care.performed_at, care.type,
                                c.title, c.firstname, c.lastname, c.id AS patient_id
                            FROM
                                care
                            LEFT JOIN customer c ON
                                care.customer_id = c.id
                            WHERE
                                DATE_FORMAT(care.performed_at, '%d-%m-%Y') LIKE
                            REPLACE
                                (?, "/", "-") OR care.type LIKE ? OR CONCAT(firstname, ' ', lastname) LIKE ?
                            ORDER BY
                                c.lastname,
                                care.performed_at
                            DESC
                            LIMIT 5`;

		return await pool.execute(SELECT_ALL, [search, search, search]);
	}

	/**
	 * Method to update care
	 * 
	 * @param {number} care.id - The id of the care to update
	 * @param {date} care.performed_at - The date of the care
	 * @param {string} care.type - The type of the care
	 * @param {string} care.complements - The optional complements
	 * @param {number} care.price - The price
	 * @param {number} care.invoice_paid - The invoice paid statuts
	 * @param {number} care.invoice_send - The invoice send statuts
	 * @param {number} care.customer_id - The patient id who's received the care
	 * @param {number} care.practitioner_id - The practitioner who's performing the care
	 *
	 * @returns - A promise that resolves when the patient is successfully updated to the database
	 */
	static async update(care) {
		const UPDATE_CARE = `UPDATE
                                 care
                             SET
                                 performed_at = ?,
                                 price = ?,
                                 TYPE = ?,
                                 complements = ?,
                                 practitioner_id = ?,
                                 invoice_paid = ?,
                                 invoice_send = ?
                             WHERE
                                 id = ?`;

		const params = [
				care.performed_at,
				care.price,
				care.type,
				care.complements,
				care.practitioner_id,
				care.invoice_paid,
				care.invoice_send,
				care.id,
			  ];

		return await pool.execute(UPDATE_CARE, params);
	}
	
	
	/** 
	 * Updates the invoice URL with a specific care ID
	 * 
	 * @param {number} id - The ID of the care for wich the invoice URL need to be updated
	 * @param {string} invoice_url - The URL of the generated invoice
	 * 
	 * @returns - A promise that resolves with the result of the SQL query, 
	 * if update is succesfull, the promise resolves to an array containing the result
	 */
	static async updateInvoiceURL({ id, invoice_url }) {
	    
		const UPDATE_CARE = `UPDATE 
		                        care 
		                     SET 
		                        invoice_url = ?
		                     WHERE id = ? `;

		return await pool.execute(UPDATE_CARE, [invoice_url, id]);
	}
	
	/** 
	 * Updates the invoice generated status with a specific care ID
	 * 
	 * @param {number} id - The ID of the care for wich the invoice status need to be set to 1
	 * @param {number} invoice_generated - 1 for generated else 0
	 * 
	 * @returns - A promise that resolves with the result of the SQL query, 
	 * if update is succesfull, the promise resolves to an array containing the result
	 */
	static async updateInvoiceStatus({ id, invoice_generated }) {
		const UPDATE_CARE = `UPDATE care SET invoice_generated = ? WHERE id = ? `;

		return await pool.execute(UPDATE_CARE, [invoice_generated, id]);
	}

	/**
	 * Method to get the total of care, and paid or not, for this month
	 * 
	 * @returns - A promise that resolves with the result of the SQL query
	 */
	static async getTotalCareThisMonth() {
		const COUNT_ALL = `SELECT
                                COUNT(id) AS total_care,
                                IFNULL(
                                    SUM(
                                        CASE WHEN invoice_paid = 1 THEN price ELSE 0
                                    END
                                ),
                                0
                            ) AS total_revenue_paid,
                            SUM(care.price) AS total_revenue_estimated
                            FROM
                                care
                            WHERE
                                performed_at BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00') AND DATE_FORMAT(
                                    LAST_DAY(NOW()),
                                    '%Y-%m-%d 23:59:59')`;

		return await pool.query(COUNT_ALL);
	}

	/**
	 * Method to get the total of care by month and year
	 * Aggregates care data for each monch in the fiven year
	 * 
	 * @returns - A promise that resolves with the result of the SQL query
	 */
	static async getTotalCareByYear(year) {
		const COUNT_BY_YEAR = `SELECT
                                    YEAR,
                                    JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                            'month',MONTH,
                                            'total_entries',total_entries,
                                            'total_revenue_paid',total_revenue_paid,
                                            'total_revenue_estimated',total_revenue_estimated
                                        )
                                    ) AS months
                                FROM
                                    (
                                    SELECT
                                        YEAR(performed_at) AS YEAR,
                                        MONTH(performed_at) AS MONTH,
                                        COUNT(id) AS total_entries,
                                        IFNULL(
                                            SUM(
                                                CASE WHEN invoice_paid = 1 THEN price ELSE 0
                                            END
                                        ),
                                        0
                                ) AS total_revenue_paid,
                                IFNULL(
                                    SUM(
                                        CASE WHEN invoice_paid = 0 THEN price ELSE 0
                                    END
                                ),
                                0
                                ) AS total_revenue_estimated
                                FROM
                                    care
                                WHERE
                                    YEAR(performed_at) = ? AND MONTH(performed_at) != MONTH(CURDATE())
                                GROUP BY
                                    YEAR(performed_at),
                                    MONTH(performed_at)
                                ORDER BY
                                    MONTH
                                DESC
                                    ) AS DATA
                                GROUP BY
                                    YEAR
                                ORDER BY
                                    YEAR
                                DESC
                                    ;`;

		return await pool.execute(COUNT_BY_YEAR, [year]);
	}

	/**
	 * Method to delete care by id
	 * 
	 * @param {number} id - The id of care
	 * 
	 * @returns - A promise that resolves when the care is successfully deleted
	 */
	static async delete(id) {
		const DELETE_CARE = "DELETE FROM care WHERE id = ?";
		
		return await pool.execute(DELETE_CARE, [id]);
	}
}

export default Care;
