import useHead from "../../hooks/useHead";

function PrivacyPolicy() {
	
	// Set title and meta description
	useHead("Politique de confidentialité","Découvrez les mentions légales de Roméo, votre plateforme de gestion paramédicale. En savoir plus sur nos informations légales et les conditions d'utilisation");
	
	return (
		<article>
			<h1>Politique de Confidentialité</h1>

			<h2>1. Responsable du traitement</h2>
			<p>Le responsable du traitement des données est : <strong>Julien Bellet</strong>, joignable à <a href="mailto:j.belletofi@gmail.com">j.belletofi@gmail.com</a>.
			</p>

			<h2>2. Données collectées</h2>
			<p>Le site peut collecter et traiter les données suivantes :</p>
			<ul>
				<li>
					Informations d'identification (identité, email, rôle professionnel)
				</li>
				<li>Données de connexion (adresse IP, cookies d'authentification)</li>
			</ul>

			<h2>3. Utilisation des données</h2>
			<p>Les données sont utilisées pour :</p>
			<ul>
				<li>
					Permettre l'authentification sécurisée des utilisateurs via un cookie
					contenant un jeton de session (JWT).
				</li>
				<li>
					Gérer l'accès aux fonctionnalités réservées aux professionnels de
					santé.
				</li>
			</ul>

			<h2>4. Cookies</h2>
			<p>Le site utilise un cookie technique :</p>
			<ul>
				<li>
					<strong>Cookie d'authentification :</strong> ce cookie contient un
					jeton sécurisé permettant de maintenir votre session active pendant
					votre connexion. Il est strictement nécessaire au fonctionnement du
					site et est supprimé à la déconnexion.
				</li>
			</ul>
			<p>Aucun cookie publicitaire ou de suivi tiers n'est utilisé.</p>

			<h2>5. Durée de conservation</h2>
			<p>
				Les données liées aux sessions sont conservées uniquement pendant la
				durée de la session utilisateur.
			</p>

			<h2>6. Sécurité</h2>
			<p>
				Toutes les mesures techniques appropriées sont mises en œuvre pour
				garantir la sécurité de vos données (chiffrement des jetons, accès
				restreint).
			</p>

			<h2>7. Droits des utilisateurs</h2>
			<p>Conformément au RGPD, vous disposez :</p>
			<ul>
				<li>d'un droit d'accès,</li>
				<li>d'un droit de rectification,</li>
				<li>d'un droit à l'effacement,</li>
				<li>d'un droit à la limitation du traitement.</li>
			</ul>
			<p>
				Pour exercer ces droits, contactez :{" "}
				<a href="mailto:j.belletofi@gmail.com">j.belletofi@gmail.com</a>.
			</p>

			<h2>8. Hébergement</h2>
			<address>
				Le site est hébergé par <em>3W Academy</em> sur des serveurs situés en
				France.
				<br />
				Adresse : 214, boulevard Raspail - 75014 Paris
				<br />
				Email : <a href="mailto:paris@3wacademy.fr">paris@3wacademy.fr</a>
				<br />
				Téléphone : +33 1 76 40 11 59
			</address>

			<h2>9. Modifications</h2>
			<p>
				La présente Politique de Confidentialité pourra être modifiée. Toute
				modification sera signalée sur cette page.
			</p>
		</article>
	);
}

export default PrivacyPolicy;
