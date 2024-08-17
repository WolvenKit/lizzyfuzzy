import express from "express";
const router = express.Router();

import discord from "./discord";
import metrics from "./metrics";
import experimental from "./experimental";
import endpoint from "./endpoint";

router.use("/metrics", metrics);
router.use("/discord", discord);
router.use("/experimental", experimental);
router.use("/endpoint", endpoint);

router.get("/", (req, res) => {
  res.sendStatus(200);
});

export default router;
