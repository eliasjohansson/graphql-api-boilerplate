import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import mongoose from 'mongoose';
import schema from './schema';

mongoose.connect('mongodb://localhost/graphql-test');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlExpress({ schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}...`));
