import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const jwtsecret: Secret = process.env.JWT_SECRET as string;

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization!.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    jwt.verify(token as string, jwtsecret) as JwtPayload;
    next(); // Token is valid, proceed
  } catch (err: unknown) {
    if (err instanceof jwt.JsonWebTokenError) {
      console.log(err);
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
