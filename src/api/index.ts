import express from "express";
const router = express.Router();

import discord from "./discord";
import metrics from "./metrics";

router.use("/metrics", metrics)
router.use("/discord", discord);

export default router;