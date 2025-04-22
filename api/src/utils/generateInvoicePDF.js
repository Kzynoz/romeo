import puppeteer from "puppeteer"; // Import Puppeteer for generating PDF
import fs from "fs";
import path from "path";

// This function generates a PDF invoice based on the provided invoice data
export default async (invoiceData) => {
	try {
		const htmlContent = `
    	<html>
    	  <head>
    	    <style>
    	      body { font-family: Arial, sans-serif; margin: 30px; }
    	      h1 { text-align: center; }
    	      .invoice-details { margin-top: 20px; }
    	      .invoice-table { width: 100%; border-collapse: collapse; }
    	      .invoice-table th, .invoice-table td { padding: 10px; border: 1px solid #ddd; }
    	    </style>
    	  </head>
    	  <body>
    		<article id="invoice">
				<header>
					<p>
						<strong>Brillon Margot</strong>Pédicure-Podologue D.E
					</p>
					<address>
						<p>27 rue professeur Patel</p>
						<p>69007 - LYON</p>
						<a href="tel:+33638338872">06.38.33.88.72</a>
						<a href="mailto:margot.brillon@orange.fr">
							margot.brillon@orange.fr
						</a>
					</address>
					<p>SIRET: 698000395</p>
				</header>
				<section>
					<p className="date">
						Le ${new Date(invoiceData.performed_at).toLocaleDateString("fr-FR")}
					</p>
					<h1>Facture</h1>
					<p>En attente de réglement</p>
					<p className="invoice-patient">
						${invoiceData.title} ${invoiceData.firstname} ${invoiceData.lastname}
					</p>
					<p>
						Un ${invoiceData.type} : ${invoiceData.price} €
					</p>
    	            	${
							invoiceData.complements
								? `<p><strong>Informations :</strong>${invoiceData.complements}</p>`
								: ""
						}
				</section>
				<footer>
					<p>
						Si règlement par chèque, merci de le mettre à l’ordre de BRILLON
						Margot.
					</p>
					<p>Si règlement par virement, vous trouverez ci-joint le RIB.</p>
					<p>Signature</p>
				</footer>
				</article>
    	  </body>
    	</html>`;

		// Launch Puppeteer browser (headless means it runs without UI)
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		// Load the HTML content into the page
		await page.setContent(htmlContent);

		// Generate the PDF from the HTML content, in A4 format
		const pdfBuffer = await page.pdf({ format: "A4" });

		// Define the path where the PDF will be saved
		const pdfPath = path.join(
			process.cwd(),
			"public",
			"invoices",
			`${invoiceData.invoice_url}.pdf`
		);
		
		// Write the PDF to the specified path
		fs.writeFileSync(pdfPath, pdfBuffer);

		// Close the Puppeteer browser after the PDF is generated
		await browser.close();
		
		// Return true if everything was successful
		return true;
	} catch (error) {
		return false;
	}
};
