import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default ({
  id,
  alias = null,
  is_admin = null,
  title = null,
  firstname = null,
  lastname = null,
}) => {
  const PAYLOAD = {
    id,
    alias: alias || `${title} ${firstname} ${lastname}`,
    is_admin: is_admin === 0 || is_admin === 1 ? is_admin : "tuteur",
  };

  const OPTIONS = {
    expiresIn: "1d",
  };

  return jwt.sign(PAYLOAD, SECRET, OPTIONS);
};
