import { validationResult } from "express-validator";
import Care from "../models/care.model.js";
import generateInvoicePDF from "../utils/generateInvoicePDF.js";
import pool from "../config/db.js";

import fs from "fs";
import path from "path";

// Get All cares with the count of total care with limit
const getAll = async (req, res, next) => {
	const offset = req.query.offset || "0";
	const limit = req.query.limit || "10";

	try {
		const [[count]] = await Care.countAll();

		if (count.total > 0) {
			const [response] = await Care.getAll(offset, limit);

			if (response.length) {
				return res.status(200).json({
					message: "Soins récupérés avec succès.",
					response,
					totalPages: Math.ceil(count.total / limit),
				});
			}
		}

		return res.status(400).json({
			message: "Aucun soins récupérés.",
		});
	} catch (error) {
		next(error);
	}
};


// Get One specific Care by its ID (guardian_id is need for the guardian dashboard)
const getOneCare = async (req, res, next) => {
	const { patientId, id } = req.params;
	const guardian_id = req.guardian_id;

	try {
		const [[response]] = await Care.getOne({ patientId, id, guardian_id });

		if (!response) {
			res.status(400).json({
				message: "Le soin n'a pas été trouvé.",
			});
			return;
		}

		res.status(200).json({
			message: "Soin trouvé avec succès.",
			response,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

// Get a specific care with the search
const getBySearch = async (req, res, next) => {
	const { q = "" } = req.query;
	const formattedSearch = `%${q.trim()}%`;

	try {
		const [response] = await Care.findBySearch(formattedSearch);

		if (response.length) {
			res.status(200).json({ message: "Soin(s) trouvé(s).", response });
			return;
		}

		res.status(400).json({ message: "Aucuns soins trouvés." });
		return;
	} catch (error) {
		next(error);
	}
};

// Create a new care
const create = async (req, res, next) => {
	let connection = null;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const id = req.params.id || req.body.patient_id;
	// Convert the date to ISEO format (yyyy-mm-dd)
	const date = new Date(req.body.performed_at).toLocaleDateString("fr-CA");

	try {
		const [[existingCare]] = await Care.findCare(id, date);

		if (existingCare) {
			res.status(400).json({ message: "Ce soin pour ce patient existe déjà." });
			return;
		}

		// Start a transaction
		connection = await pool.getConnection();
		await connection.beginTransaction();

		// Setup my newCare to insert in database
		const newCare = {
			performed_at: date,
			practitioner_id: req.body.practitioner_id,
			type: req.body.type,
			complements: req.body.complements || null,
			price: req.body.price,
			invoice_paid: 0,
			invoice_send: 0,
			customer_id: id,
		};

		// Insert the new care
		const [response] = await Care.insert(newCare, id);

		// If the care was inserted successfully, start generating the invoice
		if (response.insertId) {
			// Fetch patient information needed for the invoice
			const [[getInvoice]] = await Care.getInvoiceData(response.insertId);

			if (!getInvoice) {
				await connection.rollback();
				return res
					.status(500)
					.json({ message: "Erreur lors de l'ajout du soin." });
			}
			
			// Sanitize title, firstname, and lastname to avoid spaces and accents
			const sanitize = (string) =>
				string
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.replace(/\s+/g, "-")
					.toLowerCase();

			const title = sanitize(getInvoice.title);
			const firstname = sanitize(getInvoice.firstname);
			const lastname = sanitize(getInvoice.lastname);
			
			// Generate the invoice filename (in V2 a random name will be used for security)
			const filename = `${title}-${firstname}-${lastname}_${date}_${id}`;

			const [updateCare] = await Care.updateInvoiceURL({
				id: response.insertId,
				invoice_url: filename,
			});

			// If the invoice URL is updated, generate the PDF
			if (updateCare.affectedRows === 1) {
				const pdf = await generateInvoicePDF({
					...getInvoice,
					invoice_url: filename,
				});

				// If the PDF is successfully generated, update the invoice status
				if (pdf) {
					const [updateInvoiceStatus] = await Care.updateInvoiceStatus({
						id: response.insertId,
						invoice_generated: 1,
					});
					
					if (updateInvoiceStatus.affectedRows === 1) {
						await connection.commit();
						return res.status(200).json({
							message: "Le soin a été ajouté avec succès.",
							response: response.insertId,
						});
					}
				}
			}
		}
		
		// If something went wrong, rollback the transaction
		if(connection) await connection.rollback();
		return res.status(500).json({ message: "Erreur lors de l'ajout du soin." });
	} catch (error) {
		if (connection) await connection.rollback();
		next(error);
	} finally {
		// Always release the connection
		if (connection) connection.release();
	}
};

// Update care by its ID
// (in V2 invoice need to be update too)
const update = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: "Erreur lors de la validation du formulaire.",
			errors: errors.array(),
		});
	}

	const careDate = new Date(req.body.performed_at).toLocaleDateString("fr-CA");

	const updatedCare = {
		performed_at: careDate,
		practitioner_id: req.body.practitioner_id,
		type: req.body.type,
		complements: req.body.complements || null,
		price: req.body.price,
		id: req.body.care_id,
		invoice_paid: req.body.invoice_paid,
		invoice_send: req.body.invoice_send,
	};

	try {
		const [response] = await Care.update(updatedCare);

		if (response.affectedRows === 1) {
			res.status(201).json({ message: "Soin modifié." });
			return;
		}
		
		return res
			.status(400)
			.json({ message: "Problème lors de la modification" });
	} catch (error) {
		next(error);
	}
};

