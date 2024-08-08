import express from "express";
import client from "../../index";
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }

  const bans = await client.guilds.cache.get(req.query.server)?.bans.fetch()
  res.send(bans);

  const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeStyle: "medium",
  });

  console.log(`[${time}] `, "Roles sent");
});

export default router;
