import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { login, logout } from "../features/authSlice";
import { customFetch } from "../service/api.js";

function ProtectedRoute() {
	const dispatch = useDispatch();
	
	// Get the authentication state from Redux
	const { isLogged } = useSelector((state) => state.auth);

	// Local state to track if we are still verifying the session
	const [isVerifying, setIsVerifying] = useState(true);

	useEffect(() => {
		// Function to check if the user's token/session is still valid
		async function checkToken() {
			
			const options = {
				method: "POST",
				credentials: "include",
			};

			try {
				// Attempt to refresh the session by calling the backend
				const res = await customFetch("/auth/refresh-login", options);
				const resJSON = await res.json();

				if (res.ok) {
					// If successful, log in the user with the returned data
					dispatch(login(resJSON.user));
				} else {
					dispatch(logout());
				}
			} catch (error) {
				dispatch(logout());
			} finally {
				// In any case, verification process is done
				setIsVerifying(false);
			}
		}

		if (isLogged) {
			// If already logged in, skip verification
			setIsVerifying(false);
		} else {
			// Otherwise, check if the session can be refreshed
			checkToken();
		}
	}, [isLogged, dispatch]);

	// While verifying, display a loading message
	if (isVerifying) {
		return <p>Chargement…</p>;
	}

	if (!isLogged) {
		return <Navigate to="/login" />;
	}

	// If everything is fine, render the child routes
	return <Outlet />;
}

export default ProtectedRoute;
