import express from 'express';
import http from 'http';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import schema from './schema';
import { PORT, MONGO_URI } from './utils/dotenv';

const app = express();
const server = http.Server(app);

app.use(cors());
app.use(bodyParser.json());

app.use('/graphql', graphqlExpress({ schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));


server.listen(PORT, () => {
  mongoose.connect(MONGO_URI);
  console.log(`Server running on localhost:${PORT}...`);
});
