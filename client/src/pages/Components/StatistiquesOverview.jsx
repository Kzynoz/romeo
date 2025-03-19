import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function StatistiquesOverview({ data, isFull }) {
	const [datas, setDatas] = useState("");

	const totalEstimatedRevenue =
		data && data.length > 0
			? data.reduce(
					(total, income) => total + income.total_revenue_estimated,
					0
			  )
			: 0;

	const totalPaidRevenue =
		data && data.length > 0
			? data.reduce((total, income) => total + income.total_revenue_paid, 0)
			: 0;

	const totalCare =
		data && data.length > 0
			? data.reduce((total, income) => total + income.total_entries, 0)
			: 0;

	const date = new Date().toLocaleDateString("fr-FR", {
		month: "long",
		year: "numeric",
	});

	useEffect(() => {
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
			{data && (
				<section className="total-income">
					<h2>Récapitulatif de {date.split(" ")[1]}</h2>
					<p>
						Vous avez effectué: <strong>{totalCare}</strong> soins cette année
					</p>
					<p>Réglé: {totalPaidRevenue} €</p>
					<p>Facturé: {totalEstimatedRevenue} € </p>
					<p>Total: {totalPaidRevenue + totalEstimatedRevenue} €</p>
				</section>
			)}

			<section>
				<h2>
					Récapitulatif de{" "}
					{date.charAt(0).toUpperCase() + date.slice(1).toLowerCase()}
				</h2>
				<p>
					Vous avez effectué: <strong>{datas.total_care}</strong> soins ce
					mois-ci
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

				{isFull && (
					<Link to={`statistiques/${date.split(" ")[1]}`}>
						Consulter les statistiques
					</Link>
				)}
			</section>
		</aside>
	) : null;
}

export default StatistiquesOverview;

StatistiquesOverview.propTypes = {
	isFull: PropTypes.bool.isRequired,
};
