import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CareStatus from "./Components/CareStatus";
import SearchBar from "./Components/SearchBar/SearchBar";

function Care() {
	const [datas, setDatas] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchPatients() {
			try {
				const res = await fetch("http://localhost:9000/api/v1/care", {
					credentials: "include",
				});

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
				<h1>Mes Soins</h1>
				<p>Ici tu retrouveras la liste de tous tes soins effectués</p>
			</header>

			<SearchBar entityType={"care"} />

			<section className="wrapper">
				<button onClick={"coucou"}>Ajouter un soin</button>
				{error && <p>{error}</p>}

				{!datas.length ? (
					<p>Chargement…</p>
				) : (
					datas.map((data) => (
						<article
							key={data.care.id}
							onClick={() =>
								navigate(`/patients/${data.patient.id}/soin/${data.care.id}`)
							}
						>
							<h2>
								Soin{" "}
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
						</article>
					))
				)}
			</section>
		</>
	);
}

export default Care;
