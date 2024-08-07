import express from "express";
import client from "../../index";
import prisma from "../../utils/prismaClient";

const router = express.Router();
const time = new Date().toLocaleTimeString("en-US", {
  hour12: true,
  timeStyle: "medium",
});

router.get("/users", async (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }

  res.send(
    await client.guilds.cache
      .get(req.query.server.trim())
      ?.members.fetch()
  );

  const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeStyle: "medium",
  });

  console.log(`[${time}] `, "Experimental Users sent");
});

router.get("/roles", async (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }

  res.send(
    await client.guilds.cache
      .get(req.query.server.trim())
      ?.roles.fetch()
  );

  const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeStyle: "medium",
  });

  console.log(`[${time}] `, "Experimental Roles sent");
});

router.get("/web", async (req, res) => {
  if (!req.query.server || typeof req.query.server !== "string") {
    return res.status(400).send("Invalid query");
  }

  const Members = await client.guilds.cache
    .get(req.query.server.trim())
    ?.members.fetch();

  const Users = await prisma.user.findMany();

  const data = Members?.reduce(
    (
      acc: {
        Username: string;
        Nickname: string | null;
        Image: string;
        ID: string;
        Bot: boolean;
        Roles: {
          Role: string;
          ID: string;
          Icon: string | null;
          Position: number;
        }[];
        CustomData: {} | null;
      }[],
      member
    ) => {
      acc.push({
        Username: member.user.username,
        Nickname: member.nickname,
        Image: member.user.displayAvatarURL(),
        ID: member.user.id,
        Bot: member.user.bot,
        Roles: member.roles.cache.map((role) => {
          return {
            Role: role.name,
            ID: role.id,
            Icon: role.iconURL(),
            Position: role.position,
          };
        }),
        CustomData: Users.find((a) => a.userid === member.user.id) || null,
      });
      return acc;
    },
    [] as {
      Username: string;
      Nickname: string | null;
      Image: string;
      ID: string;
      Bot: boolean;
      Roles: {
        Role: string;
        ID: string;
        Icon: string | null;
        Position: number;
      }[];
      CustomData: {} | null;
    }[]
  );

  console.dir(data, { depth: null });

  res.send(data);

  const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeStyle: "medium",
  });

  console.log(`[${time}] `, "Experimental Roles sent");
});

export default router;
