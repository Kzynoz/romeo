import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CareStatus from "./Components/CareStatus";
import SearchBar from "./Components/SearchBar/SearchBar";
import Pagination from "./Components/Pagination";

import { useFetchData } from "../hooks/useFetchData";

function Care() {
	const navigate = useNavigate();

	// Custom hook for fetching care data with pagination
	const { datas, error, totalPages, page, setPage, loading } = useFetchData(
		"/care",
		10
	);

	// Handle loading state
	if (loading) {
		return <p>Chargement...</p>;
	}

	// Handle error state
	if (error) {
		return <p>{error}</p>;
	}

	return (
		<>
			<header>
				<h1>Mes Soins</h1>
				<p>Ici tu retrouveras la liste de tous tes soins effectués</p>
			</header>
			
			{/* Search bar component for searching care */}
			<SearchBar entityType={"care"} />

			<section className="wrapper">
				{datas.length && (
					<>
						{datas.map((data) => (
							<article
								key={data.care.id}
								onClick={() =>
									navigate(`/patients/${data.patient.id}/soin/${data.care.id}`)
								}
							>
								<h2>
									{data.care.type}
									<span>
										{new Date(data.care.performed_at).toLocaleDateString()}
									</span>
								</h2>
								<h3>
									{data.patient.title} {data.patient.firstname}{" "}
									{data.patient.lastname}
								</h3>
								<p>
									<strong>Praticien:</strong> {data.practitioner.alias}
								</p>

								<CareStatus
									invoice_paid={data.care.invoice_paid}
									invoice_send={data.care.invoice_send}
								/>

								<Link
									className="link-desktop"
									to={`/patients/${data.patient.id}/soin/${data.care.id}`}
								>
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

export default Care;