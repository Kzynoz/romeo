import pool from "../config/db.js";

export default async (tableName, columnName) => {
	
	const SELECT_ENUM = `SELECT COLUMN_TYPE 
						 FROM INFORMATION_SCHEMA.COLUMNS 
						 WHERE TABLE_NAME = ? AND COLUMN_NAME = ?`;
	
	try {
		
		const [[response]] = await pool.execute(SELECT_ENUM, [
			tableName,
			columnName,
		]);
		
		if (response) {
			
			const enumValues = response.COLUMN_TYPE.replace(/^enum\(/, "")
				.replace(/\)$/, "")
				.split(",")
				.map((value) => value.replace(/^'|'$/g, ""));
				
			return enumValues;
		}
		
		throw new Error("Aucune donnée trouvée pour cette colonne");
	} catch (error) {
		
		throw error;
	}
};
