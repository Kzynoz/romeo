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
}

export default Auth;
