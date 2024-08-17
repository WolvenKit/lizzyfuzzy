import express from "express";
import { prisma } from "utils";
const router = express.Router();

router.get("/", async (req, res) => {
  const data = (await prisma.quotes.findMany()) || [{ error: "No data found" }];

  res.send(data);
});

router.post("/", async (req, res) => {
  const data = req.body as { quote: string; responder: string };

  if (!data.responder) {
    return res.status(400).send("No responder provided");
  }

  if (!data) {
    return res.status(400).send("No data provided");
  }

  const quote = await prisma.quotes.create({
    data: {
      quote: data.quote,
      responder: data.responder,
    },
  });

  res.send(quote);
});

router.put("/", async (req, res) => {
  const data = req.body as [{ quote: string; responder: string }];

  if (!data) {
    return res.status(400).send("No data provided");
  }

  const quote = await prisma.quotes.createMany({
    data: data,
  });

  res.send(quote);
});

router.patch("/", async (req, res) => {
  const data = req.body as { id: string; quote: string; responder: string };

  if (!data.id) {
    return res.status(400).send("No id provided");
  }

  const quote = await prisma.quotes.update({
    where: { id: data.id },
    data: {
      quote: data.quote,
      responder: data.responder,
    },
  });

  res.send(quote);
});

export default router;
