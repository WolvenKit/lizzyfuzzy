import express from "express";
import client from "src";
import { prisma, log } from "utils";
const router = express.Router();

router.get("/data", async (req, res) => {
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
  
    res.send(data);
  
    log("Experimental Roles sent");
  });

  export default router;