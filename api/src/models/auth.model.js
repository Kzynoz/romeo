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

  static async findGuardian(email, token) {
    const SELECT_GUARDIAN = `SELECT c.id, c.title, c.firstname, c.lastname, c.email, g.token 
                             FROM customer c
                             LEFT JOIN guardian g ON c.id = g.customer_id
                             WHERE email = ?
                             AND g.token = ?
                             AND is_patient = '0'`;

    return await pool.execute(SELECT_GUARDIAN, [email, token]);
  }

  static async registerGuardian(connection, { id, token, email, password }) {
    const UPADTE_GUARDIAN = `UPDATE customer c
                                 JOIN guardian g ON c.id = g.customer_id
                                 SET c.password = ?
                                 WHERE c.id = ? 
                                 AND g.token = ? 
                                 AND c.email = ? 
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
