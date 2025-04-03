import Form from "./Components/Form.jsx";
import { formRetirementHome } from "../utils/formStructure/formRetirementHome.js";
import { formGuardian } from "../utils/formStructure/formGuardian.js";
import { formCare } from "../utils/formStructure/formCare.js";

import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function UpdateEntity({ data }) {
	const { id, idSoin } = useParams();
	const location = useLocation();
	const path = location.pathname;

	const [formSetting, setFormSetting] = useState(null);
	const [formData, setFormData] = useState({});
	const [isVerifying, setIsVerifying] = useState(false);

	useEffect(() => {
		function handleRoute() {
			if (path === `/maisons-retraite/${id}`) {
				setFormSetting({
					title: "l'établissement",
					form: {
						...formRetirementHome,
						url: `retirement-homes/${id}`,
					},
				});

				if (data.name && data.street && data.city && data.zip_code) {
					const filtredData = {
						name: data.name,
						contact: data.contact || null,
						street: data.street,
						city: data.city,
						zip_code: data.zip_code,
					};

					setFormData(filtredData);
				} else {
					setIsVerifying(true);
				}
			}

			if (path === `/tuteurs/${id}`) {
				setFormSetting({
					title: "le tuteur",
					form: {
						...formGuardian,
						url: `guardians/${id}`,
					},
				});

				if (data.details) {
					const filtredData = {
						title: data.details.title,
						firstname: data.details.firstname,
						lastname: data.details.lastname,
						phone: data.details.phone || null,
						email: data.details.email,
						relationship: data.relationship,
						company: data.company || null,
						street: data.address?.street || null,
						city: data.address?.city || null,
						zip_code: data.address?.zip_code || null,
					};

					setFormData(filtredData);
				} else {
					setIsVerifying(true);
				}
			}

			if (path === `/patients/${id}/soin/${idSoin}`) {
				setFormSetting({
					title: "le soin",
					form: {
						...formCare,
						url: `care/${id}`,
					},
				});

				if (data.care) {
					const date = new Date(data.care.performed_at).toLocaleDateString(
						"fr-CA"
					);
					console.log("raw date", data.care.performed_at);
					console.log("form update date", date);

					const filtredData = {
						performed_at: date,
						practitioner_id: data.practitioner_id,
						price: data.care.price,
						type: data.care.type,
						complements: data.complements || null,
					};

					setFormData(filtredData);
				} else {
					setIsVerifying(true);
				}
			}
		}
		handleRoute();
		console.log(data);
	}, [path, id, data]);

	if (isVerifying) {
		return <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>;
	}

	return (
		<>
			{!formSetting ? (
				<p>Une erreur est survenue. Veuillez réessayer</p>
			) : (
				<>
					<section id="update-form">
						<h1>Modifier {formSetting.title}</h1>
						<Form
							formStructure={formSetting.form}
							initialFormData={formData}
							isUpdated={true}
						/>
					</section>
				</>
			)}
		</>
	);
}

export default UpdateEntity;
