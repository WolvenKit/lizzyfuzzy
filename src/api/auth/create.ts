import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

router.get("/", async (req, res) => {
  const body = req.body as { username: string; password: string };

  const token = jwt.sign(body, process.env.API_TOKEN);

  res.send(token);
});

export default router;
