import pool from "../config/db.js";

class Address {
  static async insertAddress(
    connection,
    {
      street,
      number,
      zip_code,
      city,
      floor = null,
      complements = null,
      guardian_id = null,
    }
  ) {
    const INSERT_ADDRESS =
      "INSERT INTO address (street,number,zip_code,city,floor,complements, guardian_id) VALUES (?,?,?,?,?,?,?)";

    return await connection.execute(INSERT_ADDRESS, [
      street,
      number,
      zip_code,
      city,
      floor,
      complements,
      guardian_id,
    ]);
  }

  static async update(
    connection,
    { street, number, zip_code, city, floor, complements, guardian_id }
  ) {
    const UPDATE_ADDRESS =
      "UPDATE address SET street = ?, number = ?, zip_code = ?, city = ?, floor = ?, complements = ? WHERE guardian_id = ?";
    return await connection.execute(UPDATE_ADDRESS, [
      street,
      number,
      zip_code,
      city,
      floor,
      complements,
      guardian_id,
    ]);
  }
}

export default Address;
