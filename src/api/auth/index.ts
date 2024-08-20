import express from "express";
const router = express.Router();

import create from "./create";
import users from "./users";

router.use("/create", create);
router.use("/users", users);

export default router;
