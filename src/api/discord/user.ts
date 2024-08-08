import express from "express";
import client from "src";
import { User } from "discord.js";
import { prisma } from "utils";
import prm_client from "prom-client";

const router = express.Router();

const gauge_time_user = new prm_client.Gauge({
  name: "api_user_time",
  help: "Time taken to get roles",
});

const gauge_count_user = new prm_client.Gauge({
  name: "api_user_use_count",
  help: "Time taken to get roles",
});

router.post("/", async (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }
  gauge_time_user.setToCurrentTime();
  const end_user = gauge_time_user.startTimer();
  const Server = req.query.server.trim();

  const UserArray = req.body as string[];

  if (
    !UserArray ||
    !Array.isArray(UserArray) ||
    UserArray.length === 0 ||
    UserArray.some((user) => typeof user !== "string")
  ) {
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
        Image: fetchedUser.displayAvatarURL(),
        Discriminator: fetchedUser.discriminator,
        ID: fetchedUser.id,
        Bot: fetchedUser.bot,
        Roles: fetchedUser.client.guilds.cache
          .get(Server)
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

  const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeStyle: "medium",
  });

  res.send(users);
  end_user();
  gauge_count_user.inc(1);
  console.log(`[${time}] `, "Users sent");
});

const gauge_time_detail = new prm_client.Gauge({
  name: "api_detail_time",
  help: "Time taken to get roles",
});

const gauge_count_detail = new prm_client.Gauge({
  name: "api_detail_use_count",
  help: "Time taken to get roles",
});

router.post("/details", async (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }
  gauge_time_detail.setToCurrentTime();
  const end_detail = gauge_time_user.startTimer();
  const UserArray = req.body as string[];
  console.log(UserArray);

  if (
    !UserArray ||
    !Array.isArray(UserArray) ||
    UserArray.length === 0 ||
    UserArray.some((user) => typeof user !== "string")
  ) {
    return res.status(400).send("Invalid query");
  }

  const Users = await prisma.user.findMany({
    where: {
      userid: {
        in: UserArray,
      },
    },
  });

  res.send(Users);
  end_detail();
  gauge_count_detail.inc(1);
});

export default router;
