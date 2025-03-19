import AddForm from "./Components/AddForm.jsx";
import { formRetirementHome } from "../utils/formStructure.js";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function CreateEntity() {
	const location = useLocation();
	const path = location.pathname;
	const [route, SetRoute] = useState(null);

	useEffect(() => {
		function handleRoute() {
			if (path === "/maisons-retraite/ajouter") {
				return SetRoute({ title: "établissement", form: formRetirementHome });
			}
		}
		handleRoute();
	}, []);

	return (
		<>
			{!route ? (
				<p>Une erreur est survenue. Veuillez réessayer</p>
			) : (
				<>
					<header>
						<h1>Ajout d'un établissement</h1>
					</header>
					<section className="add-form">
						<AddForm form={formRetirementHome} />
					</section>
				</>
			)}
		</>
	);
}

export default CreateEntity;
