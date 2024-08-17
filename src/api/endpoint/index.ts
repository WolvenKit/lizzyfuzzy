import express from "express";
const router = express.Router();

import response from "./response";

router.use("/response", response);

export default router;