// Get Total care this month for statistics
const getTotalCareThisMonth = async (req, res, next) => {
	try {
		const [[response]] = await Care.getTotalCareThisMonth();

		if (response) {
			return res.status(200).json({
				message: "Total des soins trouvés ce mois-ci.",
				response: response,
			});
		}

		res.status(404).json({
			message: "Problème lors de la récupération.",
		});
	} catch (error) {
		next(error);
	}
};

// Get total care by year for statistics
const getTotalCareByYear = async (req, res, next) => {
	const { year } = req.params;
	try {
		const [[response]] = await Care.getTotalCareByYear(year);
		
		console.log(response);

		if (response) {
			return res.status(200).json({
				message: "Total des soins récupérés avec succès.",
				response,
			});
		}
		return res.status(400).json({
			message: "Aucun soin trouvé pour cette année.",
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

// Remove a specific Care
const remove = async (req, res, next) => {
	const { id } = req.body;
	const { idItem } = req.params;

	if (id != idItem) {
		res.status(400).json({
			message: "Une erreur est survenue, veuillez réessayer plus tard.",
		});
		return;
	}
	try {
		const [response] = await Care.delete(id);

		if (response.affectedRows === 1) {
			res.json({ message: "Soin supprimé." });
			return;
		}
		res.status(400).json({
			message: "Ce soin n'existe pas.",
		});
	} catch (error) {
		next(error);
	}
};

// Get the invoice file by filename
const getInvoice = async (req,res,next) => {
	const { filename } = req.params;
	
	// Build the full file path to the invoice
	const filePath = path.join(process.cwd(), "public", "invoices", `${filename}.pdf`);
	
	// Normalize the path to prevent path traversal attacks
	const normalizedPath = path.normalize(filePath);
	
	// Check if the normalized path is still inside the "invoices" directory
	if (!normalizedPath.startsWith(path.join(process.cwd(), "public", "invoices"))) {
    	return res.status(400).json({ message: "Chemin invalide" });
	}
	
	// Check if the file actually exists
	if (!fs.existsSync(filePath)) {
		return res.status(404).json({message: "Fichier introuvable"});
	}
	
	// Send the file to the client
	return res.sendFile(filePath);
} ;

export {
	getAll,
	getOneCare,
	getBySearch,
	create,
	update,
	getTotalCareThisMonth,
	getTotalCareByYear,
	remove,
	getInvoice,
};
