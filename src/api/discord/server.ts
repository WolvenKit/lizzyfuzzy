import express from "express";
import client from "src";
import { log } from "utils";
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }

  const servers = await client.guilds.fetch(req.query.server);

  res.send(servers);

  log("Server sent");
});

export default router;
