import { Request, Response } from "express";

const exception = ["/api/metrics", "/api", "/favicon.ico"];

export function apiToken(req: Request, res: Response, next: any) {
  const url = req.originalUrl;
  if (exception.includes(url)) {
    return next();
  }
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized");
  }
  if (req.headers.authorization !== "Bearer " + process.env.API_TOKEN) {
    return res.status(403).send("Forbidden");
  }
  next();
}
