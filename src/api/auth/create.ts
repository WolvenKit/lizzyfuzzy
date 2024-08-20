import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "utils";
import { sha512 } from "js-sha512";
import crypto from "node:crypto";
const router = express.Router();

router.get("/", async (req, res) => {
  const body = req.body as { username: string; password: string };

  if (!body.username || !body.password) {
    return res.status(403).send("Missing Username or Password");
  }

  const salt = crypto.randomBytes(16).toString("base64");
  const tokens = sha512(body.password + salt);

  const token = jwt.sign(body, process.env.API_TOKEN);
  console.log(token);

  const user = await prisma.pass.findUnique({
    where: {
      username: body.username,
    },
  });

  if (user) {
    return res.status(403).send("User already exists");
  }

  const data = await prisma.pass.create({
    data: {
      username: body.username,
      token: tokens,
      salt: salt,
      jwt: token,
    },
  });

  console.log(data);

  return res.send(token);
});

export default router;
