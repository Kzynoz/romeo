import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CareStatus from "../Components/CareStatus";
import GuardianContact from "../Components/GuardianContact";
import FormPatient from "./FormPatient";
import Pagination from "../Components/Pagination";
import ManageItem from "../Components/ManageItem";

import useFetchItem from "../../hooks/useFetchItem";
import useHead from "../../hooks/useHead";

function PatientDetails() {
	// Get the patient ID from the URL params
	const { id } = useParams();

	const { isEditingOpen } = useSelector((state) => state.menu);
	const {
		isAdmin,
		infos: { role, id: guardianId },
	} = useSelector((state) => state.auth);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	
	// Set title and meta description
	useHead("Détail du patient","Découvrez les informations détaillées sur le patient dans Roméo");
	
	// Custom hook to fetch the patient's details and related data (like care data)
	const { datas, error, totalPages, page, setPage, loading } = useFetchItem({
		url: `/customers/${id}`,
		limit: 5,
		countKey: "care_count",
		dependencies: [isEditingOpen],
		guardian: {role,guardianId},
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
					{isEditingOpen ? (
						<FormPatient data={datas} />
					) : (
						<>
							<ManageItem
								entity={{
									id: datas.id,
									name: `${datas.title} ${datas.firstname} ${datas.lastname}`,
								}}
								link={{
									url: "customers",
									title: "le patient",
								}}
							/>
							<article>
								<header>
									<h1>
										<span>Patient</span>
										{datas.title} {datas.firstname} {datas.lastname}
									</h1>
									{datas.retirement_home && (
										<p>Maison de retraite : {datas.retirement_home.name}</p>
									)}
								</header>

								{/* If the user is not the guardian, display guardian contact details */}
								{datas.guardian && role !== "guardian" && (
									<GuardianContact datas={datas.guardian} isFull={true} />
								)}

								<aside className="wrapper">
									<header>
										<h2>Liste de(s) soin(s) ({datas.care_count})</h2>

										{isAdmin && (
											<button
												className="add-button"
												onClick={() => navigate(`/patients/${id}/soin/ajouter`)}
											>
												Ajouter un soin
											</button>
										)}
									</header>

									{datas.all_cares ? (
										<>
											{datas.all_cares.map((care, index) => (
												<article
													key={care.id}
													onClick={() =>
														navigate(`/patients/${id}/soin/${care.id}`)
													}
													role="button"
													aria-label={`Accèder au soin du ${new Date(care.performed_at).toLocaleDateString()}`}
													tabIndex={index}
												>
													<h3>
														{care.type} du
														<span>
															{new Date(care.performed_at).toLocaleDateString()}
														</span>
													</h3>
													<CareStatus
														invoice_paid={care.invoice_paid}
														invoice_send={care.invoice_send}
													/>
												</article>
											))}

											{datas.care_count && (
												<Pagination
													page={page}
													totalPages={totalPages}
													onPageChange={(newPage) => setPage(newPage)}
												/>)}
										</>
									) : (
										<p>Aucun soin trouvé</p>
									)}
								</aside>
							</article>
						</>
					)}
				</>
			)}
		</>
	);
}

export default PatientDetails;
