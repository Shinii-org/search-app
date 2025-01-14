import { SOCKET_IO_EVENTS } from "./src/constants";

import { createOrUpdateKeyword } from "./src/lib/actions";
import { PostKeyword } from "@/types/keyword";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Worker connected:", socket.id);

    //  Listen event result from crawler
    socket.on(SOCKET_IO_EVENTS.CRAWLER_RESULT, async (data: PostKeyword) => {
      // TODO save to database
      await createOrUpdateKeyword(data).then((value) => {
     
        io.emit(SOCKET_IO_EVENTS.UPDATE_KEYWORD, {
          userId: data.userId,
          ...value,
        });
      });
      // If sucess update to client
    });

    socket.on("disconnect", () => {
      console.log("Worker disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
