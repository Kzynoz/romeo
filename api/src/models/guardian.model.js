import pool from "../config/db.js";

class Guardian {
	static async getOne(id) {
		const SELECT_GUARDIAN = `SELECT 
                              JSON_OBJECT(
                                  'details', JSON_OBJECT(
                                      'id', g.customer_id,
                                      'title', gc.title,
                                      'firstname', gc.firstname,
                                      'lastname', gc.lastname,
                                      'phone', gc.phone,
                                      'email', g.email
                                  ),
                                  'relationship', g.relationship,
                                  'company', g.company,
                                  'address', CASE
                                    WHEN g.street IS NULL OR g.city IS NULL OR g.zip_code IS NULL THEN NULL
                                    ELSE JSON_OBJECT(
                                        'street', g.street,
                                        'city', g.city,
                                        'zip_code', g.zip_code
                                    )
                                  END
                              ) AS guardian,
                              COUNT(c.id) AS guardianship_count,
                              CASE 
                                  WHEN COUNT(c.id) = 0 THEN NULL 
                                  ELSE JSON_ARRAYAGG(
                                      JSON_OBJECT(
                                          'id', c.id,
                                          'title', c.title,
                                          'firstname', c.firstname,
                                          'lastname', c.lastname,
                                          'retirement_home', rh.name
                                      )
                                  )
                              END AS patients
                          FROM guardian g
                          JOIN customer gc ON g.customer_id = gc.id
                          LEFT JOIN customer c ON c.guardian_id = g.customer_id
                          LEFT JOIN retirement_home rh ON c.retirement_home_id = rh.id
                          WHERE g.customer_id = ?
                          GROUP BY g.id, gc.id;`;

		return await pool.execute(SELECT_GUARDIAN, [id]);
	}

	static async getAll() {
		const SELECT_ALL = `SELECT c.id, c.title, c.firstname, c.lastname, c.phone, 
                        g.email, g.relationship, g.company, 
                        JSON_OBJECT (
                        'street',g.street, 
                        'city',g.city,
                        'zip_code',g.zip_code) AS address,
                        (
                          SELECT COUNT(id)
                          FROM customer c
                          WHERE c.guardian_id = g.customer_id
                        ) AS guardianship_count
                        FROM guardian g
                        LEFT JOIN customer c ON g.customer_id = c.id 
                        ORDER BY c.lastname ASC`;

		return await pool.query(SELECT_ALL);
	}

	static async insert(
		{
			relationship,
			company = null,
			street = null,
			city = null,
			email = null,
			password = null,
			zip_code = null,
			token = null,
			customer_id,
		},
		connection
	) {
		const INSERT_GUARDIAN = `INSERT INTO guardian 
                             (customer_id,relationship,company,street,city,zip_code,email,password,token)
                             VALUES (?,?,?,?,?,?,?,?,?)`;

		return await connection.execute(INSERT_GUARDIAN, [
			customer_id,
			relationship,
			company,
			street,
			city,
			zip_code,
			email,
			password,
			token,
		]);
	}

	static async update(
		{
			relationship = null,
			company = null,
			street = null,
			city = null,
			zip_code = null,
			email = null,
		},
		id,
		connection = pool
	) {
		const UPDATE_GUARDIAN = `UPDATE guardian 
                             SET relationship = COALESCE(?,relationship), 
                             company = COALESCE(?,company), 
                             street = COALESCE(?,street), 
                             city = COALESCE(?,city),
                             email = COALESCE(?,email), 
                             zip_code = COALESCE(?,zip_code) 
                             WHERE customer_id = ?`;

		return await connection.execute(UPDATE_GUARDIAN, [
			relationship,
			company,
			street,
			city,
			email,
			zip_code,
			id,
		]);
	}
}

export default Guardian;
