import express from "express";
const router = express.Router();

import create from "./create";

router.use("/create", create);

export default router;
