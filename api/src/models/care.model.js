import pool from "../config/db.js";

class Care {
  static async findCare(id, { performed_at }) {
    console.log(id, performed_at);
    const SELECT_CARE = `SELECT care.id, c.title, c.firstname, c.lastname, care.performed_at 
                         FROM care
                         LEFT JOIN customer c ON care.customer_id = c.id
                         WHERE DATE(care.performed_at) = ? AND c.id = ?`;

    return await pool.execute(SELECT_CARE, [performed_at, id]);
  }

  static async getAll() {
    const SELECT_ALL = `SELECT JSON_OBJECT (
                        	'id',care.id,
                        	'performed_at',care.performed_at,
                        	'invoice_send', care.invoice_send,
                        	'invoice_paid', care.invoice_paid) AS care,
                              JSON_OBJECT (
                              'id',p.id,
                              'alias',p.alias) AS practitioner,
                              JSON_OBJECT (
                              'id',c.id,
                              'title',c.title,
                              'firstname', c.firstname,
                              'lastname',c.lastname) AS patient
                        FROM care
                        LEFT JOIN practitioner p ON care.practitioner_id = p.id
                        LEFT JOIN customer c ON  care.customer_id = c.id`;

    return await pool.query(SELECT_ALL);
  }

  static async getOne(id) {
    const SELECT_CARE = `SELECT
                          c.id,
                          c.title,
                          c.lastname,
                          c.firstname,
                          JSON_OBJECT(
                          	'details', JSON_OBJECT(
                            	'id', g.id,
                            	'customer_id', g.customer_id,
                            	'title', gc.title,
                                'firstname', gc.firstname,
                                'lastname', gc.lastname,
                                'phone', gc.phone,
                                'email', gc.email
                          		),
                            'relationship', g.relationship,
                            'company', g.company,
                            'address', JSON_OBJECT(
                            	'street', g.street,
                                'city', g.city,
                                'zip_code', g.zip_code
                                )
                         ) AS guardian,
                         JSON_OBJECT(
                            'id', care.id,
                            'performed_at', care.performed_at,
                            'price', care.price,
                            'type',care.type,
                            'complements',care.complements,
                            'invoice', JSON_OBJECT (
                            	'invoice_generated',care.invoice_generated,
                                'invoice_paid',care.invoice_paid,
                                'invoice_send',care.invoice_send
                            	)
                        ) AS care
                        FROM customer c
                        LEFT JOIN guardian g ON c.guardian_id = g.customer_id 
                        LEFT JOIN customer gc ON c.guardian_id = gc.id
                        LEFT JOIN care ON care.customer_id = c.id
                        WHERE c.is_patient = 1 AND care.id = ?`;

    return await pool.query(SELECT_CARE, [id]);
  }

  static async insert({
    performed_at,
    type,
    complements = null,
    price,
    invoice_paid,
    invoice_send,
    invoice_generated,
    customer_id,
    practitioner_id,
  }) {
    const INSERT_CARE =
      "INSERT INTO care (performed_at,practitioner_id, customer_id,type,complements,price,invoice_paid,invoice_send,invoice_generated) VALUES (?,?,?,?,?,?,?,?,?)";

    return await pool.execute(INSERT_CARE, [
      performed_at,
      practitioner_id,
      customer_id,
      type,
      complements,
      price,
      invoice_paid,
      invoice_send,
      invoice_generated,
    ]);
  }

  static async findBySearch(search) {
    const SELECT_ALL = `SELECT care.id, care.performed_at, care.type, c.title, c.firstname, c.lastname 
                        FROM care 
                        LEFT JOIN customer c ON care.customer_id = c.id
                        WHERE DATE_FORMAT(care.performed_at, '%d/%m/%Y') LIKE ? `; // Conversion de la colonne performed_at en chaine de caractères

    return await pool.execute(SELECT_ALL, [search]);
  }

  static async update({
    id,
    performed_at = null,
    invoice_generated = null,
    invoice_paid = null,
    invoice_send = null,
    practitioner_id = null,
    complements = null,
    price = null,
    type = null,
  }) {
    const UPDATE_CARE = `UPDATE care 
                          SET performed_at = IFNULL(?, performed_at), 
                          price = IFNULL(?,price), 
                          type = IFNULL(?,type), 
                          complements = IFNULL(?,complements), 
                          practitioner_id = IFNULL(?,practitioner_id), 
                          invoice_paid = IFNULL(?,invoice_paid), 
                          invoice_generated = IFNULL(?,invoice_generated), 
                          invoice_send = IFNULL(?,invoice_send) 
                         WHERE id = ? `;

    return await pool.execute(UPDATE_CARE, [
      performed_at,
      invoice_generated,
      invoice_paid,
      invoice_send,
      practitioner_id,
      complements,
      price,
      type,
      id,
    ]);
  }
}

export default Care;
