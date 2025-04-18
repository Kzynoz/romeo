import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import router from "./router/index.routes.js";
import morgan from "morgan";
import path from "path";

const PORT = process.env.PORT || process.env.LOCAL_PORT;
const HOST = process.env.DOMAIN || "localhost";
const base_url = "/api/v1";

const app = express();

app.use(morgan("dev")); // uniquement en phase de dev

app.use(
	cors({
    	origin: process.env.CLIENT_URL,
		credentials: true,
		methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Accept", "Authorization"],
	})
);

app.use(cookieParser());
app.use(express.json());

app.use("/public", express.static(path.join(process.cwd(), "public")));

// pour le dev
app.get("/", (req, res) => {
	res.json({ msg: "API is running" });
});

app.use(base_url, router);

app.use((req, res, next) => {
	res.status(404).json({
		message: "Page non trouvée.",
	});
});

// Middleware d'erreur
app.use((err, req, res, next) => {
	if (err.code === "ER_DUP_ENTRY") {
		res.status(409).json({
			message: `La donnée existe déjà.`,
		});
		return;
	}
	
	if (err.code === "ER_BAD_NULL_ERROR") {
		res.status(409).json({
			message: `La colonne ne peut pas être nulle.`,
		});
		return;
	}
	
	if (err.code === "ER_TRUNCATED_WRONG_VALUE") {
		res.status(409).json({
			message: `Le type de donnée n'est pas bon.`,
		});
		return;
	}
	
	res.status(500).json({
		message: "Une erreur est survenue. Veuillez essayer plus tard.",
	});
	return;
});

app.listen(PORT, () => console.log(`running at http://${HOST}:${PORT}`));
