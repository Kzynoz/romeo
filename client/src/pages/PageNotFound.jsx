import { Link } from "react-router-dom";

function PageNotFound() {
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
