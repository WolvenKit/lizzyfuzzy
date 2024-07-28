import { Request, Response } from "express";

export default function Token(req: Request, res: Response, next: any) { 
    if (!req.headers.authorization) {
        return res.status(401).send("Unauthorized");
    }
    if (req.headers.authorization !== "Bearer " + process.env.API_TOKEN) {
        return res.status(403).send("Forbidden");
    }
    next();
}