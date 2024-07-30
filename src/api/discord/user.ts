import express from "express";
import client from "../../index";
import { User } from "discord.js";
const router = express.Router();

router.post("/", async (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }

  const UserArray = req.body as string[];

  if (!UserArray || !Array.isArray(UserArray) || UserArray.length === 0 || UserArray.some((user) => typeof user !== "string")) {
    return res.status(400).send("Invalid query");
  }

  const users = await Promise.all(
    UserArray.map(async (user) => {
      const fetchedUser: User = await client.users.fetch(String(user));
      if (!fetchedUser) {
        return {
          User: user,
          Error: "User not found",
        };
      }
      return {
        Username: fetchedUser.username,
        Discriminator: fetchedUser.discriminator,
        ID: fetchedUser.id,
        Bot: fetchedUser.bot,
        Roles: fetchedUser.client.guilds.cache
          .get(req.query.server as string)
          ?.members.cache.get(fetchedUser.id)
          ?.roles.cache.map((role) => {
            return {
              Role: role.name,
              ID: role.id,
            };
          }),
      };
    })
  );

  const time = new Date().toLocaleTimeString(
    'en-US',
    { hour12: true,
      timeStyle: 'medium'

     }
  );

  res.send(users);
  console.log(`[${time}]`, "Users sent");
});

export default router;
