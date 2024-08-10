import express from "express";
const router = express.Router();

import discord from "./discord";
import metrics from "./metrics";
import experimental from "./experimental";

router.use("/metrics", metrics);
router.use("/discord", discord);
router.use("/experimental", experimental);

router.get("/", (req, res) => {
  res.sendStatus(200);
});

export default router;
