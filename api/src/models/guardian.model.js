import pool from "../config/db.js";

class Guardian {
    /** 
	 * Method to get one guardian with all thier patients assigned
	 * 
	 * @param {number} offset - The offset for pagination
	 * @param {number} limit - The limit for pagination
	 * @param {number} id - The Id of the customer who's patient
	 * 
	 * @returns - A promise that resolves with the result of the SQL query. 
	 */
	static async getOne({ offset, limit, id }) {
		const SELECT_GUARDIAN = `SELECT
                                    JSON_OBJECT(
                                        'details',
                                        JSON_OBJECT(
                                            'id', g.customer_id,
                                            'title', gc.title,
                                            'firstname', gc.firstname,
                                            'lastname', gc.lastname,
                                            'phone', gc.phone,
                                            'email', g.email
                                        ),
                                        'relationship', g.relationship,
                                        'company', g.company,
                                        'address',
                                        CASE WHEN g.street IS NULL OR g.city IS NULL OR g.zip_code IS NULL THEN JSON_OBJECT() ELSE JSON_OBJECT(
                                            'street', g.street,
                                            'city', g.city,
                                            'zip_code', g.zip_code
                                        )
                                        END) AS guardian,
                                    (
                                    SELECT
                                        COUNT(customer.id)
                                    FROM
                                        customer
                                    WHERE
                                        guardian_id = g.customer_id
                                ) AS guardianship_count,
                                (
                                    SELECT
                                        JSON_ARRAYAGG(
                                            JSON_OBJECT(
                                                'id', c.id,
                                                'title',  c.title,
                                                'firstname', c.firstname,
                                                'lastname', c.lastname,
                                                'retirement_home', rh.name
                                            )
                                        )
                                    FROM
                                        customer c
                                    LEFT JOIN retirement_home rh ON
                                        c.retirement_home_id = rh.id
                                    WHERE
                                        c.guardian_id = g.customer_id
                                    ORDER BY
                                        c.id ASC
                                    LIMIT ? OFFSET ?
                                ) AS patients
                                FROM
                                    guardian g
                                JOIN customer gc ON
                                    g.customer_id = gc.id
                                WHERE
                                    g.customer_id = ?`;

		return await pool.execute(SELECT_GUARDIAN, [limit, offset, id]);
	}

	/** 
	 * Method to count all guardian
	 * 
	 * @returns - A promise that resolves with the result of the count.
	 */
	static async countAll() {
		const COUNT = `SELECT
		                   COUNT(guardian.id) AS total 
                       FROM 
                          guardian`;

		return await pool.query(COUNT);
	}

	/** 
	 * Method to get all guardians with the number of patient the yhave
	 * 
	 * @param {number} offset - The offset for pagination
	 * @param {number} limit - The limit for pagination
	 * 
	 * @returns - A promise that resolves with the result of the SQL query. 
	 * Each guardian object contains their details and the number of assigned patients
	 */
	static async getAll({ offset, limit }) {
		const SELECT_ALL = `SELECT
                                c.id, c.title, c.firstname, c.lastname, c.phone,
                                g.email, g.relationship, g.company,
                                JSON_OBJECT(
                                    'street', g.street, 'city', g.city, 'zip_code', g.zip_code
                                ) AS address,
                                (
                                SELECT
                                    COUNT(c.id)
                                FROM
                                    customer c
                                WHERE
                                    c.guardian_id = g.customer_id
                            ) AS guardianship_count
                            FROM
                                guardian g
                            LEFT JOIN customer c ON
                                g.customer_id = c.id
                            ORDER BY
                                c.lastname ASC
                            LIMIT ? OFFSET ?`;

		return await pool.execute(SELECT_ALL, [limit, offset]);
	}

    /**
	 * Method to insert a new guardian
	 * 
	 * @param {string} guardian.relationship - The relationship status of the guardian
	 * @param {string} guardian.company - The optional company name
	 * @param {string} guardian.street - The optional street
	 * @param {string} guardian.city - The optional city
	 * @param {number} guardian.zip_code - The optional city
	 * @param {number} guardian.customer_id - The ID of the associated customer (basic identity details).
	 * @param {string} guardian.token - The token use for the guardian registration
	 * @param {string} guardian.email - The email
	 * @param {object} connection - The database connection object
	 *
	 * @returns - A promise that resolves when the guardian is successfully added to the database
	 */
	static async insert(guardian,connection) {
		const INSERT_GUARDIAN = `INSERT INTO guardian (
		                            customer_id,
		                            relationship,
		                            company,
		                            street,
		                            city,
		                            zip_code,
		                            email,
		                            token)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const params = [
            guardian.customer_id,
            guardian.relationship,
            guardian.company,
            guardian.street,
            guardian.city,
            guardian.zip_code,
            guardian.email,
            guardian.token
            ]

		return await connection.execute(INSERT_GUARDIAN, params);
	}

    /**
	 * Method to update a guardian
	 * 
	 * @param {string} guardian.relationship - The relationship status of the guardian
	 * @param {string} guardian.company - The optional company name
	 * @param {string} guardian.street - The optional street
	 * @param {string} guardian.city - The optional city
	 * @param {number} guardian.zip_code - The optional city
	 * @param {string} guardian.email - The email
	 * @param {number} id - The id of the guardian to update
	 * @param {object} connection - The database connection object
	 *
	 * @returns - A promise that resolves when the guardian is successfully updated to the database
	 */
	static async update(
		guardian,
		id,
		connection = pool
	) {
		const UPDATE_GUARDIAN = `UPDATE guardian 
                             SET relationship = ?, 
                             company = ?, 
                             street = ?, 
                             city = ?,
                             email = ?, 
                             zip_code = ? 
                             WHERE customer_id = ?`;
                             
        const params = [
                guardian.relationship,
                guardian.company,
                guardian.street,
                guardian.city,
                guardian.email,
                guardian.zip_code,
                id
            ];

		return await connection.execute(UPDATE_GUARDIAN, params);
	}
	
	/**
	 * Method to remove the token from the guardian's record once it's used
	 * Consume after a successful registration
	 * (It is not yet implemented in the front-end (V2))
	 * 
	 * @param {number} id - The id of the guardian to update
	 * @param {string} token - The token
	 * 
	 * @returns - A promise that resolves with the result of the SQL query
	 */
	static async deleteToken(connection, { id, token }) {

		const DELETE_TOKEN = `UPDATE 
								guardian
                        	  SET 
                        		token = NULL
                        	  WHERE 
                        		customer_id = ? AND token = ?`;

		return await connection.execute(DELETE_TOKEN, [id, token]);
	}
	
	/** 
	 * Method to update guardian login info
	 *  (It is not yet implemented (V2))
	 * 
	 * @param {number} id - The id of the guardian to update
	 * @param {string} email - The email of the guardian
	 * @param {string} passwoord - The hashed password of the guadian
	 * 
	 * @returns - A promise that resolves with the result of the SQL query
	 */
	static async updateGuardianAccount({ id, email, password }) {
		const UPDATE_GUARDIAN = `UPDATE guardian SET email = ?, password = ? WHERE g.id = ?`;
		
		return await pool.execute(UPDATE_GUARDIAN, [email, password, id]);
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
								    c.id, c.title, c.firstname, c.lastname,
								    g.email, g.token, g.password
								FROM
								    guardian g
								LEFT JOIN customer c ON
								    g.customer_id = c.id
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
								       guardian g
								   JOIN customer c ON
								       g.customer_id = c.id
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

}

export default Guardian;
