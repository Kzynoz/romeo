import pool from "../config/db.js";

class Customer {
  static async findCustomerGuardian({ firstname, lastname }) {
    const SELECT_CUSTOMER =
      "SELECT id, title, firstname, lastname FROM customer WHERE firstname = ? AND lastname = ? AND is_patient = '0'";

    return await pool.execute(SELECT_CUSTOMER, [firstname, lastname]);
  }

  static async insert(
    {
      title,
      firstname,
      lastname,
      phone = null,
      email = null,
      password = null,
      is_patient = 0,
      guardian_id = null,
      practitioner_id = null,
      retirement_home_id = null,
    },
    connection = pool
  ) {
    const INSERT_CUSTOMER =
      "INSERT INTO customer (title,firstname,lastname,phone,email,password,is_patient,guardian_id,practitioner_id,retirement_home_id) VALUES (?,?,?,?,?,?,?,?,?,?)";

    return await connection.execute(INSERT_CUSTOMER, [
      title,
      firstname,
      lastname,
      phone,
      email,
      password,
      is_patient,
      guardian_id,
      practitioner_id,
      retirement_home_id,
    ]);
  }

  static async delete(id) {
    const DELETE_CUSTOMER = "DELETE FROM customer WHERE id = ?";
    return await pool.execute(DELETE_CUSTOMER, [id]);
  }

  static async updateIsGuardian(
    {
      title = null,
      firstname = null,
      lastname = null,
      phone = null,
      email = null,
    },
    id,
    connection = pool
  ) {
    const UPDATE_GUARDIAN =
      "UPDATE customer SET title = COALESCE(?,title), firstname = COALESCE(?,firstname), lastname = COALESCE(?,lastname), phone = COALESCE(?,phone), email = COALESCE(?,email) WHERE id = ? AND is_patient = '0'";
    return await connection.execute(UPDATE_GUARDIAN, [
      title,
      firstname,
      lastname,
      phone,
      email,
      id,
    ]);
  }

  static async findBySearch(search, isPatient = 0) {
    const SELECT_ALL = `SELECT id, title, firstname, lastname FROM customer WHERE (CONCAT(firstname, '', lastname) LIKE ? AND is_patient= "${isPatient}")`;
    return await pool.execute(SELECT_ALL, [search]);
  }
}

export default Customer;
