import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const exception = [
  "/api/metrics",
  "/api",
];

export function apiToken(req: Request, res: Response, next: any) {
  const url = req.originalUrl;
  const headers = req.headers["authorization"];

  if (exception.includes(url)) {
    return next();
  }

  if (!headers) {
    return res.status(401).send("Unauthorized");
  }

  const code = headers.split(" ")[1];

  try {
    const decode = jwt.verify(code, process.env.API_TOKEN);

    if (decode) {
      return next();
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
}
