import Care from "../models/care.model.js";
import Customer from "../models/customer.model.js";
import RetirementHome from "../models/retirement_home.model.js";

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const getBySearch = async (req, res, next) => {
	const { q = "" } = req.query;

	if (!q) {
		return res
			.status(400)
			.json({ message: "La recherche ne peut pas être vide." });
	}

	const formattedSearch = `%${q.trim()}%`;

	try {
		const [care] = await Care.findBySearch(formattedSearch);
		const [retirementHome] = await RetirementHome.findBySearch(formattedSearch);
		const [patient] = await Customer.findBySearch(formattedSearch, 1);
		const [guardian] = await Customer.findBySearch(formattedSearch, 0);

		const response = {
			care: care.length ? care : null,
			retirementHomes: retirementHome.length ? retirementHome : null,
			patients: patient.length ? patient : null,
			guardians: guardian.length ? guardian : null,
		};

		if (
			response.care ||
			response.retirementHomes ||
			response.patients ||
			response.guardians
		) {
			res.status(200).json({ message: "Résultat de recherche.", response });
			return;
		}

		res.status(400).json({ message: "Aucun résultat trouvé." });
		return;
	} catch (error) {
		next(error);
	}
};

const getInvoice = async (req, res, next) => {
	const { id } = req.params;
	try {
		const [[response]] = await Care.getOneForInvoice(id);
		console.log(response);
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
		next(error);
	}
};

const createInvoice = async (req, res, next) => {
	const id = req.params.id;

	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Accès refusé: token manquant." });
		}

		// Lance un scrapp de la page
		const browser = await puppeteer.launch({
			headless: "true",
		});

		// Création d'une nouvelle page avec la facture
		const page = await browser.newPage();

		// Passer le cookie dans Puppeteer
		await page.setCookie({
			name: "jwt",
			value: token,
			domain: "localhost", // Assure-toi que le domaine est correct
			path: "/", // Si nécessaire
			httpOnly: true, // Cookie sécurisé
			secure: false,
		});

		// Redirection vers la facture, waitUntill va attendre que toutes les ressources soient chargées
		await page.goto(`http://localhost:5173/factures/${id}/print`, {
			waitUntil: "networkidle0",
		});

		// Suppression d'elements en CSS
		await page.addStyleTag({
			content: `
			  #root > header, #root > footer {
			  display: none!important}
			`,
		});

		// Génération du PDF
		const pdfBuffer = await page.pdf({ format: "A4" });

		const pdfPath = path.join(process.cwd(), "public", `facture-${id}.pdf`);
		fs.writeFileSync(pdfPath, pdfBuffer);

		console.log(pdfPath);

		// Fermeture du Scrapper
		await browser.close();

		// Envoie le PDF au client EN ATTENTE
		/* 		res.set({
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename=facture-${id}.pdf`,
		});
		res.send(pdfBuffer); */
	} catch (error) {
		console.log(error);
	}

	// Téléchargement du PDF et envoie du PDF au front
	/* 	res.set({
		"Content-Type": "application/pdf",
		"Content-Disposition": `attachment; filename=facture-${id}.pdf`,
	});
	res.send(pdfBuffer); */
};

export { getBySearch, getInvoice, createInvoice };
