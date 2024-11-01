import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyWebsocket from "@fastify/websocket";

import playgroundSocket from "./sockets/playgroundSocket";
import router from "./router";
import prismaPlugin from "./plugins/prisma";

const server = fastify({
  logger: true,
});

// CORS
server.register(cors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin ?? "").hostname;
    if (hostname === "localhost") {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  },
});

// Middleware: Router
server.register(router);
server.register(prismaPlugin);
server.register(fastifyWebsocket);

// Sockets
server.register(playgroundSocket);

export default server;
