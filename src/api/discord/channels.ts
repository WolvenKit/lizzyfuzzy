import express from "express";
import client from "src";
import { log } from "utils";
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }

  const channels = await client.guilds.cache.get(req.query.server)?.channels.fetch()

  res.send(channels);

  log("Roles sent");
});

export default router;