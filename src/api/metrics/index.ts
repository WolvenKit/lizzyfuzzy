import express from "express";
import { collectDefaultMetrics, register } from "prom-client";

collectDefaultMetrics();

const router = express.Router();
const time = new Date().toLocaleTimeString("en-US", {
  hour12: true,
  timeStyle: "medium",
});

router.get("/", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

export default router;
