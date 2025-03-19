import { useEffect, useState } from "react";
import StatistiquesOverview from "./Components/StatistiquesOverview";
import { useParams } from "react-router-dom";

function Statistics() {
	const { year } = useParams();

	const [datas, setDatas] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchPatients() {
			try {
				const res = await fetch(
					`http://localhost:9000/api/v1/care/count-by-year/${year}`,
					{
						credentials: "include",
					}
				);

				if (res.ok) {
					const { response } = await res.json();
					console.log(response);
					setDatas(response);
				}
			} catch (error) {
				console.error("error", error);
				setError(error);
			}
		}
		fetchPatients();
	}, []);

	return (
		<>
			<header>
				<h1>Statistiques</h1>
				<p>Voici les statistiques de l'année en cours</p>
			</header>
			{error && <p>{error}</p>}
			{datas && datas.months && datas.year == year ? (
				<>
					<StatistiquesOverview isFull={false} data={datas.months} />
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
