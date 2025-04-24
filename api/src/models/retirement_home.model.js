import pool from "../config/db.js";

class RetirementHome {
	/**
     * Method to get all retirement homes records and the number of patients living their
     * 
     * @param {number} offset - The number of records to skip
     * @param {number} limit - The maximum number of records to retrieve
     * 
     * @returns - A promise that resolves with an array of retirement homes objects
     */
	static async getAll(offset, limit) {
		const SELECT_ALL = `SELECT
							    rh.id, rh.name,
							    COUNT(c.id) AS patients_count
							FROM
							    retirement_home rh
							LEFT JOIN customer c ON
							    rh.id = c.retirement_home_id
							GROUP BY
							    rh.id
							ORDER BY NAME
							LIMIT ? OFFSET ?`;

		return await pool.execute(SELECT_ALL, [limit, offset]);
	}

	/** 
	 * Method to count all retirement home records
	 * 
	 * @returns - A promise that resolves with the result the total number of retirement home
	 * Example: {total: 42}
	 */
	static async countAll() {
		const COUNT = `SELECT 
							COUNT(retirement_home.id) AS total 
                       FROM 
                    		retirement_home`;

		return await pool.query(COUNT);
	}

	/** 
	 * Method to get one specific retirement home with all patients living their
	 * 
	 * @param {number} id - The retirement home ID
	 * 
	 * @returns - A promise that resolves with the result of the SQL query. 
	 */
	static async getOne(id) {
		const SELECT_RH = `SELECT
							    rh.id,
							    rh.name,
							    rh.city,
							    rh.contact,
							    rh.street,
							    rh.zip_code,
							    COUNT(c.id) AS patients_count,
							    CASE WHEN COUNT(c.id) = 0 THEN NULL ELSE JSON_ARRAYAGG(
							        JSON_OBJECT(
							            'id',
							            c.id,
							            'title',
							            c.title,
							            'firstname',
							            c.firstname,
							            'lastname',
							            c.lastname
							        )
							    )
							END AS patients
							FROM
							    retirement_home rh
							LEFT JOIN customer c
							ON
							    c.retirement_home_id = rh.id
							WHERE
							    rh.id = ?
							GROUP BY
								rh.id`;

		return await pool.execute(SELECT_RH, [id]);
	}

    /**
	 * Method to insert a new retirement home
	 * 
	 * @param {string} name - The name of the retirement home
	 * @param {string} contact - The contact of the retirement home (a specific person)
	 * @param {string} street - The street of the retirement home
	 * @param {string} city - The city
	 * @param {number} zip_code - The zip code
	 *
	 * @returns - A promise that resolves when the retirement home is successfully added to the database
	 */
	static async create({ name, contact, street, city, zip_code }) {
		const INSERT_RH = `INSERT INTO retirement_home (
								name,
								contact,
								street,
								city,
								zip_code
							) 
                    		VALUES (?, ?, ?, ?, ?)`;

		return await pool.execute(INSERT_RH, [
			name,
			contact,
			street,
			city,
			zip_code,
		]);
	}

	/**
	 * Method to delete retirement home by id
	 * 
	 * @param {number} id - The id of retirement home
	 * 
	 * @returns - A promise that resolves when the retirement home is successfully deleted
	 */
	static async delete(id) {
		const DELETE_RH = "DELETE FROM retirement_home WHERE id = ?";
		
		return await pool.execute(DELETE_RH, [id]);
	}

	/**
	 * Method to update retirement home
	 * 
	 * @param {string} name - The name of the retirement home
	 * @param {string} contact - The contact of the retirement home (a specific person)
	 * @param {string} street - The street of the retirement home
	 * @param {string} city - The city
	 * @param {number} zip_code - The zip code
	 * @param {number} id - The ID of the retiremnt home to update
	 *
	 * @returns - A promise that resolves when the retirement home is successfully updated to the database
	 */
	static async update({ id, name, contact, street, city, zip_code }) {
		const UPDATE_RH = `UPDATE 
								retirement_home 
                    	   SET 
                    			name = ?, 
                    			contact = ?, 
                    			street = ?, 
                    			city = ?, 
                    			zip_code = ? 
                    		WHERE 
                    			id = ?`;

		return await pool.execute(UPDATE_RH, [
			name,
			contact,
			street,
			city,
			zip_code,
			id,
		]);
	}

	/**
	 * Method to find specific retirement home by name
	 * 
	 * @param {string} search - The search
	 * 
	 * @returns - A promise that resolves the result of the search
	 */
	static async findBySearch(search) {
		const SELECT_ALL = `SELECT 
								id, name 
							FROM 
								retirement_home 
							WHERE 
								name LIKE ?
							ORDER BY name
							LIMIT 5`;
		return await pool.execute(SELECT_ALL, [search]);
	}
}

export default RetirementHome;
