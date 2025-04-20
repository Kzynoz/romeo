import pool from "../config/db.js";

class Care {
	static async findCare(id, performed_at) {
		const SELECT_CARE = `SELECT care.id, c.title, c.firstname, c.lastname, care.performed_at 
                         FROM care
                         LEFT JOIN customer c ON care.customer_id = c.id
                         WHERE DATE(care.performed_at) = ? AND c.id = ?`;

		return await pool.execute(SELECT_CARE, [performed_at, id]);
	}

	static async countAll() {
		const COUNT = `SELECT COUNT(care.id) AS total 
                         FROM care`;

		return await pool.query(COUNT);
	}

	static async getAll(offset, limit) {
		const SELECT_ALL = `SELECT JSON_OBJECT (
                        	'id',care.id,
                            'type',care.type,
                        	'performed_at',care.performed_at,
                        	'invoice_send', care.invoice_send,
                        	'invoice_paid', care.invoice_paid) AS care,
                              JSON_OBJECT (
                              'id',p.id,
                              'alias',p.alias) AS practitioner,
                              JSON_OBJECT (
                              'id',c.id,
                              'title',c.title,
                              'firstname', c.firstname,
                              'lastname',c.lastname) AS patient
                        FROM care
                        LEFT JOIN practitioner p 
                            ON care.practitioner_id = p.id
                        LEFT JOIN customer c 
                            ON  care.customer_id = c.id
                        ORDER BY 
                            CASE 
                                WHEN care.invoice_paid = 0 AND care.invoice_send = 1 THEN 1
                                WHEN care.invoice_send = 1 THEN 2
                                ELSE 3
                            END,
                            care.performed_at DESC
                        LIMIT ?
                        OFFSET ?`;

		return await pool.execute(SELECT_ALL, [limit, offset]);
	}

	static async displayInvoice(id) {
		const SELECT_CARE = `SELECT
                          c.id,
                          c.title,
                          c.lastname,
                          c.firstname,
                          care.id AS care_id,
                          care.performed_at,
                          care.price,
                          care.type,
                          care.complements,
                          care.invoice_url
                        FROM customer c
                        LEFT JOIN care ON care.customer_id = c.id
                        WHERE care.id = ?`;

		return await pool.execute(SELECT_CARE, [id]);
	}

	static async getOne({ patientId, id, guardian_id }) {
		const SELECT_CARE = `SELECT
                          c.id,
                          c.title,
                          c.lastname,
                          c.firstname,
                          JSON_OBJECT(
                          	'details', JSON_OBJECT(
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
                            'address', JSON_OBJECT(
                            	'street', g.street,
                                'city', g.city,
                                'zip_code', g.zip_code
                                )
                         ) AS guardian,
                         JSON_OBJECT(
                            'id', care.id,
                            'performed_at', care.performed_at,
                            'price', care.price,
                            'type',care.type,
                            'complements',care.complements,
                            'invoice', JSON_OBJECT (
                            	'invoice_generated',care.invoice_generated,
                                'invoice_paid',care.invoice_paid,
                                'invoice_send',care.invoice_send,
                                'invoice_url',care.invoice_url
                            	)
                        ) AS care,
                        p.alias AS practitioner,
                        p.id AS practitioner_id
                        FROM customer c
                        LEFT JOIN care ON care.customer_id = c.id
                        LEFT JOIN practitioner p ON care.practitioner_id = p.id
                        LEFT JOIN guardian g ON c.guardian_id = g.customer_id 
                        LEFT JOIN customer gc ON c.guardian_id = gc.id
                        WHERE c.id = ? 
                        AND c.is_patient = 1
                        AND care.id = ?
                        ${guardian_id ? "AND c.guardian_id = ?" : ""};`;

		const params = guardian_id ? [patientId, id, guardian_id] : [patientId, id];

		return await pool.execute(SELECT_CARE, params);
	}

