import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import SearchBar from "../Components/SearchBar/SearchBar";
import Pagination from "../Components/Pagination";

import { useFetchData } from "../../hooks/useFetchData";
import useHead from "../../hooks/useHead";


function Guardian() {
	// Get the 'isAdmin' flag from the Redux store (to check if the user is an admin)
	const { isAdmin } = useSelector((state) => state.auth);

	// Hook to navigate programmatically to different routes
	const navigate = useNavigate();
	
	// Set title and meta description
	useHead("Tuteurs","Gérez les informations relatives aux tuteurs de vos patients avec Roméo, une plateforme qui simplifie le suivi et la coordination avec les proches.");
	
	// Custom Hook to fetch the guardians' data (using a URL and a page size of 10)
	const { datas, error, totalPages, page, setPage, loading } = useFetchData(
		"/guardians",
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
				<h1>Les tuteurs</h1>
				<p>Ici tu retrouveras la liste de tous les tuteurs</p>
			</header>
			
			<SearchBar entityType={"guardian"} />
			
			<section className="wrapper">
			
				{isAdmin && (
					<button
						className="add-button"
						onClick={() => navigate(`/tuteurs/ajouter`)}
					>
						Ajouter un tuteur
					</button>
				)}
				
				{datas.length && (
					<>
						{datas.map((guardian) => (
						
							<article
								key={guardian.id}
								onClick={() => navigate(`/tuteurs/${guardian.id}`)}
							>
								<h2>
									{guardian.title} {guardian.firstname} {guardian.lastname}{" "}
									{guardian.company && (
										<span className="society"> {guardian.company}</span>
									)}
								</h2>

								{guardian.guardianship_count > 0 && (
									<span>
										<strong>Nombre de tutelles:</strong>
										{guardian.guardianship_count}
									</span>
								)}

								<Link className="link-desktop" to={`/tuteurs/${guardian.id}`}>
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

export default Guardian;
