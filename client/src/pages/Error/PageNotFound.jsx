import { Link } from "react-router-dom";

import useHead from "../../hooks/useHead";

function PageNotFound() {
	
		// Set title and meta description
	useHead("404 - Page non trouvée","Page non trouvée - Désolé, la page que vous recherchez n'existe pas sur Roméo. Retournez à l'accueil ou explorez les autres sections pour trouver ce que vous cherchez.");
	
	return (
		<>
			<h1>404 - Page non trouvée</h1>
			<p>
				La page que vous cherchez n'existe pas. Retournez à{" "}
				<Link to="/">l'accueil</Link>
			</p>
		</>
	);
}

export default PageNotFound;
