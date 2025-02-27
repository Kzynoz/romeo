import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../features/authSlice";
import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogged } = useSelector((state) => state.auth);
  const [isVerifying, setIsVerifying] = useState(true);
  const [message, setMessage] = useState("");

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
          dispatch(login(resJSON.user));
        } else {
          dispatch(logout());
          navigate("/login");
        }
      } catch (resJSON) {
        setMessage(resJSON);
        dispatch(logout());
        navigate("/login");
      } finally {
        setIsVerifying(false);
      }
    }

    if (isLogged) {
      setIsVerifying(false);
    } else {
      checkToken();
    }
  }, [isLogged, dispatch, navigate]);

  if (isVerifying) {
    return <p>Chargement…</p>;
  }

  return children;
}

ProtectedRoute.PropTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
