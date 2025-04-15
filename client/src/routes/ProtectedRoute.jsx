import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { login, logout } from "../features/authSlice";

function ProtectedRoute() {
	const dispatch = useDispatch();
	const { isLogged } = useSelector((state) => state.auth);

	const [isVerifying, setIsVerifying] = useState(true);

	useEffect(() => {
		async function checkToken() {
			try {
				const res = await fetch(
					"http://localhost:9000/api/v1/auth/refresh-login",
					{
						method: "POST",
						credentials: "include",
					}
				);

				const resJSON = await res.json();

				if (res.ok) {
					console.log(resJSON.user);
					dispatch(login(resJSON.user));
				} else {
					dispatch(logout());
					//navigate("/login");
				}
			} catch (error) {
				//	setMessage(error.message);
				dispatch(logout());
				//	navigate("/login");
			} finally {
				setIsVerifying(false);
			}
		}

		if (isLogged) {
			setIsVerifying(false);
		} else {
			checkToken();
		}
	}, [isLogged, dispatch]);

	if (isVerifying) {
		return <p>Chargement…</p>;
	}

	if (!isLogged) {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
}

export default ProtectedRoute;
