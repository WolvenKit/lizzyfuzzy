import express from "express";
import client from "../../index";
const router = express.Router();
import prm_client from "prom-client";

const gauge_time = new prm_client.Gauge({
  name: "api_role_time",
  help: "Time taken to get roles",
});

const gauge_count = new prm_client.Gauge({
  name: "api_role_use_count",
  help: "Time taken to get roles",
});

router.get("/", (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }
  gauge_time.setToCurrentTime();
  const end = gauge_time.startTimer();

  const send = [
    client.guilds.cache
      .get(req.query.server.trim())
      ?.roles.cache.map((role) => {
        return {
          Role: role.name,
          Members: role.members.map((member) => {
            return {
              Username: member.user.username,
              Discriminator: member.user.discriminator,
              ID: member.user.id,
              Bot: member.user.bot,
            };
          }),
        };
      }),
  ];

  res.send(send);
  end();
  gauge_count.inc(1);

  const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeStyle: "medium",
  });

  console.log(`[${time}] `, "Roles sent");
});

export default router;
