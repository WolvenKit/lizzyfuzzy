import express from "express";
const router = express.Router();

import roles from "./roles";
import user from "./user";
import bans from "./bans";
import channels from "./channels";
import web from "./web";
import server from "./server";

router.use("/roles", roles);
router.use("/user", user);
router.use("/bans", bans);
router.use("/channels", channels);
router.use("/web", web);
router.use("/server", server);

export default router;
