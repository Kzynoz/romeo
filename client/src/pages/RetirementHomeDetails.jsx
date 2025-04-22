import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import UpdateEntity from "./UpdateEntity";
import ManageItem from "./Components/ManageItem";
import Pagination from "./Components/Pagination";

import useFetchItem from "../hooks/useFetchItem";
import useHead from "../hooks/useHead";

function RetirementHomeDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const { isEditingOpen } = useSelector((state) => state.menu);
	const { isAdmin } = useSelector((state) => state.auth);
	
	// Set title and meta description
	useHead("Détail de l'EHPAD","Découvrez les informations détaillées sur l'établissement");


	// Custom hook to fetch data for a specific retirement home
	const { datas, error, totalPages, page, setPage, loading } = useFetchItem({
		url: `/retirement-homes/${id}`,
		limit: 10,
		countKey: "patients_count",
		dependencies: [isEditingOpen],
	});

	if (loading) {
		return <p>Chargement...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<>
			{datas && (
				<>
					{isEditingOpen ? (
						<UpdateEntity data={datas} />
					) : (
						<>
							<ManageItem
								entity={{ id: datas.id, name: datas.name }}
								link={{
									url: "retirement-homes",
									title: "l'établissement",
								}}
							/>

							<article>
								<header>
									<h1>{datas.name}</h1>
								</header>

								<section className="row-contact">
									<h2>Coordonnées</h2>
									{datas.contact && <p>{datas.contact}</p>}

									<address>
										<p>
											{datas.street} - {datas.city.toUpperCase()}{" "}
											{datas.zip_code}
										</p>
									</address>
								</section>

								<aside className="wrapper">
									<header>
										<h2>
											Liste de(s) patient(s) ({datas.patients_count ?? 0})
										</h2>
										{isAdmin && (
											<button
												className="add-button"
												onClick={() => navigate(`/patients/ajouter`)}
											>
												Ajouter
											</button>
										)}
									</header>

									{datas.patients && datas.patients.length > 0 ? (
										<>
											{datas.patients.map((patient) => (
												<article
													key={patient.id}
													onClick={() => navigate(`/patients/${patient.id}`)}
												>
													<h2>
														{patient.title} {patient.firstname}{" "}
														{patient.lastname}
													</h2>

													<Link
														className="link-desktop"
														to={`/patients/${patient.id}`}
													>
														Consulter
													</Link>
												</article>
											))}

											{datas.patients_count && (
												<Pagination
													page={page}
													totalPages={totalPages}
													onPageChange={(newPage) => setPage(newPage)}
												/>
											)}
										</>
									) : (
										<p>Aucun patient trouvé</p>
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

export default RetirementHomeDetails;