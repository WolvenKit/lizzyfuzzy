import express from "express";
import { prisma } from "utils";
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await prisma.pass.findMany({
    select: {
      token: false,
      salt: false,
      id: true,
      username: true,
    },
  });

  return res.send(data);
});

export default router;
