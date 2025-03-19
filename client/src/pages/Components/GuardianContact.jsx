import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBuilding,
	faEnvelope,
	faPhone,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function GuardianContact({ datas, isFull }) {
	const title = datas.title || datas.details?.title;
	const firstname = datas.firstname || datas.details?.firstname;
	const lastname = datas.lastname || datas.details?.lastname;
	const relationship = datas.relationship;
	const company = datas.company;
	const street = datas.address?.street;
	const city = datas.address?.city;
	const zipCode = datas.address?.zip_code;
	const email = datas.email || datas.details?.email;
	const phone = datas.phone || datas.details?.phone;

	return (
		<>
			<section className="row-guardian">
				<h2>{isFull ? "Sous tutelle" : "Coordonnées"}</h2>
				<p>
					{isFull && (
						<strong>
							{title} {firstname} {lastname}
							{relationship !== "société" && `(${relationship})`}
						</strong>
					)}

					{company && (
						<span>
							<FontAwesomeIcon icon={faBuilding} /> Société: {company}
						</span>
					)}
				</p>

				<address>
					{datas.address && (
						<p>
							{street} - {city.toUpperCase()} {zipCode}
						</p>
					)}

					{email && (
						<a href={`mailto:${email}`} target="_blank">
							<FontAwesomeIcon icon={faEnvelope} /> {email}
						</a>
					)}

					{phone && (
						<a href={`tel:+${phone}`} target="_blank">
							<FontAwesomeIcon icon={faPhone} /> {phone}
						</a>
					)}
				</address>
			</section>
		</>
	);
}

export default GuardianContact;

GuardianContact.propTypes = {
	datas: PropTypes.object.isRequired,
	isFull: PropTypes.bool.isRequired,
};
