import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import SearchBar from "./Components/SearchBar/SearchBar";
import Pagination from "./Components/Pagination";

import { useFetchData } from "../hooks/useFetchData";

function RetirementHome() {
	// Retrieve the user's role (isAdmin) from the Redux store
	const { isAdmin } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	
	// Custom hook to fetch the list of retirement homes
	const { datas, error, totalPages, page, setPage, loading } = useFetchData(
		"/retirement-homes",
		10,
	);
	
	if (loading) {
        return <p>Chargement...</p>
    }

    if (error) {
        return <p>{error}</p>;
    }

	return (
		<>
			<header>
				<h1>Les maisons de retraite</h1>
				<p>
					Ici tu retrouveras la liste de toutes les maisons de retraite ou foyer
				</p>
			</header>

			<SearchBar entityType={"retirement home"} />

			<section className="wrapper">
			
				{isAdmin && (
					<button
						className="add-button"
						onClick={() => navigate(`/maisons-retraite/ajouter`)}
					>
						Ajouter un établissement
					</button>
				)}
				
				{/* Display the list of retirement homes if available */}
				{datas.length && (
					<>
						{datas.map((establishment) => (
							<article
								key={establishment.id}
								onClick={() =>
									navigate(`/maisons-retraite/${establishment.id}`)
								}
							>
								<h2>{establishment.name}</h2>

								{establishment.patients_count > 0 && (
									<span>
										<strong>Nombre de patiens:</strong>
										{establishment.patients_count}
									</span>
								)}

								<Link
									className="link-desktop"
									to={`/maisons-retraite/${establishment.id}`}
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

export default RetirementHome;
