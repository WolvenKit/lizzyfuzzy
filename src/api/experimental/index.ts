import express from "express";
import client from "../../index";

const router = express.Router();
const time = new Date().toLocaleTimeString("en-US", {
  hour12: true,
  timeStyle: "medium",
});

router.get("/users", async (req, res) => {
    if (!req.query.server || typeof req.query.server !== "string") {
        return res.status(400).send("Invalid query");
      }

      res.send(await client.guilds.cache.get(req.query.server.trim() as string)?.members.fetch());
    
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: true,
        timeStyle: "medium",
      });
    
      console.log(`[${time}] `, "Roles sent");
});

router.get("/roles", async (req, res) => {
    if (!req.query.server || typeof req.query.server !== "string") {
        return res.status(400).send("Invalid query");
      }

      res.send(await client.guilds.cache.get(req.query.server.trim() as string)?.roles.fetch());
    
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: true,
        timeStyle: "medium",
      });
    
      console.log(`[${time}] `, "Roles sent");
  });

export default router;
