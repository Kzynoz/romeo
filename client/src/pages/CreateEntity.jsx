import Form from "./Components/Form.jsx";
import { formRetirementHome } from "../utils/formStructure/formRetirementHome.js";
import { formGuardian } from "../utils/formStructure/formGuardian.js";
import { formCare } from "../utils/formStructure/formCare.js";

import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function CreateEntity() {
	const { id } = useParams();
	const location = useLocation();
	const path = location.pathname;
	const [settings, setSettings] = useState(null);

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
						<h1>Ajout d'un {settings.title} </h1>
						<Form formStructure={settings.form} />
					</section>
				</>
			)}
		</>
	);
}

export default CreateEntity;
