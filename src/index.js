import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { formatError } from 'apollo-errors';
import schema from './schema';
import { PORT, MONGO_URI } from './utils/dotenv';
import { addUserToReq } from './utils/auth';
import models from './models';

export const pubsub = new PubSub();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(addUserToReq);

const apollo = new ApolloServer({
  formatError,
  schema,
  context: async ({ req, connection }) => {
    if (connection) {
      return {};
    }
    return {
      user: req.user,
      models,
    };
  },
});

apollo.applyMiddleware({ app, path: '/graphql' });

// Create HTTP server with Subscriptions
const server = createServer(app);
apollo.installSubscriptionHandlers(server);

server.listen(PORT, () => {
  mongoose.connect(MONGO_URI);
  console.log(`🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${apollo.subscriptionsPath}`);
});
