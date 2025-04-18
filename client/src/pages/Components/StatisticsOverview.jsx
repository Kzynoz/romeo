import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

import { useFetchData } from "../../hooks/useFetchData";

/**
 * Statistics Overview component displays the summarized statistics
 * 
 * @params {object} data - Statistics data for the year
 * @params {bool}	isFull - Boolean flag to determine if full statistics should be shown 
 * 
 * @returns - Rendered statistics overview or null if data is not available
 */

function StatisticsOverview({ data, isFull }) {
	
	// Custom hook to fetch data from the given API endpoint
	const { datas } = useFetchData(
		"/care/count-this-month"
	);

	// Calculate the total estimated revenue by reducing the data array
	const totalEstimatedRevenue =
		data && data.length > 0
			? data.reduce(
					(total, income) => total + income.total_revenue_estimated,
					0
			  )
			: 0;
			
	// Calculate the total paid revenue
	const totalPaidRevenue =
		data && data.length > 0
			? data.reduce((total, income) => total + income.total_revenue_paid, 0)
			: 0;
			
	// Calculate the total number of care entries
	const totalCare =
		data && data.length > 0
			? data.reduce((total, income) => total + income.total_entries, 0)
			: 0;
			
	// Format the current date to display the month and year
	const date = new Date().toLocaleDateString("fr-FR", {
		month: "long",
		year: "numeric",
	});
	
	// Render the statistics overview if 'datas' is available
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

				{/* Render a link to view more detailed statistics if 'isFull' is true */}
				{isFull && (
				
					<Link to={`statistiques/${date.split(" ")[1]}`}>
						Consulter les statistiques
					</Link>
				)}
			</section>
		</aside>
		) : null;
}

StatisticsOverview.propTypes = {
	isFull: PropTypes.bool.isRequired,
	data: PropTypes.array.isRequired,
};

export default StatisticsOverview;

