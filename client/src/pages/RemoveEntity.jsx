import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "../features/menuSlice";

function RemoveEntity({ entity, link }) {
	const { id, idSoin } = useParams();
	const navigate = useNavigate();

	console.log("log", entity, link);

	const [isVerifying, setIsVerifying] = useState(true);
	const [message, setMessage] = useState("");
	const [formData, setFormData] = useState({
		id: entity.careId ? entity.careId : entity.id,
		name: entity.name,
	});

	const location = useLocation();
	const path = location.pathname;

	const dispatch = useDispatch();
	const { isModalOpen } = useSelector((state) => state.menu);

	async function handleSubmit(e) {
		e.preventDefault();
		setMessage("");

		try {
			const res = await fetch(
				`http://localhost:9000/api/v1/${link.url}/${formData.id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(formData),
				}
			);

			const resBody = await res.json();

			if (res.ok) {
				setMessage({ status: "success", text: resBody.message });

				setTimeout(() => {
					if (path.includes("/maisons-retraite/")) {
						navigate("/maisons-retraite");
					}

					if (path.includes("/tuteurs/")) {
						navigate("/tuteurs");
					}

					if (path.includes(`/patients/${id}/soin`)) {
						navigate(`/patients/${id}`);
					}

					if (path.includes(`/patients/${id}`)) {
						navigate(`/patients`);
					}

					dispatch(toggleModal(false));
				}, 600);
			}

			setMessage({ status: "error", text: resBody.message });
		} catch (error) {
			setMessage({ status: "error", text: error.message });
		}
	}

	function handleClick(e) {
		dispatch(toggleModal(false));
	}

	useEffect(() => {
		const isValid =
			idSoin && entity.careId
				? idSoin == entity.careId && id == entity.id
				: id == entity.id;

		if (!isValid) {
			return setIsVerifying(false);
		}
	}, []);

	return (
		<>
			{isVerifying ? (
				<section id="modal" className={isModalOpen ? "active" : "close"}>
					<div>
						<button className="close-button" onClick={handleClick}>
							<FontAwesomeIcon icon={faXmark} />
						</button>
						<p>Voulez vous vraiment supprimer {link && link.title}</p>
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								name="name"
								value={formData.name}
								readOnly
							></input>
							<input type="hidden" name="id" value={formData.id} />
							<button type="submit">Confirmer la suppression</button>
						</form>
						<button className="cancel-button" onClick={handleClick}>
							Annuler
						</button>
						{message && <p className={message.status}>{message.text}</p>}
					</div>
				</section>
			) : null}
		</>
	);
}

export default RemoveEntity;
