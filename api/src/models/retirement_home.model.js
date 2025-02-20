import pool from "../config/db.js";

class RetirementHome {
  static async findRh(id) {
    // à refaire
    const SELECT_RH = "SELECT id FROM retirement_home WHERE id = ?";
    return await pool.execute(SELECT_RH, [id]);
  }

  static async findRhByName(name) {
    // à refaire
    const SELECT_RH = "SELECT id FROM retirement_home WHERE name = ?";
    return await pool.execute(SELECT_RH, [name]);
  }

  static async getAll() {
    const SELECT_ALL = "SELECT id, name FROM retirement_home";
    return await pool.query(SELECT_ALL);
  }

  static async getOne(id) {
    const SELECT_RH = `SELECT rh.id, rh.name, rh.city, rh.contact, rh.street, rh.zip_code, 
  COUNT(c.id) AS patients_count,
  CASE 
    WHEN COUNT(c.id) = 0 THEN NULL 
    ELSE JSON_ARRAYAGG(
      JSON_OBJECT('id', c.id, 'title', c.title, 'firstname', c.firstname, 'lastname', c.lastname)
    )
  END AS patients
FROM retirement_home rh
LEFT JOIN customer c ON c.retirement_home_id = rh.id
WHERE rh.id = ?
GROUP BY rh.id;

`;
    return await pool.execute(SELECT_RH, [id]);
  }

  static async create({ name, contact, street, city, zip_code }) {
    const INSERT_RH =
      "INSERT INTO retirement_home (name,contact,street,city,zip_code) VALUES (?,?,?,?,?)";

    return await pool.execute(INSERT_RH, [
      name,
      contact,
      street,
      city,
      zip_code,
    ]);
  }

  static async delete(id) {
    const DELETE_RH = "DELETE FROM retirement_home WHERE id = ?";
    return await pool.execute(DELETE_RH, [id]);
  }

  static async update({ id, name, contact, street, city, zip_code }) {
    const UPDATE_RH =
      "UPDATE retirement_home SET name = IFNULL(?,name), contact = IFNULL(?,contact), street = IFNULL(?,street), city = IFNULL(?,city), zip_code = IFNULL(?,zip_code) WHERE id = ?";
    return await pool.execute(UPDATE_RH, [
      name,
      contact,
      street,
      city,
      zip_code,
      id,
    ]);
  }

  static async findBySearch(search) {
    const SELECT_ALL = "SELECT id, name FROM retirement_home WHERE name LIKE ?";
    return await pool.execute(SELECT_ALL, [search]);
  }
}

export default RetirementHome;
