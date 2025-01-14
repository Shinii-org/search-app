import amqp, { Channel, Connection } from "amqplib";
import { QUEUE_NAME, RABBITMQ_URL } from "../config";
export let connection: Connection;
export let channel: Channel;

export async function setupRabbitMQ() {
  try {
    // Connect RabbitMQ
    connection = await amqp.connect(RABBITMQ_URL, { heartbeat: 30 });
    console.log("RabbitMQ connected successfully.");

    // Reconnect if the connection close 
    connection.on("close", () => {
      console.error("RabbitMQ connection closed. Attempting to reconnect...");
      setTimeout(setupRabbitMQ, 5000); // Reconnect  
    });

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });

    // create channel
    channel = await connection.createChannel();

    // Ensure queue existed 
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`Queue "${QUEUE_NAME}" is ready.`);
  } catch (error) {
    setTimeout(setupRabbitMQ, 5000); //  Reconnect 
  }
}
