import express from "express";
import client from "../../index";
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }
  const send = [
    client.guilds.cache
      .get(req.query.server as string)
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

  const time = new Date().toLocaleTimeString(
    'en-US',
    { hour12: true,
      timeStyle: 'medium'

     }
  );

  console.log(`[${time}]`, "Roles sent");
});

export default router;
