import useHead from "../hooks/useHead";

function Unauthorized() {
	
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
