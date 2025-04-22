import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Form from "./Components/Form.jsx";

import { formRetirementHome } from "../utils/formStructure/formRetirementHome.js";
import { formGuardian } from "../utils/formStructure/formGuardian.js";
import { formCare } from "../utils/formStructure/formCare.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import useHead from "../hooks/useHead";


/**
 * This component is uses for rendering a form to create a new entity (such as a retirement home, guardian, or care)
 * It dynamically sets the form structure based on the current route, and redirects the user to the appropriate page
 * 
 * @returns - The form for creating the entity or an error message if the settings are not available.
 */

function CreateEntity() {
	const { id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const path = location.pathname;

	const [settings, setSettings] = useState(null);
	
	// Set title and meta description
	useHead(`Ajout d'une entité`,"Ajoutez une entité dans Roméo, la plateforme paramédicale, pour une gestion optimale des soins et des informations.");

	// Redirection based on the URL
	function handleRedirection() {
		const segments = path.split("/").filter(Boolean);

		if (segments.length > 2) {
			navigate(`/${segments[0]}/${segments[1]}`);
			return;
		}

		navigate(`/${segments[0]}`);
	}

	useEffect(() => {
		// Setting up the entity to be updated based on the URL
		function handleRoute() {
			if (path === "/maisons-retraite/ajouter") {
				return setSettings({
					title: "établissement",
					form: formRetirementHome,
				});
			}

			if (path === "/tuteurs/ajouter") {
				return setSettings({ title: "tuteur", form: formGuardian });
			}

			if (path === `/patients/${id}/soin/ajouter`) {
				return setSettings({ title: "soin", form: formCare });
			}
		}

		handleRoute();
	}, [path]);

	return (
		<>
			{!settings ? (
				<p>Une erreur est survenue. Veuillez réessayer</p>
			) : (
				<>
					<section>
						<header>
							<h1>Ajout d'un {settings.title} </h1>
							<button
								className="close-button"
								onClick={() => {
									handleRedirection();
								}}
							>
								<FontAwesomeIcon icon={faXmark} />
							</button>
						</header>

						<Form formStructure={settings.form} />
					</section>
				</>
			)}
		</>
	);
}

export default CreateEntity;
