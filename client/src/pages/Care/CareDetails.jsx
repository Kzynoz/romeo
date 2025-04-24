import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import CareStatus from "../Components/CareStatus";
import GuardianContact from "../Components/GuardianContact";
import UpdateEntity from "../Entity/UpdateEntity";

import ManageItem from "../Components/ManageItem";
import useFetchItem from "../../hooks/useFetchItem";
import useHead from "../../hooks/useHead";

import { customFetch } from "../../service/api.js";

function CareDetails() {
	// Get parameters from the URL
	const { id, idSoin } = useParams();
	
	const { isEditingOpen } = useSelector((state) => state.menu);
	const {
		isAdmin,
		infos: { role, id: guardianId },
	} = useSelector((state) => state.auth);

	// Custom Hook to fetch care details using the patient and care IDs
	const { datas, error, loading } = useFetchItem({
		url: `/care/${id}/${idSoin}`,
		dependencies: [isEditingOpen],
		guardian: {role,guardianId},
	});
	
	// Set title and meta description
	useHead("Détail du soin","Consultez et gérez les détails des soins pour chaque patient dans Roméo. Suivez l'évolution des traitements et assurez-vous que chaque soin est bien documenté");
	
	// Import env variable
	const API_URL = import.meta.env.VITE_API_URL;
	
    if (loading) {
        return <p>Chargement...</p>
    }

    if (error) {
        return <p>{error}</p>;
    }
    
    
     // Attempt to fetch the invoice file
    async function downloadInvoice(e,filename) {
    	
    	const options = {
    		credentials: "include",
    	}
    	
    	try {
    		 // Attempt to fetch the invoice file
    		const res = await customFetch(`/care/invoices/${filename}`, options);
    		
    		if (res.ok) {
    			// Convert the response to a Blob (binary data)
    			const blob = await res.blob(); 
    			// Create a URL representing the Blob
    			const pdf = URL.createObjectURL(blob);
    			// Create a temporary link element
    			const link = document.createElement("a");
    			link.href = pdf;
    			link.download = `${filename}.pdf`;

    			// Append the link to the document, trigger a click to download the file, then remove it
    			document.body.appendChild(link);
    			link.click();
    			document.body.removeChild(link);
    			
    			// Release the Blob URL after the download has been initiated
    			URL.revokeObjectURL(pdf)
    		} else {
    			const existingError = e.target.parentElement.querySelector(".download-error");
    			
    			if (existingError) existingError.remove();
    			
    			const downloadError = document.createElement("p");
				downloadError.className = "download-error";
				downloadError.textContent = "Erreur lors du téléchargement de la facture";
				
				e.target.insertAdjacentElement('afterend', downloadError);
    		}
    	} catch(error) {
    		// Check if there's an existing error message in the parent element
    		const existingError = e.target.parentElement.querySelector(".download-error");
    		
    		if (existingError) existingError.remove();
			
			// Create a new <p> element for the error message, 
			const downloadError = document.createElement("p");
    		downloadError.className = "download-error";
    		downloadError.textContent = "Erreur lors du téléchargement de la facture";

			// Append the newly created error message to the target
    		e.target.insertAdjacentElement('afterend', downloadError);
    	}
	}

	return (
		<>
			{datas && (
				<>
					{/* If the edit mode is open and the user is an admin, show the UpdateEntity component */}
					{isEditingOpen && isAdmin ? (
						
						<UpdateEntity data={datas} />
						
					) : (
						<>
							<ManageItem
								entity={{
									id: datas.id,
									careId: datas.care.id,
									name: `soin du ${new Date(
										datas.care.performed_at
									).toLocaleDateString("fr-FR")}`,
								}}
								link={{
									url: "care",
									title: "le soin",
								}}
							/>
							
							<article 
								aria-label={`Détail du soin du ${new Date(
										datas.care.performed_at
									).toLocaleDateString("fr-FR")}`}
							>
								<header>
									<h1>
										<span>Patient</span>
										{datas.title} {datas.firstname} {datas.lastname}
									</h1>
									<p>Soin réalisé par : {datas.practitioner}</p>

									{datas.name && (
										<address>
											<p>Maison de retraite : {datas.name}
											</p>
										</address>
									)}
								</header>
								
								{/* If the patient has a guardian and the current user's role is not "guardian", show guardian contact details */}
								{datas.guardian && role !== "guardian" && (
									<GuardianContact datas={datas.guardian} isFull={true} />
								)}

								<section className="care-details">
									<h2>
										{datas.care.type} du
										<span>
											{new Date(datas.care.performed_at).toLocaleDateString()}
										</span>
									</h2>

									<CareStatus
										invoice_paid={datas.care.invoice.invoice_paid}
										invoice_send={datas.care.invoice.invoice_send}
									/>

									<p className="price">Prix: {datas.care.price}€</p>

									{datas.care.complements && (
										<p className="complements">
											<strong>Complements :</strong> {datas.care.complements}
										</p>
									)}
									
									{/* If an invoice has been generated, show a button to view the invoice */}
									{datas.care.invoice.invoice_generated === 1 && 
										datas.care.invoice.invoice_url && (
										<button 
											onClick={(e) => { downloadInvoice(e,datas.care.invoice.invoice_url) }}
											aria-label="Télécharger la facture du soin"
										>Voir la facture</button>
									)}
								</section>
							</article>
						</>
					)}
				</>
			)}
		</>
	);
}

export default CareDetails;
