import Form from "./Components/Form.jsx";
import { formRetirementHome } from "../utils/formStructure/formRetirementHome.js";
import { formGuardian } from "../utils/formStructure/formGuardian.js";
import { formCare } from "../utils/formStructure/formCare.js";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function CreateEntity() {
	const { id } = useParams();
	const location = useLocation();
	const path = location.pathname;
	const [settings, setSettings] = useState(null);
	const navigate = useNavigate();

	function handleRedirection() {
		const segments = path.split("/").filter(Boolean);

		console.log(segments);

		if (segments.length > 2) {
			navigate(`/${segments[0]}/${segments[1]}`);
			return;
		}

		navigate(`/${segments[0]}`);
	}

	useEffect(() => {
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
