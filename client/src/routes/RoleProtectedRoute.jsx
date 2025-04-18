import { useSelector } from "react-redux";

import PropTypes from "prop-types";

import { Navigate, Outlet } from "react-router-dom";

/**
 * RoleProtectedRoute component to protect specific routes based on user role
 *
 * @params {string} requiredRole - The role required to access the route
 * 
 * @returns - The child routes if access is allowed, otherwise a redirection
 */

function RoleProtectedRoute({ requiredRole }) {
	
	// Extract the user's role from the Redux store
	const {
		infos: { role },
	} = useSelector((state) => state.auth);

	// If the user's role does not match the required role, redirect to unauthorized page
	if (role !== requiredRole) {
		return <Navigate to="/non-autorise" />;
	}

	// If the role matches, render the child routes
	return <Outlet />;
}

RoleProtectedRoute.propTypes = {
	requiredRole: PropTypes.string.isRequired,
};

export default RoleProtectedRoute;
