import pool from "../config/db.js";

class Guardian {
	static async getOne({ offset, limit, id }) {
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
    (SELECT COUNT(customer.id) FROM customer WHERE guardian_id = g.customer_id) AS guardianship_count,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', c.id,
                'title', c.title,
                'firstname', c.firstname,
                'lastname', c.lastname,
                'retirement_home', rh.name
            )
        )
        FROM customer c
        LEFT JOIN retirement_home rh ON c.retirement_home_id = rh.id
        WHERE c.guardian_id = g.customer_id
        ORDER BY c.id ASC
        LIMIT ? OFFSET ?
    ) AS patients
FROM guardian g
JOIN customer gc ON g.customer_id = gc.id
WHERE g.customer_id = ?`;

		return await pool.execute(SELECT_GUARDIAN, [limit, offset, id]);
	}

	static async countAll() {
		const COUNT = `SELECT COUNT(guardian.id) AS total 
                        FROM guardian`;

		return await pool.query(COUNT);
	}

	static async getAll({ offset, limit }) {
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
                        ORDER BY c.lastname ASC
                        LIMIT ?
                        OFFSET ?`;

		return await pool.execute(SELECT_ALL, [limit, offset]);
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
		{ relationship, company, street, city, zip_code, email },
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
