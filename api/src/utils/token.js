import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default ({ alias, is_admin }) => {
  const PAYLOAD = {
    alias,
    is_admin,
  };

  const OPTIONS = {
    expiresIn: "1d",
  };

  return jwt.sign(PAYLOAD, SECRET, OPTIONS);
};
