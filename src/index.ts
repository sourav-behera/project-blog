import { ApolloServer } from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone"
import { schema } from "./schema";
import { context } from "./context";
const server = new ApolloServer({
    schema,
});
const PORT = parseInt(process.env.PORT as string)
async function startApolloServer() {
    const {url} = await startStandaloneServer(server,{
        listen : {port : PORT},
        context : async () => {
            return context
        }
    });
    console.log(`Server running on ${url}`);
}

startApolloServer()