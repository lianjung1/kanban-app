import jwt from "jsonwebtoken";

export const generateToken = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development" ? true : false,
  });

  return token;
};
