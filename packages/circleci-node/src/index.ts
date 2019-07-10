import "reflect-metadata";
import { createConnection, getConnectionOptions, Connection } from "typeorm";
import { User } from "./entity/User";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const createTypeormConn = async (): Promise<Connection> => {
  const connectionOptions = (await getConnectionOptions(
    process.env.NODE_ENV
  )) as PostgresConnectionOptions;
  return process.env.NODE_ENV === "production"
    ? createConnection({
        ...connectionOptions,
        url: process.env.DATABASE_URL,
      })
    : createConnection({ ...connectionOptions });
};
createTypeormConn()
  .then(async connection => {
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber8";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");
  })
  .catch(error => console.log(error));
