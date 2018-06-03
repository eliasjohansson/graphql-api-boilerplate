import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schemas';
import resolvers from './resolvers';

const schemas = [];

for (let i = 0; i < typeDefs.length; i += 1) {
  const schema = makeExecutableSchema({
    typeDefs: typeDefs[i],
    resolvers: resolvers[i],
  });
  schemas.push(schema);
}

const schema = mergeSchemas({ schemas });

export default schema;
