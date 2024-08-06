import express from "express";
const router = express.Router();

import roles from "./roles";
import user from "./user";
import bans from "./bans";
import channels from "./channels";

router.use("/roles", roles);
router.use("/user", user);
router.use("/bans", bans);
router.use("/channels", channels);

export default router;
