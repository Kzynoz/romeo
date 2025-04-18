import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBuilding,
	faEnvelope,
	faPhone,
} from "@fortawesome/free-solid-svg-icons";

/** 
 * Guardian Contact component displays guardia'sn contact details, address, name, email, phone…
 * 
 * @params {object} datas - Data fetch from the API
 * @params {bool}   isFull - Boolean to display a full contact list 
 * 
 * @returns - Rendered component displays guardians's details
 */
function GuardianContact({ datas, isFull }) {
	// Clean and extract the necessary data from the passed 'datas' object
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
					{street && city && zipCode && (
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

GuardianContact.propTypes = {
	datas: PropTypes.object.isRequired,
	isFull: PropTypes.bool.isRequired,
};

export default GuardianContact;
