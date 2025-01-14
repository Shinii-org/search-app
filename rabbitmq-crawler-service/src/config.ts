import dotenv from "dotenv";
dotenv.config();

export const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
export const QUEUE_NAME = process.env.QUEUE_NAME || "keywords";
export const SOCKET_SERVER_URL =
  process.env.SOCKET_SERVER_URL || "http://localhost:3000";
export const PORT = process.env.PORT || 3001;
export const UPLOADTHING_TOKEN= process.env.UPLOADTHING_TOKEN || '';