	static async insert({
		performed_at,
		type,
		complements = null,
		price,
		invoice_paid,
		invoice_send,
		customer_id,
		practitioner_id,
	}) {
		const INSERT_CARE = `INSERT INTO care 
                         (performed_at, practitioner_id, customer_id, type,complements, price, invoice_paid, invoice_send) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

		return await pool.execute(INSERT_CARE, [
			performed_at,
			practitioner_id,
			customer_id,
			type,
			complements,
			price,
			invoice_paid,
			invoice_send,
		]);
	}

	static async findBySearch(search) {
		const SELECT_ALL = `SELECT care.id, care.performed_at, care.type, c.title, c.firstname, c.lastname, c.id AS patient_id 
                        FROM care 
                        LEFT JOIN customer c ON care.customer_id = c.id
                        WHERE DATE_FORMAT(care.performed_at, '%d-%m-%Y') LIKE REPLACE(?, "/", "-") 
                        OR care.type LIKE ?
                        OR CONCAT(firstname, ' ', lastname) LIKE ?
                        ORDER BY c.lastname, care.performed_at DESC
                        LIMIT 5`;

		return await pool.execute(SELECT_ALL, [search, search, search]);
	}

	static async update({
		id,
		performed_at,
		practitioner_id,
		complements,
		price,
		type,
		invoice_paid,
		invoice_send,
		invoice_url,
	}) {
		const UPDATE_CARE = `UPDATE care 
                          SET performed_at = ?, 
                          price = ?, 
                          type = ?, 
                          complements = ?, 
                          practitioner_id = ?,
                          invoice_paid = ?,
                          invoice_send = ?
                          ${invoice_url ? ", invoice_url = ?" : ""}
                         WHERE id = ? `;

		const params = invoice_url
			? [
					performed_at,
					price,
					type,
					complements,
					practitioner_id,
					invoice_paid,
					invoice_send,
					invoice_url,
					id,
			  ]
			: [
					performed_at,
					price,
					type,
					complements,
					practitioner_id,
					invoice_paid,
					invoice_send,
					id,
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
	    
		const UPDATE_CARE = `UPDATE care SET invoice_url = ? WHERE id = ? `;

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
	    console.log('id', id, "invoice_generated", invoice_generated);
	    
		const UPDATE_CARE = `UPDATE care SET invoice_generated = ? WHERE id = ? `;

		return await pool.execute(UPDATE_CARE, [invoice_generated, id]);
	}

	// à stocker dans la BDD
	static async getTotalCareThisMonth() {
		const COUNT_ALL = `SELECT count(id) as total_care,
                          IFNULL(SUM(CASE WHEN invoice_paid = 1 THEN price ELSE 0 END), 0) AS total_revenue_paid,
                          SUM(care.price) AS total_revenue_estimated
                        FROM care 
                        WHERE performed_at BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00') 
                        AND DATE_FORMAT(LAST_DAY(NOW()), '%Y-%m-%d 23:59:59')`;

		return await pool.query(COUNT_ALL);
	}

	// à stocker dans la bdd
	static async getTotalCareByYear(year) {
		const COUNT_BY_YEAR = `SELECT year,
                        JSON_ARRAYAGG(
                          JSON_OBJECT(
                              'month', month,
                              'total_entries', total_entries,
                              'total_revenue_paid', total_revenue_paid,
                              'total_revenue_estimated', total_revenue_estimated
                            )
                          ) AS months
                        FROM (
                          SELECT 
                              YEAR(performed_at) AS year,
                              MONTH(performed_at) AS month,
                              COUNT(id) AS total_entries,
                              IFNULL(SUM(CASE WHEN invoice_paid = 1 THEN price ELSE 0 END), 0) AS total_revenue_paid,
                              IFNULL(SUM(CASE WHEN invoice_paid = 0 THEN price ELSE 0 END), 0) AS total_revenue_estimated
                          FROM care
                          WHERE YEAR(performed_at) = ?
                          AND MONTH(performed_at) != MONTH(CURDATE())
                          GROUP BY YEAR(performed_at), MONTH(performed_at)
                          ORDER BY month DESC
                        ) AS data
                        GROUP BY year
                        ORDER BY year DESC;`;

		return await pool.execute(COUNT_BY_YEAR, [year]);
	}

	static async delete(id) {
		const DELETE_CARE = "DELETE FROM care WHERE id = ?";
		return await pool.execute(DELETE_CARE, [id]);
	}
}

export default Care;
