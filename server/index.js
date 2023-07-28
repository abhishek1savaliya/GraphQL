const express = require('express');
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const cors = require('cors')
const { default: axios } = require('axios')

const { USER } = require('./user')
const { TODOS } = require('./todo')

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
        type User{
          id: ID!
          name : String!
          username : String!
          email : String!
          phone : String!
          website : String!
        }
        type Todo{
            id: ID!
            title: String!
            completed: Boolean
            user: User
        }
        
        type Query{
            getToDos: [Todo]
            getAllUsers : [User]
            getUser(id: ID!): User
        }`,
        resolvers: {
            Todo: {
                user:  (todo) => USER.find(e=> e.id===todo.id)
            },
            Query: {
                getToDos:  () => TODOS,
                getAllUsers: USER,
                getUser: async (parent, { id }) => USER.find(e=> e.id===id),
            }
        }
    })

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    await server.start();

    app.use('/graphql', expressMiddleware(server));

    app.listen(8000, () => {
        console.log("SERVER RUNNING AT PORT 8000");
    });
}

startServer();
