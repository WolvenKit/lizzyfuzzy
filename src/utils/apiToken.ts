import { Request, Response } from "express";

export default function Token(req: Request, res: Response, next: any) { 
    const url = req.originalUrl
    if ( url === "/api/metrics" || url === "/favicon.ico") {
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