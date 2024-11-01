import { FastifyInstance } from "fastify";
import featuredAnimationController from "./controller/featuredAnimationController";
import playgroundController from "./controller/playgroundController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(featuredAnimationController, {
    prefix: "/api/v1/featuredAnimations",
  });
  fastify.register(playgroundController, {
    prefix: "/api/v1/playground",
  });
}
