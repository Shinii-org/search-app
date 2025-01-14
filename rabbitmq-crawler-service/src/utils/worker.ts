import { io } from "socket.io-client";
import { channel } from "./rabbit-mq";
import { crawlData } from "./crawler";
import { utapi } from "./uploadthing";
import { QUEUE_NAME, SOCKET_SERVER_URL } from "../config";

const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
});

export async function startWorker() {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized.");
  }

  console.log(`Worker is listening for messages in queue "${QUEUE_NAME}"...`);

  channel.consume(
    QUEUE_NAME,
    async (msg) => {
      if (msg) {
        const { userId, keyword } = JSON.parse(msg.content.toString());
        console.log(`Processing keyword: ${keyword} for user: ${userId}`);
        try {
          const data = await crawlData(keyword);
          if ("error" in data) {
            console.error(`Error for keyword "${keyword}":`, data.error);
            return;
          }

          const { totalAds, totalLinks, html } = data;
          const timestamp = new Date().toISOString();
          const htmlFile = new File([html], `${keyword}-${timestamp}.html`, {
            type: "text/html",
          });
          const response = await utapi.uploadFiles([htmlFile]);
          const result = {
            userId,
            value: keyword,
            totalAds,
            totalLinks,
            htmlPath: response[0]?.data?.url,
          };

          // Send result via Socket.IO
          socket.emit("crawler-result", result);
          console.log(`Result sent for keyword "${keyword}"`);
        } catch (error) {
       }

        // Acknowledge message
        channel.ack(msg);
      }
    },
    { noAck: false }, // Ensure message is not lost on failure
  );
}
