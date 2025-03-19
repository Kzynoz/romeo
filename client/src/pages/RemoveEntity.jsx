import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function RemoveEntity({ idItem }) {
	const { id } = useParams();
	const [isVerifying, setIsVerifying] = useState(true);
	const [message, setMessage] = useState("");
	const [formData, setFormData] = useState({ id: idItem });

	async function handleSubmit(e) {
		e.preventDefault();

		try {
			const res = await fetch(
				`http://localhost:9000/api/v1/retirement-homes/${formData.id}`,
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

			setMessage(resBody.message);
		} catch (error) {
			console.log("Erreur lors de la mise à jour", error);
			setMessage("Une erreur est survenue, veuillez réessayer....");
		}
	}

	useEffect(() => {
		if (id != idItem) {
			return setIsVerifying(false);
		}
	}, []);

	return (
		<>
			{isVerifying ? (
				<div className="modal">
					<p>Voulez vous vraiment supprimer cet établissement ?</p>
					<form onSubmit={handleSubmit}>
						<input type="hidden" name="id" value={formData.id} />
						<button type="submit">Confirmer la suppression</button>
						{message && <p>{message}</p>}
					</form>
				</div>
			) : null}
		</>
	);
}

export default RemoveEntity;
