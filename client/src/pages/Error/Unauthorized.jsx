import useHead from "../../hooks/useHead";

import { useSelector } from "react-redux";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

function Unauthorized() {
	
	const { isLogged } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	
	useEffect(() => {
		if(isLogged) {
			navigate("/");
		}
	}, [isLogged])
	
	// Set title and meta description
	useHead("Accès non autorisé","Vous n'avez pas les accès nécessaires pour accèder à cette page.");
	
	return (
		<section>
		<h1>Non autorisé</h1>
			<p>
				Vous n'avez pas les autorisations nécessaires pour accèder à cette page…
			</p>
		</section>
	);
}

export default Unauthorized;
