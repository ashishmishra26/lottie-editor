import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  FeaturedAnimationsListResponseData,
  FeaturedAnimation,
} from "../types/types.js";

const {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
} = require("@apollo/client");

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://graphql.lottiefiles.com/2022-08", fetch }),
  cache: new InMemoryCache(),
});

export default async function featuredAnimationsController(
  fastify: FastifyInstance
) {
  fastify.get(
    "/",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { cursor } = request.query as Record<string, string>;
      const { data } = await client.query({
        query: gql`
          {
            featuredPublicAnimations(first: 12, after: ${cursor ? `"${cursor}"` : null}) {
              edges {
                cursor
                node {
                  id
                  gifUrl
                  name
                  likesCount
                  lottieUrl
                  url
                  jsonUrl
                  createdBy {
                    username
                    avatarUrl
                    firstName
                    lastName
                  }
                }
              }
            }
          }
        `,
      });

      const edges = data.featuredPublicAnimations.edges as {
        node: FeaturedAnimation;
        cursor: string;
      }[];

      const mappedData: FeaturedAnimationsListResponseData = {
        nextCursor: edges[edges.length - 1].cursor,
        animations: edges.map((edge) => {
          const {
            id,
            gifUrl,
            name,
            likesCount,
            url,
            lottieUrl,
            jsonUrl,
            createdBy: { username, avatarUrl, firstName, lastName },
          } = edge.node;

          return {
            id,
            cursor,
            gifUrl,
            name,
            likesCount,
            url,
            lottieUrl,
            jsonUrl,
            createdBy: {
              username,
              avatarUrl,
              firstName,
              lastName,
            },
          };
        }),
      };

      reply.send(mappedData);
    }
  );
}
