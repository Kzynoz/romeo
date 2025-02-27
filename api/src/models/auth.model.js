import pool from "../config/db.js";

class Auth {
  static async findPractitioner(email) {
    const SELECT_PRACTITIONER =
      "SELECT id, alias, email, password, is_admin FROM practitioner WHERE email = ?";

    return await pool.execute(SELECT_PRACTITIONER, [email]);
  }

  static async createPractitioner({ alias, email, password }) {
    const INSERT_PRACTITIONER =
      "INSERT INTO practitioner (alias,email,password) VALUES (?,?,?)";

    return await pool.execute(INSERT_PRACTITIONER, [alias, email, password]);
  }

  static async findGuardian(email, token = null) {
    const SELECT_GUARDIAN = `SELECT c.id, c.title, c.firstname, c.lastname, g.email, g.token, g.password
                             FROM customer c
                             LEFT JOIN guardian g ON c.id = g.customer_id
                             WHERE g.email = ?
                             ${token ? "AND g.token = ?" : ""}
                             AND is_patient = '0'`;

    const params = token ? [email, token] : [email];

    return await pool.execute(SELECT_GUARDIAN, params);
  }

  static async registerGuardian(connection, { id, token, email, password }) {
    const UPADTE_GUARDIAN = `UPDATE customer c
                                 JOIN guardian g ON c.id = g.customer_id
                                 SET g.password = ?
                                 WHERE c.id = ? 
                                 AND g.token = ? 
                                 AND g.email = ? 
                                 AND c.is_patient = "0"`;

    return await connection.execute(UPADTE_GUARDIAN, [
      password,
      id,
      token,
      email,
    ]);
  }

  static async deleteToken(connection, { id, token }) {
    console.log(id, token);
    const DELETE_TOKEN = `UPDATE guardian
                          SET token = NULL
                          WHERE customer_id = ? AND token = ?`;

    return await connection.execute(DELETE_TOKEN, [id, token]);
  }
}

export default Auth;
