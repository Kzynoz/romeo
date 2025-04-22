import pool from "../config/db.js";

/**
 * This function retrieves enum values for a specific column in a given table
 * 
 * @param {string} tableName - Name of the table 
 * @param {string}  columnName - Name of the column to get enum values
 * 
 * @returns - Enum values
 */
export default async (tableName, columnName) => {
	
	 // SQL query to fetch the column type from the INFORMATION_SCHEMA for a specific table and column
	const SELECT_ENUM = `SELECT COLUMN_TYPE 
						 FROM INFORMATION_SCHEMA.COLUMNS 
						 WHERE TABLE_NAME = ? AND COLUMN_NAME = ?`;
	
	try {
		// Executing the query to fetch the column type for the given table and column
		const [[response]] = await pool.execute(SELECT_ENUM, [
			tableName,
			columnName,
		]);
		
		if (response) {
			// Clean the ENUM string and split it into individual values
			const enumValues = response.COLUMN_TYPE.replace(/^enum\(/, "")
				.replace(/\)$/, "") // Remove ')' at the end
				.split(",") // Split by commas to get individual enum values
				.map((value) => value.replace(/^'|'$/g, "")); // Remove surrounding single quotes from each value
				
			return enumValues;
		}
		throw new Error("Aucune donnée trouvée pour cette colonne");
	} catch (error) {
		
		throw error;
	}
};
