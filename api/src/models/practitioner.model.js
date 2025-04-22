import pool from "../config/db.js";

class Practitioner {
	/** 
	 * Method to find a practitioner by their email. Uses for the practitioner registration
	 * (It is not yet implemented in the front-end (V2))
	 * 
	 * @param {string} email - Email of the practitioner ton find
	 * 
	 * @returns - A promise that resolves with the result of the SQL query
	 */
	static async findPractitioner(email) {
		const SELECT_PRACTITIONER = `SELECT 
		                                id, alias, email, password, is_admin 
		                             FROM 
		                                practitioner 
		                             WHERE 
		                                email = ?`;
		
		return await pool.execute(SELECT_PRACTITIONER, [email]);
	}
	
    /** 
	 * Method to registrate a new practitioner
	 * (It is not yet implemented in the front-end (V2))
	 * 
	 * @param {string} alias - Alias of the practitioner
	 * @param {string} email - Email of the practitioner to registrate
	 * @param {string} password - Password of the practitioner hashed
	 *  
	 * @returns - A promise that resolves with the result of the SQL query
	 */
	static async createPractitioner({ alias, email, password }) {
		const INSERT_PRACTITIONER = `INSERT INTO 
		                                practitioner (alias, email, password) 
		                             VALUES 
		                                (?, ?, ?)`;
		                                
		return await pool.execute(INSERT_PRACTITIONER, [alias, email, password]);
	}
}

export default Practitioner;