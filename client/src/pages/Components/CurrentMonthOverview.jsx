import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CurrentMonthOverview() {
	const [datas, setDatas] = useState("");
	const [currentMonth, setCurrentMont] = useState(null);

	useEffect(() => {
		const month = new Intl.DateTimeFormat("fr-FR", {
			month: "long",
		}).format(new Date());
		setCurrentMont(
			month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()
		);

		async function fetchTotalCare() {
			try {
				const res = await fetch(
					"http://localhost:9000/api/v1/care/count-this-month",
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
			}
		}
		fetchTotalCare();
	}, []);

	return datas ? (
		<aside>
			{currentMonth ? (
				<h2>Récapitulatif de {currentMonth}</h2>
			) : (
				<h2>Récapitulatif</h2>
			)}
			<p>
				Vous avre effectué: <strong>{datas.total_care}</strong> soins ce mois-ci
			</p>
			<p>
				Soit un CA prévisionnel de:{" "}
				<strong>
					{datas.total_revenue_paid && datas.total_revenue_estimated ? (
						<>
							{datas.total_revenue_paid} / {datas.total_revenue_estimated} €
						</>
					) : (
						"0 €"
					)}
				</strong>
			</p>
			<Link to="statistiques">Consulter les statistiques</Link>
		</aside>
	) : null;
}

export default CurrentMonthOverview;
