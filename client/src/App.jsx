import AppRoutes from "./routes/AppRoutes";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function App() {
	const location = useLocation();
	const path = location.pathname;

	function handleId() {
		if (path === "/") return "home";
		if (/^\/patient\/\d+$/.test(path)) return "patient-details";
		if (/^\/patient\/\d+\/care\/\d+$/.test(path)) return "care-details";

		return location.pathname.slice(1, location.pathname.length);
	}

	return (
		<>
			<Header />

			<main className="container" id={handleId()}>
				<AppRoutes />
			</main>

			<Footer />
		</>
	);
}

export default App;
