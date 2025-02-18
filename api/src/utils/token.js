import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default ({ id, alias, is_admin }) => {
  const PAYLOAD = {
    id,
    alias,
    is_admin,
  };

  const OPTIONS = {
    expiresIn: "1d",
  };

  return jwt.sign(PAYLOAD, SECRET, OPTIONS);
};
