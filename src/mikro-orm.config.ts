import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { Options } from "@mikro-orm/core";
import path from "path";

const config: Options = {
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

};
export default config;