import { MikroORM, RequestContext } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import express from 'express';
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import path from "path";
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from "./resolvers/hello";
import 'reflect-metadata';
import { PostResolver } from "./resolvers/post";
const main = async () => {
    const orm = await MikroORM.init<PostgreSqlDriver>({
        dbName: 'reading',
        user: 'postgres',
        password: 'postgres',
        debug: !__prod__,
        type: "postgresql",
        entities: [Post],
        migrations: {
            path: path.join(__dirname, "./migrations"),
            glob: '!(*.d).{js,ts}'
        },
        allowGlobalContext: true
 
}); 
await orm.getMigrator().up();

const app = express();
const apolloServer = new ApolloServer({
    schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver],
        validate: false
    }),
    context: () => ({ em: orm.em})
})

await apolloServer.start();
apolloServer.applyMiddleware({ app });

app.listen(4000, () => {
    console.log('server started on localhost:4000')
});
// await RequestContext.createAsync(orm.em, async () => {
//     // inside this handler the `orm.em` will actually use the contextual fork, created via `RequestContext.createAsync()`
//     const post = orm.em.create(Post, {
//       title: "my first post",
//     });
//     await orm.em.persistAndFlush(post);

//     console.log("hello world!!")
};

main().catch((err)=>{
console.error('Error is:', err)
});