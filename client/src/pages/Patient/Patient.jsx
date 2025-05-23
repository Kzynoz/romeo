import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import CareStatus from "../Components/CareStatus";
import SearchBar from "../Components/SearchBar/SearchBar";
import Pagination from "../Components/Pagination";

import { useFetchData } from "../../hooks/useFetchData";
import useHead from "../../hooks/useHead";

function Patient() {
	const {
		isAdmin,
		infos: { role, id },
	} = useSelector((state) => state.auth);

	const navigate = useNavigate();
	
	// Set title and meta description
	useHead("Liste des patients","Consultez et gérez la liste de vos patients, leur historique de soins et leurs informations personnelles sur Roméo, l'outil de gestion paramédicale.");


	// Custom hook to fetch data for patients
	const { datas, error, totalPages, page, setPage, loading } = useFetchData(
		"/customers",
		10,
		{ role, id }
	);

	if (loading) {
		return <p>Chargement...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<>
			<header>
				<h1>Mes patients</h1>
				<p>Ici tu retrouveras la liste de tous tes patients</p>
			</header>
			<SearchBar entityType={"patient"} />
			<section className="wrapper">
				{isAdmin && (
					<button
						className="add-button"
						onClick={() => {
							navigate("/patients/ajouter");
						}}
					>
						Ajouter un patient
					</button>
				)}

				{datas.length && (
					<>
						{datas.map((patient, index) => (
							<article
								key={patient.id}
								onClick={() => navigate(`/patients/${patient.id}`)}
								role="button"
								tabIndex={index}
								aria-label={`Accèder à la fiche de ${patient.firstname} ${patient.lastname}`}
							>
								<h2>
									{patient.title} {patient.firstname} {patient.lastname}
								</h2>
								<p>
									<strong>Tuteur:</strong> {patient.guardian.title}{" "}
									{patient.guardian.firstname} {patient.guardian.lastname}{" "}
									{patient.guardian?.relationship === "société" && (
										<span className="society">{patient.guardian.company}</span>
									)}
								</p>

								{patient.latest_care && (
									<aside>
										<p>
											<strong>Dernier soin:</strong>{" "}
											{new Date(
												patient.latest_care.performed_at
											).toLocaleDateString()}
										</p>
										<CareStatus
											invoice_paid={patient.latest_care.invoice_paid}
											invoice_send={patient.latest_care.invoice_send}
										/>
									</aside>
								)}

								<Link className="link-desktop" to={`/patients/${patient.id}`}>
									Consulter
								</Link>
							</article>
						))}

						<Pagination
							page={page}
							totalPages={totalPages}
							onPageChange={(newPage) => setPage(newPage)}
						/>
					</>
				)}
			</section>
		</>
	);
}

export default Patient;