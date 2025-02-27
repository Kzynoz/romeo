import { Link } from "react-router-dom";

function ContactDetails({ person, isPatient, isGuardian }) {
	if (!person) return null;

	const { title, firstname, lastname, phone, guardian, retirement_home } =
		person;

	console.log("props contactDetails", guardian);
	return (
		<>
			<header>
				<h1>
					{title} {firstname} {lastname}
				</h1>
				<address>
					{phone && (
						<>
							<p>Coordonnées</p>
							<p>
								Téléphone :
								<a href={`tel:+${phone}`} target="_blank">
									{phone}
								</a>
							</p>
						</>
					)}

					{retirement_home && (
						<>
							<p>Maison de retraite :</p>
							<p>
								<Link to={`/ehpads/${retirement_home.id}`}>
									{retirement_home.name}
								</Link>
							</p>
						</>
					)}
				</address>
			</header>

			{guardian && (
				<section>
					<h2>Sous tutuelle</h2>
					<p>
						{guardian.title} {guardian.firstname} {guardian.lastname} (
						{guardian.relationship})
					</p>

					{guardian.company && <p>Société : {guardian.company} </p>}

					<address>
						{guardian.address && (
							<p>
								{guardian.address.street} - {guardian.address.city}{" "}
								{guardian.address.zip_code}
							</p>
						)}

						<a href={`mailto:${guardian.email}`} target="_blank">
							{guardian.email}
						</a>

						<a href={`tel:+${guardian.phone}`} target="_blank">
							{guardian.phone}
						</a>
					</address>
				</section>
			)}
		</>
	);
}

export default ContactDetails;
