import express from "express";
const router = express.Router();

import discord from "./discord";

router.use("/discord", discord);

export default router;