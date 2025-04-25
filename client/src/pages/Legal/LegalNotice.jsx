import useHead from "../../hooks/useHead";

function LegalNotice() {
  
  	// Set title and meta description
	useHead("Mentions légales","Découvrez les mentions légales de Roméo, votre plateforme de gestion paramédicale. En savoir plus sur nos informations légales et les conditions d'utilisation");
  
    return (
      <article>
        <h1>Mentions légales</h1>
  
        <h2>1. Éditeur du site</h2>
        <p>Nom du projet : <strong>Roméo, votre assistance paramédicale</strong></p>
        <p>Responsable de la publication : <strong>Julien Bellet</strong></p>
        <p>Email : <a href="mailto:j.belletofi@gmail.com">j.belletofi@gmail.com</a></p>
  
        <h2>2. Hébergeur du site</h2>
        <address>
          Hébergeur : <em>3W Academy</em><br />
          Adresse : <em>214, boulevard Raspail - 75014 Paris</em><br />
          Email : <a href="mailto:paris@3wacademy.fr">paris@3wacademy.fr</a><br/>
          Téléphone : <em>+33 1 76 40 11 59</em>
        </address>
  
        <h2>3. Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu présent sur le site Roméo (textes, images, logo, graphismes, etc.) est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
        <p>Toute reproduction, distribution ou utilisation sans autorisation est interdite.</p>
  
        <h2>4. Protection des données personnelles</h2>
        <p>Les informations collectées via le site sont destinées exclusivement à l'usage de Roméo pour la gestion des comptes des professionnels de santé.</p>
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de modification et de suppression de vos données personnelles.</p>
        <p>Pour exercer vos droits, veuillez contacter : <a href="mailto:j.belletofi@gmail.com">j.belletofi@gmail.com</a>.</p>
  
        <h2>5. Cookies</h2>
        <p>Le site peut utiliser des cookies pour améliorer l'expérience utilisateur.</p>
        <p>Vous pouvez configurer votre navigateur pour refuser les cookies si vous le souhaitez.</p>
        <p>Dans le cadre de la sécurisation des accès, le site utilise un cookie d'authentification permettant de maintenir la session utilisateur active. Ce cookie, strictement nécessaire au fonctionnement du service, contient un jeton sécurisé. Il est conservé uniquement pendant la durée de la session.</p>
  
        <h2>6. Responsabilité</h2>
        <p>Roméo met tout en œuvre pour fournir un site fiable, mais ne saurait être tenu responsable des éventuelles erreurs, interruptions ou pertes de données.</p>
      </article>
    );
  }
  
  export default LegalNotice;
  