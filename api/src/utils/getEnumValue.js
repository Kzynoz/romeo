import pool from "../config/db.js";

const SELECT_ENUM = `SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = ? AND COLUMN_NAME = ?`;

export default async (tableName, columnName) => {
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

/* POSSIBLE REFACTORISATION
import { body } from "express-validator";
import pool from "../config/db.js";

// Requête SQL pour récupérer les valeurs ENUM
const SELECT_ENUM = `SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = ? AND COLUMN_NAME = ?`;

// Cache des valeurs ENUM pour éviter des requêtes répétitives
const enumCache = new Map();

// Fonction pour récupérer les valeurs ENUM et les mettre en cache
const getEnumValues = async (tableName, columnName) => {
  const cacheKey = `${tableName}.${columnName}`;

  // Si les valeurs sont déjà en cache, on les retourne
  if (enumCache.has(cacheKey)) {
    return enumCache.get(cacheKey);
  }

  try {
    const [[response]] = await pool.execute(SELECT_ENUM, [tableName, columnName]);

    if (response) {
      const enumValues = response.COLUMN_TYPE.replace(/^enum\(/, "")
        .replace(/\)$/, "")
        .split(",")
        .map((value) => value.replace(/^'|'$/g, ""));

      // Cache des valeurs récupérées
      enumCache.set(cacheKey, enumValues);
      return enumValues;
    }

    throw new Error(`Aucune donnée trouvée pour la colonne "${columnName}" dans la table "${tableName}"`);
  } catch (error) {
    throw error;
  }
};

// Validateur pour les valeurs ENUM
const enumValidator = (table, column) => {
  return async (value) => {
    const values = await getEnumValues(table, column);

    if (!values.includes(value)) {
      throw new Error(`Valeur invalide pour "${column}". Reçu : "${value}". Valeurs acceptées : ${values.join(", ")}`);
    }
  };
};

// Exemples d'utilisation avec express-validator
export const validatorCreateCare = [
  body("type").custom(enumValidator("cares", "type")),
  body("status").custom(enumValidator("cares", "status")),
];

export const validatorUpdateCare = [
  body("type").custom(enumValidator("cares", "type")),
  body("status").custom(enumValidator("cares", "status")),
];
*/
