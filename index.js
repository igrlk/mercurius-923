'use strict'

const Fastify = require('fastify')
const mercurius = require('mercurius')

const app = Fastify({ logger: true })

const schema = `
  type Query {
    hello: String!
  }
`

const sleep = (seconds) => { return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }

const resolvers = {
  Query: {
    hello: async (_, __, ctx) => {
      ctx.reply.request.raw.on('close', () => {
        console.log('closed');
      });

      console.log('1');
      await sleep(0.5);
      console.log('2');
      await sleep(0.5);
      console.log('3');

      return 'World';
    }
  }
}

app.register(mercurius, {
  schema,
  resolvers,
})

// post "/" works fine and request is closed after query is resolved
// post "/graphql" doesn't work fine and request is closed BEFORE query is resolved

app.post('/', async function (req, reply) {
  const query = '{ hello }'
  return reply.graphql(query)
})

app.listen({ port: 3000 })
