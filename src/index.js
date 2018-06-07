import express from 'express';
import http from 'http';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { formatError } from 'apollo-errors';
import schema from './schema';
import { PORT, MONGO_URI } from './utils/dotenv';
import jwtMiddleware from './utils/jwt-middleware';
import models from './models';

const app = express();
const server = http.Server(app);

app.use(cors());
app.use(bodyParser.json());
app.use(jwtMiddleware);

app.use(
  '/graphql',
  graphqlExpress(req => ({
    formatError,
    schema,
    context: {
      user: req.user,
      models,
    },
  })),
);
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));


server.listen(PORT, () => {
  mongoose.connect(MONGO_URI);
  console.log(`Server running on localhost:${PORT}...`);
});
