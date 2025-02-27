import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const { isLogged } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function onChangeEmail(e) {
    setEmail(e.target.value);
  }

  function onChangePassword(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:9000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const resJSON = await res.json();

      console.log(resJSON);

      if (res.ok) {
        dispatch(login(resJSON.user));
        navigate("/");
      }
      setMessage(resJSON.message);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={onChangeEmail}
        placeholder="Entrer votre email"
      />
      <label htmlFor="password">Mot de passe</label>
      <input
        type="password"
        id="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={onChangePassword}
        placeholder="Entrer votre mot de passe"
      />

      {message && <p>{message}</p>}

      <button type="submit">Se connecter</button>
    </form>
  );
}

export default Login;
