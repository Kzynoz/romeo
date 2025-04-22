import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default (req, res, next) => {
  try {
    // Retrieve the JWT token from the cookies
    const token = req.cookies.jwt;

    // If no token is found, respond with an unauthorized error
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Accès refusé: token manquant.",
      });
    }
    
    // Verify the token using the secret key
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        const message =
          err.name === "TokenExpiredError"
            ? "Token expiré."
            : "Token invalide.";
        return res.status(403).json({
          success: false,
          error: message,
        });
      }

      // If token is valid, add the decoded user info to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la vérification du token.",
    });
  }
};
