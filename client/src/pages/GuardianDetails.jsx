import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import UpdateEntity from "./UpdateEntity";
import GuardianContact from "./Components/GuardianContact";
import Pagination from "./Components/Pagination";
import ManageItem from "./Components/ManageItem";

import useFetchItem from "../hooks/useFetchItem";
import useHead from "../hooks/useHead";

function GuardianDetails() {
	// Extract the guardian ID from the URL parameters
	const { id } = useParams();

	// Get state values from Redux
	const { isEditingOpen } = useSelector((state) => state.menu);
	const { isAdmin } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	// Set title and meta description
	useHead("Détails du tuteur","Découvrez les informations détaillées sur le tuteur dans Roméo");

	// Custom Hook to fetch data for the specific guardian
	const { datas, error, totalPages, page, setPage, loading } = useFetchItem({
		url: `/guardians/${id}`,
		limit: 5,
		countKey: "guardianship_count",
		dependencies: [isEditingOpen],
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
						<UpdateEntity data={datas.guardian} />
					) : (
						<>
							{/* ManageItem component to display and manage the guardian */}
							<ManageItem
								entity={{
									id: datas.guardian.details.id,
									name: `${datas.guardian.details.title} ${datas.guardian.details.firstname} ${datas.guardian.details.lastname}`,
								}}
								link={{
									url: "guardians",
									title: "le tuteur",
								}}
							/>
							<article>
								<header>
									<h1>
										<span>Tuteur</span>
										{datas.guardian.details.title}{" "}
										{datas.guardian.details.firstname}{" "}
										{datas.guardian.details.lastname}
									</h1>
								</header>

								{datas.guardian && (
									<GuardianContact datas={datas.guardian} isFull={false} />
								)}

								<aside className="wrapper">
									<header>
										<h2>Liste de(s) tutelle(s) ({datas.guardianship_count})</h2>
									</header>

									{datas.patients ? (
										<>
											{datas.patients.map((patient) => (
												<article
													key={patient.id}
													onClick={() => navigate(`/patients/${patient.id}`)}
												>
													<h3>
														{patient.title} {patient.firstname}{" "}
														{patient.lastname}
													</h3>
													{patient.retirement_home && (
														<p className="retirement-home">
															{patient.retirement_home}
														</p>
													)}

													<Link
														className="link-desktop"
														to={`/patients/${patient.id}`}
													>
														Consulter
													</Link>
												</article>
											))}

											{/* Pagination controls for listing the patients */}
											{datas.guardianship_count && (
												<Pagination
													page={page}
													totalPages={totalPages}
													onPageChange={(newPage) => setPage(newPage)}
												/>)
											}
										</>
									) : (
										<p>Aucune tutelle trouvée</p>
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

export default GuardianDetails;
