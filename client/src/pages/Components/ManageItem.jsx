import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import RemoveEntity from "../RemoveEntity";

import { toggleModal, toggleEditing } from "../../features/menuSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

function ManageItem({ entity, link }) {
	const { isAdmin } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	function handleRedirection() {
		const segments = location.pathname.split("/").filter(Boolean);
		console.log(segments);

		if (segments.length === 2) {
			const path = segments[0];

			navigate(`/${path}`);
		} else if (segments.length > 2) {
			const path = segments[0];
			const id = segments[1];

			navigate(`/${path}/${id}`);
		}
	}

	return (
		<>
			{isAdmin && entity ? (
				<>
					<RemoveEntity entity={entity} link={link} />
					<div className="actions">
						<button
							className="back-button"
							onClick={() => {
								handleRedirection();
							}}
						>
							<FontAwesomeIcon icon={faAngleLeft} />
						</button>
						<button
							className="update-button"
							onClick={() => {
								dispatch(toggleEditing(true));
							}}
						>
							Modifier
						</button>
						<button
							className="delete-button"
							onClick={() => {
								dispatch(toggleModal(true));
							}}
						>
							Supprimer
						</button>
					</div>
				</>
			) : null}
		</>
	);
}

export default ManageItem;
