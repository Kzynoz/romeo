import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import CareStatus from "./Components/CareStatus";
import GuardianContact from "./Components/GuardianContact";
import UpdateEntity from "./UpdateEntity";

import ManageItem from "./Components/ManageItem";
import useFetchItem from "../hooks/useFetchItem";

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
		url: `/patients/${id}/care/${idSoin}`,
		dependencies: [isEditingOpen],
		guardian: {role,id},
	});
	
    if (loading) {
        return <p>Chargement...</p>
    }

    if (error) {
        return <p>{error}</p>;
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
							
							<article>
								<header>
									<h1>
										<span>Patient</span>
										{datas.title} {datas.firstname} {datas.lastname}
									</h1>
									<p>Soin réalisé par : {datas.practitioner}</p>

									{datas.retirement_home && (
										<address>
											<p>Maison de retraite :</p>
											<p>
												<Link to={`/ehpads/${datas.retirement_home.id}`}>
													{datas.retirement_home.name}
												</Link>
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
									{datas.care.invoice.invoice_generated === 1 && (
										<button onClick={"ajouter"}>Voir la facture</button>
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
