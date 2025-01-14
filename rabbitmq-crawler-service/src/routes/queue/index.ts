import { channel } from "../../utils//rabbit-mq";
import { QUEUE_NAME } from "../../config";
import asyncHandler from "../../helpers/asyncHandler";
import express from "express";

const router = express.Router();
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { keywords, userId } = req.body;

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res
        .status(400)
        .json({ error: "Keywords must be a non-empty array" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const BATCH_SIZE = 10;
    const batches = [];
    for (let i = 0; i < keywords.length; i += BATCH_SIZE) {
      batches.push(keywords.slice(i, i + BATCH_SIZE));
    }

    try {
      for (const batch of batches) {
        for (const keyword of batch) {
          const payload = JSON.stringify({ userId, keyword });
          const isQueueFull = !channel.sendToQueue(
            QUEUE_NAME,
            Buffer.from(payload),
          );

          if (isQueueFull) {
            console.error(
              `Queue is full. Failed to enqueue keyword: ${keyword}`,
            );
            return res.status(503).json({
              error: `Queue is full. Failed to enqueue keyword: ${keyword}`,
            });
          }
        }
      }

      console.log(`All keywords enqueued successfully: ${keywords}`);
      res.status(200).json({ message: "All keywords enqueued successfully" });
    } catch (error) {
      console.error("Failed to enqueue keywords:", error);
      res
        .status(503)
        .json({ error: "Service unavailable. Failed to enqueue keywords." });
    }
  }),
);

export default router;
