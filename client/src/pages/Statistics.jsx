import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import StatisticsOverview from "./Components/StatisticsOverview";

import { useFetchData } from "../hooks/useFetchData";
import useHead from "../hooks/useHead";


function Statistics() {
	// Get the year parameter from the URL
	const { year } = useParams();
	
	// Set title and meta description
	useHead("Statistiques de l'année en cours","Accédez aux statistiques détaillées de votre activité paramédicale avec Roméo, pour une analyse précise de vos performances et de vos soins.");

	// Use custom hook to fetch data for the selected year
	const { datas, error, loading } = useFetchData(`/care/count-by-year/${year}`);

	if (loading) {
		return <p>Chargement...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<>
			<header>
				<h1>Statistiques</h1>
				<p>Voici les statistiques de l'année en cours</p>
			</header>

			{datas && datas.months && datas.year == year ? (
				<>
					{/* Render the overview statistics */}
					<StatisticsOverview isFull={false} data={datas.months} />

					<section className="wrapper">
						{datas.months.map((data) => (
							<article key={data.month}>
								<h2>
									{new Date("2025", data.month - 1).toLocaleString("fr-FR", {
										month: "long",
										year: "numeric",
									})}
								</h2>
								<p>
									<strong>Nombre de soins:</strong> {data.total_entries}
								</p>
								<p>Réglé: {data.total_revenue_paid} €</p>
								<p>Facturé: {data.total_revenue_estimated} € </p>
								<p>
									Total:{" "}
									{data.total_revenue_paid + data.total_revenue_estimated} €
								</p>
							</article>
						))}
					</section>
				</>
			) : (
				<p>Aucunes statistiques disponibles</p>
			)}
		</>
	);
}

export default Statistics;
